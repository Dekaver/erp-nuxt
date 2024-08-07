import { and, eq, sql } from "drizzle-orm";


import { purchase_request } from "@/databases/purchase_request/schema";
import { insertPurchaseRequestPersetujuanSchema, purchase_request_persetujuan, PurchaseRequestPersetujuan } from "@/databases/purchase_request/persetujuan/schema";
import { getPegawaiById } from "../../pegawai/service";

export const getPurchaseRequestPersetujuan = async (id: PurchaseRequestPersetujuan["id"], tx = db) => {
    return await tx.select().from(purchase_request_persetujuan).where(eq(purchase_request_persetujuan.id, id)).orderBy(purchase_request_persetujuan.urut);
};

export const getPurchaseRequestPersetujuanByPegawai = async (id: PurchaseRequestPersetujuan["id"], id_pegawai: PurchaseRequestPersetujuan["id_pegawai"], tx = db) => {
    const [data] = await tx
        .select()
        .from(purchase_request_persetujuan)
        .where(and(eq(purchase_request_persetujuan.id, id), eq(purchase_request_persetujuan.id_pegawai, id_pegawai)));
    return data;
};

export const createPurchaseRequestPersetujuan = async (
    id: PurchaseRequestPersetujuan["id"],
    id_pegawai: PurchaseRequestPersetujuan["id_pegawai"],
    urut: PurchaseRequestPersetujuan["urut"] = 1,
    tx = db,
) => {
    const dataPegawai = await getPegawaiById(id_pegawai, tx);

    const form = insertPurchaseRequestPersetujuanSchema.parse({
        id: id,
        urut: urut,
        id_pegawai: id_pegawai,
        tanggal_persetujuan: null,
        id_jabatan: dataPegawai.id_jabatan,
        status: false,
    });
    const [data] = await tx.insert(purchase_request_persetujuan).values(form).returning();

    return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
};

export const deletePurchaseRequestPersetujuan = async (id: PurchaseRequestPersetujuan["id"], tx = db) => {
    const deletePersetujuan = await tx.delete(purchase_request_persetujuan).where(eq(purchase_request_persetujuan.id, id)).returning();
    return deletePersetujuan;
};

export const updatePersetujuanPurchaseRequest = async (
    id: PurchaseRequestPersetujuan["id"],
    id_pegawai: PurchaseRequestPersetujuan["id_pegawai"],
    status: PurchaseRequestPersetujuan["status"],
    keterangan: PurchaseRequestPersetujuan["keterangan"],
    tx = db,
) => {
    const returning = await tx.transaction(async (trx) => {
        const [dataPersetujuan] = await trx
            .update(purchase_request_persetujuan)
            .set({
                status: status,
                tanggal_persetujuan: sql`NOW()`,
                keterangan: keterangan,
            })
            .where(and(eq(purchase_request_persetujuan.id, id), eq(purchase_request_persetujuan.id_pegawai, id_pegawai)))
            .returning();

        const [max] = await trx
            .select({
                urut: sql`MAX(urut)`,
            })
            .from(purchase_request_persetujuan)
            .where(eq(purchase_request_persetujuan.id, id));

        if (dataPersetujuan.urut == max.urut && status) {
            await trx.update(purchase_request).set({ status: "O" }).where(eq(purchase_request.id, id));
            return { ...dataPersetujuan, status_pr: "O" };
        } else if (!status) {
            await trx.update(purchase_request).set({ status: "R" }).where(eq(purchase_request.id, id));
            return { ...dataPersetujuan, status_pr: "R" };
        }
        return dataPersetujuan;
    });
    return returning;
};

export const getPersetujuanPurchaseRequest = async (id_pegawai: PurchaseRequestPersetujuan["id_pegawai"], tx = db) => {
    const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, a.keterangan as keterangan_pr, a.status as status_pr, a.total, c.nama as created_name, b.* 
                FROM purchase_request a  
                LEFT JOIN purchase_request_persetujuan b ON a.id = b.id 
                LEFT JOIN hr.pegawai c ON a.created_by = c.id
                WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
                AND (
                    b.urut = 1 OR
                    (b.urut > 1 AND EXISTS (
                        SELECT 1
                        FROM purchase_request z
                        INNER JOIN purchase_request_persetujuan y ON z.id = y.id
                        WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
                            AND z.nomor = a.nomor
                    ))
                ) AND a.status='S'
                ORDER BY nomor, urut`);
    return data;
};
