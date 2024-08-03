import { sql, eq } from "drizzle-orm";
import { barang } from "../../barang/schema";
import { brand } from "../../brand/schema";
import { satuan } from "../../satuan/schema";
import { DeliveryOrderDetail, deliveryOrderDetailColumns, delivery_order_detail, NewDeliveryOrderDetail } from "./schema";

export const getDeliveryOrderDetailById = async (id: DeliveryOrderDetail["id"], tx = db) => {
    const data = await tx
        .select({
            ...deliveryOrderDetailColumns,
            kode_barang: barang.kode_barang,
            brand: brand.brand,
            satuan: satuan.satuan,
            type: sql<string>`CASE WHEN delivery_order_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END`,
        })
        .from(delivery_order_detail)
        .leftJoin(barang, eq(barang.id, delivery_order_detail.id_barang))
        .leftJoin(brand, eq(brand.id, barang.id_brand))
        .leftJoin(satuan, eq(satuan.id, delivery_order_detail.id_satuan))
        .where(eq(delivery_order_detail.id, id));
    return data;
};

export const createDeliveryOrderDetail = async (form: NewDeliveryOrderDetail[], tx = db) => {
    const data = await tx.insert(delivery_order_detail).values(form).returning();
    return data;
};

export const updateDeliveryOrderDetail = async (id: DeliveryOrderDetail["id"], form: DeliveryOrderDetail[], tx = db) => {
    const data = await tx.transaction(async (trx) => {
        await deleteDeliveryOrderDetail(id, trx);
        return await createDeliveryOrderDetail(form, trx);
    });
    return data;
};

export const deleteDeliveryOrderDetail = async (id: NewDeliveryOrderDetail["id"], tx = db) => {
    const data = await tx.delete(delivery_order_detail).where(eq(delivery_order_detail.id, id));
    return data;
};

export const updateDiterimaDeliveryOrder = async (id: number, tx = db) => {
    const data = await tx
        .update(delivery_order_detail)
        .set({
            qty_diterima: sql`qty`,
        })
        .where(eq(delivery_order_detail.id, id));
    return data;
};
