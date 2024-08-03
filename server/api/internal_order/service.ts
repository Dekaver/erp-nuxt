import { desc, eq, getTableColumns, inArray, ne, or, sql } from "drizzle-orm";
import { NotFoundError, ValidationError } from "../../libs/errors";
import { alias } from "drizzle-orm/pg-core";
import { ParsedQs } from "qs";
import { barang } from "../barang/schema";
import { gudang } from "../gudang/schema";
import { pegawai } from "../pegawai/schema";
import { satuan } from "../satuan/schema";
import { internalOrderColumns, internal_order, InternalOrder, internalOrderDetailColumns, internal_order_detail, NewInternalOrder, NewInternalOrderDetail, InternalOrderDetail } from "./schema";

export const getInternalOrder = async (status: string | ParsedQs | string[] | ParsedQs[] | undefined, tx = db) => {
    const gudang_asal = alias(gudang, "gudang_asal");
    const gudang_tujuan = alias(gudang, "gudang_tujuan");
    const send_by = alias(pegawai, "send_by");

    let query = tx
        .select({
            ...internalOrderColumns,
            gudang_asal: gudang_asal.gudang,
            gudang_tujuan: gudang_tujuan.gudang,
            created_name: pegawai.nama,
        })
        .from(internal_order)
        .innerJoin(gudang_asal, eq(gudang_asal.id, internal_order.id_gudang_asal))
        .innerJoin(gudang_tujuan, eq(gudang_tujuan.id, internal_order.id_gudang_tujuan))
        .innerJoin(pegawai, eq(pegawai.id, internal_order.created_by));
    // .where(or(ne(internal_order.status, 'D'), and(eq(internal_order.status, 'D'), eq(internal_order.created_by, id as number))))
    console.log(status, typeof status);

    // if (status != undefined) {
    //     switch (typeof status) {
    //         case "string":
    //             query = query.where(eq(internal_order.status, status));
    //             break;
    //         case "object":
    //             query = query.where(inArray(internal_order.status, status as string[]));
    //             break;
    //         default:
    //             break;
    //     }
    // }
    return await query.orderBy(desc(internal_order.tanggal), desc(internal_order.nomor));
};

export const getOptionInternalOrder = async (status: string | ParsedQs | string[] | ParsedQs[] | undefined, tx = db) => {
    const gudang_asal = alias(gudang, "gudang_asal");
    const gudang_tujuan = alias(gudang, "gudang_tujuan");
    const send_by = alias(pegawai, "send_by");

    let query = tx
        .select({
            id: internal_order.id,
            nomor: internal_order.nomor,
            tanggal: internal_order.tanggal,
            gudang_asal: gudang_asal.gudang,
            gudang_tujuan: gudang_tujuan.gudang,
            created_name: pegawai.nama,
        })
        .from(internal_order)
        .innerJoin(gudang_asal, eq(gudang_asal.id, internal_order.id_gudang_asal))
        .innerJoin(gudang_tujuan, eq(gudang_tujuan.id, internal_order.id_gudang_tujuan))
        .innerJoin(pegawai, eq(pegawai.id, internal_order.created_by));
    // .where(or(ne(internal_order.status, 'D'), and(eq(internal_order.status, 'D'), eq(internal_order.created_by, id as number))))

    // if (status != undefined) {
    //     switch (typeof status) {
    //         case "string":
    //             query = query.where(eq(internal_order.status, status));
    //             break;
    //         case "object":
    //             query = query.where(inArray(internal_order.status, status as string[]));
    //             break;
    //         default:
    //             break;
    //     }
    // }
    return await query.orderBy(desc(internal_order.tanggal), desc(internal_order.nomor));
};

export const getInternalOrderById = async (id: InternalOrder["id"]) => {
    const send_by = alias(pegawai, "send_by");
    const gudang_asal = alias(gudang, "gudang_asal");
    const gudang_tujuan = alias(gudang, "gudang_tujuan");
    const [data] = await db
        .select({
            ...internalOrderColumns,
            send_nama: send_by.nama,
            created_name: pegawai.nama,
            gudang_asal: gudang_asal.gudang,
            gudang_tujuan: gudang_tujuan.gudang,
        })
        .from(internal_order)
        .innerJoin(pegawai, eq(pegawai.id, internal_order.created_by))
        .leftJoin(send_by, eq(send_by.id, internal_order.send_by))
        .innerJoin(gudang_asal, eq(gudang_asal.id, internal_order.id_gudang_asal))
        .innerJoin(gudang_tujuan, eq(gudang_tujuan.id, internal_order.id_gudang_tujuan))
        .where(eq(internal_order.id, id));
    if (data == undefined) {
        throw NotFoundError("Internal Order tidak Di temukan");
    }
    const data_detail = await db
        .select({
            ...internalOrderDetailColumns,
            nama_barang: barang.nama_barang,
            kode_barang: barang.kode_barang,
        })
        .from(internal_order_detail)
        .innerJoin(barang, eq(barang.id, internal_order_detail.id_barang))
        .innerJoin(satuan, eq(satuan.id, internal_order_detail.id_satuan))
        .where(eq(internal_order_detail.id, data.id))
        .orderBy(internal_order_detail.urut);

    const mergeData = { ...data, detail: data_detail };

    return mergeData;
};

export const createInternalOrder = async (newInternalOrder: NewInternalOrder, tx = db) => {
    try {
        const [data] = await tx.insert(internal_order).values(newInternalOrder).returning();
        return data;
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};

export const getInternalOrderDetail = async (id: NewInternalOrderDetail["id"], tx = db) => {
    try {
        const data = await tx.select().from(internal_order_detail).where(eq(internal_order_detail.id, id));
        return data;
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};

export const createInternalOrderDetail = async (id: NewInternalOrderDetail["id"], lDetail: NewInternalOrderDetail[], tx = db) => {
    try {
        const returning: InternalOrderDetail[] = await tx.transaction(async (tx) => {
            await tx.delete(internal_order_detail).where(eq(internal_order_detail.id, id));
            const data = await tx.insert(internal_order_detail).values(lDetail).returning();
            return data;
        });
        return returning;
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};

export const updateInternalOrder = async (id: InternalOrder["id"], form: NewInternalOrder, tx = db) => {
    try {
        const returning: any = await tx.transaction(async (tx) => {
            const [data] = await tx
                .update(internal_order)
                .set({
                    id_gudang_asal: form.id_gudang_asal,
                    id_gudang_tujuan: form.id_gudang_tujuan,
                    status: form.status,
                    tanggal: form.tanggal,
                    keterangan: form.keterangan,
                    send_by: form.status === "O" ? form.modified_by : null,
                    send_date: form.status === "O" ? sql.raw(`CURRENT_TIMESTAMP`) : null,
                    modified_by: form.modified_by,
                    modified_date: sql.raw(`CURRENT_TIMESTAMP`),
                })
                .where(eq(internal_order.id, id))
                .returning();
            return data;
        });
        return returning;
    } catch (error) {
        console.error(error);
        throw NotFoundError("error");
    }
};

export const deleteInternalOrder = async (id: InternalOrder["id"]) => {
    try {
        await db.transaction(async (tx) => {
            await tx
                .delete(internal_order_detail)
                .where(eq(internal_order_detail.id, id))
                .then(async () => {
                    const data = await tx.delete(internal_order).where(eq(internal_order.id, id));
                });
        });
        return 1;
    } catch (error) {
        console.error(error);
        throw NotFoundError("Gagal Hapus Internal Order");
    }
};

export const updateStatusInternalOrder = async (id: InternalOrder["id"], status: InternalOrder["status"], tx = db) => {
    try {
        const returning = await tx.transaction(async (tx) => {
            const [data] = await tx.update(internal_order).set({ status: status }).where(eq(internal_order.id, id)).returning();

            return data;
        });
        return returning;
    } catch (error) {
        throw NotFoundError("error");
    }
};

export const checkSisaDetail = async (id: InternalOrder["id"], tx = db) => {
    try {
        const [data] = await tx
            .select({ sisa: sql<number>`sum(sisa)` })
            .from(internal_order)
            .innerJoin(internal_order_detail, eq(internal_order_detail.id, internal_order.id))
            .where(eq(internal_order.id, id));
        if (!data) {
            throw NotFoundError("tidak ada detail sales_order");
        }

        return data.sisa;
    } catch (error) {
        throw NotFoundError("error");
    }
};
