import { and, asc, desc, eq, gt, SQL, sql } from "drizzle-orm";


import { account } from "../../account/schema";
import { barang, barang_satuan } from "../../barang/schema";
import { brand } from "../../brand/schema";
import { kategori_barang } from "../../kategori_barang/schema";
import { pegawai } from "../../pegawai/schema";
import { proyek } from "../../proyek/schema";
import { satuan } from "../../satuan/schema";
import { purchase_request } from "../schema";
import { NewPurchaseRequestDetail, PurchaseRequestDetail, purchase_request_detail, purchaseOrderDetailColumns } from "./schema";

export const getOptionPurchaseRequestDetail = async (module: string, tx = db) => {
    const whereConditioal: SQL[] = [];
    if (module === "po") {
        // whereConditioal.push(notInArray(purchase_request.id, sql`(select id_pr from purchase_order_detail)`));
    }
    const data = await tx
        .select({
            ...purchaseOrderDetailColumns,
            nomor: purchase_request.nomor,
            tgl_dibutuhkan: purchase_request.tgl_dibutuhkan,
            satuan: satuan.satuan,
            diminta_oleh: pegawai.nama,
            sisa: sql`"purchase_request_detail"."qty" - "purchase_request_detail"."diorder" - COALESCE(
                (SELECT SUM("purchase_order_detail"."qty")
                 FROM "purchase_order_detail"
                 INNER JOIN "purchase_order" on "purchase_order_detail"."id" = "purchase_order"."id"
                 WHERE "purchase_order_detail"."id_pr" = "purchase_request_detail"."id"
                 AND "purchase_order"."status" = 'D'
                   AND "purchase_order_detail"."urut_pr" = "purchase_request_detail"."urut"
                ), 0)`.as("sisa"),
            total_order: sql`"purchase_request_detail"."diorder" + COALESCE(
                (SELECT SUM("purchase_order_detail"."qty")
                 FROM "purchase_order_detail"
                 INNER JOIN "purchase_order" on "purchase_order_detail"."id" = "purchase_order"."id"
                 WHERE "purchase_order_detail"."id_pr" = "purchase_request_detail"."id"
                 AND "purchase_order"."status" = 'D'
                   AND "purchase_order_detail"."urut_pr" = "purchase_request_detail"."urut"
                ), 0)`.as("sisa"),
        })
        .from(purchase_request_detail)
        .innerJoin(purchase_request, eq(purchase_request.id, purchase_request_detail.id))
        .innerJoin(pegawai, eq(pegawai.id, purchase_request.created_by))
        .innerJoin(satuan, eq(satuan.id, purchase_request_detail.id_satuan))
        .where(
            and(
                ...whereConditioal,
                eq(purchase_request.status, "O"),
                gt(
                    sql`"purchase_request_detail"."qty" - "purchase_request_detail"."diorder"`,
                    sql`COALESCE(
                        (SELECT SUM("purchase_order_detail"."qty")
                        FROM "purchase_order_detail"
                        INNER JOIN "purchase_order" on "purchase_order_detail"."id" = "purchase_order"."id"
                        WHERE "purchase_order_detail"."id_pr" = "purchase_request_detail"."id"
                        AND "purchase_order"."status" = 'D'
                        AND "purchase_order_detail"."urut_pr" = "purchase_request_detail"."urut"
                        ), 0)`,
                ),
            ),
        )
        .orderBy(desc(purchase_request.tanggal), desc(purchase_request.nomor), asc(purchase_request_detail.urut));
    return data;
};

export const getPurchaseRequestDetailById = async (params: PurchaseRequestDetail["id"], with_pb = false, tx = db) => {
    const data = await tx
        .select({
            ...purchaseOrderDetailColumns,
            kode_barang: barang.kode_barang,
            satuan_asli: barang.id_satuan,
            satuan: satuan.satuan,
            konversi: barang_satuan.konversi,
            kategori_barang: kategori_barang.kategori_barang,
            id_account: kategori_barang.id_account,
            account_name: account.name,
            account_code: account.code,
            brand: brand.brand,
            proyek: proyek.proyek,
            type: sql<string>`CASE WHEN purchase_request_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END`,
            with_pb: sql`CASE WHEN purchase_request_detail.id_barang IS NOT NULL AND barang.is_stok THEN TRUE ELSE FALSE END as with_pb`,
        })
        .from(purchase_request_detail)
        .leftJoin(barang, eq(purchase_request_detail.id_barang, barang.id))
        .leftJoin(brand, eq(barang.id_brand, brand.id))
        .leftJoin(satuan, eq(purchase_request_detail.id_satuan, satuan.id))
        .leftJoin(barang_satuan, and(eq(barang_satuan.id_barang, barang.id), eq(barang_satuan.id_satuan, satuan.id)))
        .leftJoin(kategori_barang, eq(kategori_barang.id, barang.id_kategori))
        .leftJoin(account, eq(account.id, kategori_barang.id_account))
        .leftJoin(proyek, eq(proyek.id, purchase_request_detail.id_proyek))
        .where(eq(purchase_request_detail.id, params))
        .orderBy(asc(purchase_request_detail.urut));

    return data;
};

export const createPurchaseRequestDetail = async (params: NewPurchaseRequestDetail, tx = db) => {
    const [data] = await tx.insert(purchase_request_detail).values(params).returning();
    return data;
};

export const updatePurchaseRequestDetail = async (params: PurchaseRequestDetail["id"], form: NewPurchaseRequestDetail, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        await deletePurchaseRequestDetail(params, trx);
        return await createPurchaseRequestDetail(form, trx);
    });
    return data;
};

export const updateDiorderPurchaseRequestDetail = async (id: PurchaseRequestDetail["id"], urut: PurchaseRequestDetail["urut"], diorder: PurchaseRequestDetail["diorder"], tx = db) => {
    return await tx
        .update(purchase_request_detail)
        .set({ diorder: sql`diorder + ${diorder}` })
        .where(and(eq(purchase_request_detail.id, id), eq(purchase_request_detail.urut, urut)));
};

export const deletePurchaseRequestDetail = async (id: PurchaseRequestDetail["id"], tx = db) => {
    const [data] = await tx.delete(purchase_request_detail).where(eq(purchase_request_detail.id, id)).returning();
    return data;
};
