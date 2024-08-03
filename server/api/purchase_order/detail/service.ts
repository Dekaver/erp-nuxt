import { and, asc, eq, sql } from "drizzle-orm";

import { NewPurchaseOrderDetail, PurchaseOrderDetail, poDetailColumns, purchase_order_detail } from "./schema";
import { barang, barang_satuan } from "../../barang/schema";
import { satuan } from "../../satuan/schema";
import { kategori_barang } from "../../kategori_barang/schema";
import { account } from "../../account/schema";
import { proyek } from "../../proyek/schema";
import { brand } from "../../brand/schema";
import { PurchaseOrder, purchase_order } from "../schema";
import { purchase_request } from "../../purchase_request/schema";


export const getPurchaseOrderDetailById = async (params: PurchaseOrderDetail["id"], with_pb = false, tx = db) => {
    let data = [];
    if (with_pb) {
        data = await tx.execute(
            sql.raw(`
			SELECT
				penerimaan_barang_detail.diorder as qty,
				penerimaan_barang_detail.*,
				purchase_order_detail.harga,
				purchase_order_detail.diskonrp,
				purchase_order_detail.id_pajak,
				purchase_order_detail.diskonpersen,
				satuan.satuan,
				barang.kode_barang,
				barang.is_stok,
				brand.brand,
                proyek.proyek,
				kategori_barang.kategori_barang,
				kategori_barang.id_account,
				account.name as account_name,
                purchase_request.nomor as nomor_pr,
				account.code as account_code,
				CASE WHEN purchase_order_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END as type,
				CASE WHEN purchase_order_detail.id_barang IS NOT NULL AND barang.is_stok THEN TRUE ELSE FALSE END as with_pb
			FROM
				penerimaan_barang_detail
			LEFT JOIN purchase_order_detail ON purchase_order_detail.id = penerimaan_barang_detail.id_po AND purchase_order_detail.urut = penerimaan_barang_detail.urut_po
			LEFT JOIN satuan ON satuan.id = purchase_order_detail.id_satuan
			LEFT JOIN barang ON barang.id = purchase_order_detail.id_barang
			LEFT JOIN kategori_barang ON kategori_barang.id = barang.id_kategori
			LEFT JOIN account ON account.id = kategori_barang.id_account
			LEFT JOIN brand ON brand.id = barang.id_brand
            LEFT JOIN purchase_request ON purchase_request.id = purchase_order_detail.id_pr
			LEFT JOIN proyek ON proyek.id = penerimaan_barang_detail.id_proyek
			WHERE
				EXISTS (
					SELECT 1
					FROM penerimaan_barang pb
					WHERE pb.id = penerimaan_barang_detail.id
					AND NOT EXISTS (
						SELECT 1
						FROM ap_detail
						WHERE ap_detail.id_penerimaan_barang = pb.id
						AND ap_detail.id_penerimaan_barang IS NOT NULL
					)
				)
				AND penerimaan_barang_detail.id_po = ${params}
			ORDER BY penerimaan_barang_detail.urut_po ASC`),
        );
    } else {
        data = await tx
            .select({
                ...poDetailColumns,
                kode_barang: barang.kode_barang,
                satuan_asli: barang.id_satuan,
                satuan: satuan.satuan,
                konversi: barang_satuan.konversi,
                kategori_barang: kategori_barang.kategori_barang,
                id_account: kategori_barang.id_account,
                account_name: account.name,
                account_code: account.code,
                proyek: proyek.proyek,
                nomor_pr: purchase_request.nomor,
                brand: brand.brand,
                type: sql<string>`CASE WHEN purchase_order_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END`,
                with_pb: sql`CASE WHEN purchase_order_detail.id_barang IS NOT NULL AND barang.is_stok THEN TRUE ELSE FALSE END as with_pb`,
            })
            .from(purchase_order_detail)
            .leftJoin(barang, eq(purchase_order_detail.id_barang, barang.id))
            .leftJoin(brand, eq(barang.id_brand, brand.id))
            .leftJoin(satuan, eq(purchase_order_detail.id_satuan, satuan.id))
            .leftJoin(barang_satuan, and(eq(barang_satuan.id_barang, barang.id), eq(barang_satuan.id_satuan, satuan.id)))
            .leftJoin(kategori_barang, eq(kategori_barang.id, barang.id_kategori))
            .leftJoin(account, eq(account.id, kategori_barang.id_account))
            .leftJoin(proyek, eq(proyek.id, purchase_order_detail.id_proyek))
            .leftJoin(purchase_request, eq(purchase_request.id, purchase_order_detail.id_pr))
            .where(eq(purchase_order_detail.id, params))
            .orderBy(asc(purchase_order_detail.urut));
    }

    return data;
};

export const getPurchaseOrderDetailByIdPurchaseRequest = async (id: PurchaseOrderDetail['id_pr'], tx = db) => {
    return await tx.select().from(purchase_order_detail).where(eq(purchase_order_detail.id_pr, id as number)).orderBy(purchase_order_detail.urut)
}


export const createPurchaseOrderDetail = async (params: NewPurchaseOrderDetail[], tx = db) => {
    const data = await tx.insert(purchase_order_detail).values(params).returning();
    return data;
};

export const updatePurchaseOrderDetail = async (params: PurchaseOrderDetail["id"], form: NewPurchaseOrderDetail[], tx = db) => {
    const data = await tx.transaction(async (trx) => {
        await deletePurchaseOrderDetail(params, trx);
        return await createPurchaseOrderDetail(form, trx);
    });
    return data;
};

export const deletePurchaseOrderDetail = async (id: PurchaseOrderDetail["id"], tx = db) => {
    return await tx.delete(purchase_order_detail).where(eq(purchase_order_detail.id, id)).returning();
};


export const getHppFromPurchaseOrderDetail = async (id: PurchaseOrderDetail["id"], urut: PurchaseOrderDetail["urut"], tx = db) => {
    const [data] = await tx
        .select({
            hpp: purchase_order_detail.harga,
        })
        .from(purchase_order_detail)
        .where(and(eq(purchase_order_detail.id, id), eq(purchase_order_detail.urut, urut as number)));

    if (data == undefined) {
        return "0";
    }
    return data.hpp;
};

export const updateSisaPurchaseOrderDetail = async (id: PurchaseOrderDetail["id"], urut: PurchaseOrderDetail["urut"], diambil: PurchaseOrderDetail["diambil"], tx = db) => {
    const dataDetail = await tx
        .update(purchase_order_detail)
        .set({
            diambil: sql`diambil + ${diambil}`,
            sisa: sql`sisa - ${diambil}`,
        })
        .where(and(eq(purchase_order_detail.id, id), eq(purchase_order_detail.urut, urut as number)));
    return dataDetail;
};

export const updateStatusDariPODetail = async (id: PurchaseOrder["id"], tx = db) => {
    const [data] = await tx
        .update(purchase_order)
        .set({
            status: sql`CASE WHEN (SELECT COUNT(*) FROM purchase_order_detail WHERE purchase_order_detail.id = purchase_order.id AND purchase_order_detail.sisa > 0) > 0 THEN 'P' ELSE 'C' END`,
        })
        .where(eq(purchase_order.id, id))
        .returning();

    return data;
};
