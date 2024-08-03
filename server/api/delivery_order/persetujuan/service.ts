import { and, eq, sql } from "drizzle-orm";


import { delivery_order } from "../schema";
import { insertDeliveryOrderPersetujuanSchema, delivery_order_persetujuan, DeliveryOrderPersetujuan, deliveryOrderPersetujuanColumn } from "./schema";
import { getPegawaiById } from "../../pegawai/service";
import { pegawai } from "../../pegawai/schema";
import { jabatan } from "../../jabatan/schema";
import { getDeliveryOrderById, updateStatusDoSend } from "../service";
import { getDeliveryOrderDetailById } from "../detail/service";

export const getDeliveryOrderPersetujuan = async (id: DeliveryOrderPersetujuan["id"], tx = db) => {
    return await tx
        .select({
            ...deliveryOrderPersetujuanColumn,
            nama: pegawai.nama,
            jabatan: jabatan.jabatan,
        })
        .from(delivery_order_persetujuan)
        .innerJoin(pegawai, eq(pegawai.id, delivery_order_persetujuan.id_pegawai))
        .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .where(eq(delivery_order_persetujuan.id, id))
        .orderBy(delivery_order_persetujuan.urut);
};

export const getDeliveryOrderPersetujuanByPegawai = async (id: DeliveryOrderPersetujuan["id"], id_pegawai: DeliveryOrderPersetujuan["id_pegawai"], tx = db) => {
    const [data] = await tx
        .select()
        .from(delivery_order_persetujuan)
        .where(and(eq(delivery_order_persetujuan.id, id), eq(delivery_order_persetujuan.id_pegawai, id_pegawai)));
    return data;
};

export const createDeliveryOrderPersetujuan = async (id: DeliveryOrderPersetujuan["id"], id_pegawai: DeliveryOrderPersetujuan["id_pegawai"], urut: DeliveryOrderPersetujuan["urut"] = 1, tx = db) => {
    const dataPegawai = await getPegawaiById(id_pegawai, tx);

    const form = insertDeliveryOrderPersetujuanSchema.parse({
        id: id,
        urut: urut,
        id_pegawai: id_pegawai,
        tanggal_persetujuan: null,
        id_jabatan: dataPegawai.id_jabatan,
        status: false,
    });
    const [data] = await tx.insert(delivery_order_persetujuan).values(form).returning();

    return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
};

export const deleteDeliveryOrderPersetujuan = async (id: DeliveryOrderPersetujuan["id"], tx = db) => {
    const deletePersetujuan = await tx.delete(delivery_order_persetujuan).where(eq(delivery_order_persetujuan.id, id)).returning();
    return deletePersetujuan;
};

export const updatePersetujuanDeliveryOrder = async (
    id: DeliveryOrderPersetujuan["id"],
    id_pegawai: DeliveryOrderPersetujuan["id_pegawai"],
    status: DeliveryOrderPersetujuan["status"],
    keterangan: DeliveryOrderPersetujuan["keterangan"],
    tx = db,
) => {
    const returning = await tx.transaction(async (tx) => {
        const [dataPersetujuan] = await tx
            .update(delivery_order_persetujuan)
            .set({
                status: status,
                tanggal_persetujuan: sql`NOW()`,
                keterangan: keterangan,
            })
            .where(and(eq(delivery_order_persetujuan.id, id), eq(delivery_order_persetujuan.id_pegawai, id_pegawai)))
            .returning();

        const [max] = await tx
            .select({
                urut: sql`MAX(urut)`,
            })
            .from(delivery_order_persetujuan)
            .where(eq(delivery_order_persetujuan.id, id));

        if (dataPersetujuan.urut == max.urut && status) {
            await tx.update(delivery_order).set({ status: "C" }).where(eq(delivery_order.id, id));
            const data = await getDeliveryOrderById(id, tx);
            const dataDetail = await getDeliveryOrderDetailById(id, tx);

            await updateStatusDoSend(data, dataDetail, tx);

            return { ...dataPersetujuan, update_status: "C" };
        } else if (!status) {
            await tx.update(delivery_order).set({ status: "R" }).where(eq(delivery_order.id, id));
            return { ...dataPersetujuan, update_status: "R" };
        }
        return dataPersetujuan;
    });
    return returning;
};

export const getPersetujuanDeliveryOrder = async (id_pegawai: DeliveryOrderPersetujuan["id_pegawai"], tx = db) => {
    const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, k.kontak as customer, g.nomor as referensi, a.keterangan as keterangan_pr, a.status as status_pr, c.nama as created_name, b.*
                FROM delivery_order a  
                INNER JOIN sales_order g ON a.id_so = g.id
                INNER JOIN kontak k ON a.id_customer = k.id
                LEFT JOIN delivery_order_persetujuan b ON a.id = b.id 
                LEFT JOIN hr.pegawai c ON a.created_by = c.id
                WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
                AND (
                    b.urut = 1 OR
                    (b.urut > 1 AND EXISTS (
                        SELECT 1
                        FROM delivery_order z
                        INNER JOIN delivery_order_persetujuan y ON z.id = y.id
                        WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
                            AND z.nomor = a.nomor
                    ))
                ) AND a.status='S'
                ORDER BY nomor, urut`);
    return data;
};
