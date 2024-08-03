import { eq, sql } from "drizzle-orm";

import { ValidationError } from "../../../libs/errors";
import { NewInvoiceDetail, invoice_detail, invoiceDetailColumns } from "./schema";
import { barang } from "../../barang/schema";
import { satuan } from "../../satuan/schema";
import { proyek } from "../../proyek/schema";
import { delivery_order } from "../../delivery_order/schema";

export const getInvoiceDetail = async (id: NewInvoiceDetail["id"], tx = db) => {
    try {
        return await tx
        .select({
            ...invoiceDetailColumns,
            kode_barang: barang.kode_barang,
            satuan: satuan.satuan,
            is_stok: barang.is_stok,
            id_account_harga_beli: barang.id_account_harga_beli,
            proyek: proyek.proyek,
            nomor_do: delivery_order.nomor,
            type: sql<string>`CASE WHEN invoice_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END`,
        })
        .from(invoice_detail)
        .leftJoin(barang, eq(barang.id, invoice_detail.id_barang))
        .leftJoin(satuan, eq(satuan.id, invoice_detail.id_satuan))
        .leftJoin(proyek, eq(proyek.id, invoice_detail.id_proyek))
        .leftJoin(delivery_order, eq(delivery_order.id, invoice_detail.id_do))
        .where(eq(invoice_detail.id, id))
        .orderBy(invoice_detail.urut);
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};

export const createInvoiceDetail = async (form: NewInvoiceDetail[], tx = db) => {
    try {
        return await tx.insert(invoice_detail).values(form).returning();
        
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};

export const deleteInvoiceDetail = async (id: NewInvoiceDetail["id"], tx = db) => {
    try {
        return await tx.delete(invoice_detail).where(eq(invoice_detail.id, id)).returning();
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};