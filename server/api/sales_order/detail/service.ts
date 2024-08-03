import { sql, eq } from "drizzle-orm";

import { proyek } from "../../proyek/schema";
import { satuan } from "../../satuan/schema";
import { SalesOrderDetail, salesOrderDetailColumns, sales_order_detail, NewSalesOrderDetail } from "./schema";

export const getSalesOrderDetailById = async (id: SalesOrderDetail["id"], tx = db) => {
    const data = await tx
        .select({
            ...salesOrderDetailColumns,
            satuan: satuan.satuan,
            proyek: proyek.proyek,
            type: sql<string>`CASE WHEN sales_order_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END`,
        })
        .from(sales_order_detail)
        .leftJoin(satuan, eq(satuan.id, sales_order_detail.id_satuan))
        .leftJoin(proyek, eq(proyek.id, sales_order_detail.id_proyek))
        .where(eq(sales_order_detail.id, id))
        .orderBy(sales_order_detail.urut);
    return data;
};

export const createSalesOrderDetail = async (form: NewSalesOrderDetail[], tx = db) => {
    const data = await tx.insert(sales_order_detail).values(form).returning();
    return data;
};

export const updateSalesOrderDetail = async (id: SalesOrderDetail["id"], form: SalesOrderDetail[], tx = db) => {
    const data = await tx.transaction(async (trx) => {
        await deleteSalesOrderDetail(id, trx);
        return await createSalesOrderDetail(form, trx);
    });
    return data;
};

export const deleteSalesOrderDetail = async (id: SalesOrderDetail["id"], tx = db) => {
    const data = await tx.delete(sales_order_detail).where(eq(sales_order_detail.id, id));
    return data;
};