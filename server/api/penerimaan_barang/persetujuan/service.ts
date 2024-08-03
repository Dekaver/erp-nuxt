import { getTableColumns, eq, and, sql } from "drizzle-orm";

import { jabatan } from "../../jabatan/schema";
import { pegawai } from "../../pegawai/schema";
import { penerimaan_barang } from "../schema";
import { PenerimaanBarangPersetujuan, insertPenerimaanBarangPersetujuanSchema, penerimaanBarangPersetujuanColumns, penerimaan_barang_persetujuan } from "./schema";
import { closingPenerimaanBarang, getPenerimaanBarangById } from "../service";
import { getPenerimaanBarangDetailById } from "../detail/service";

export const getPenerimaanBarangPersetujuan = async (id: PenerimaanBarangPersetujuan["id"], tx = db) => {
    return await tx
        .select({
            ...penerimaanBarangPersetujuanColumns,
            nama: pegawai.nama,
            jabatan: jabatan.jabatan,
            ttd: pegawai.ttd,
        })
        .from(penerimaan_barang_persetujuan)
        .innerJoin(pegawai, eq(pegawai.id, penerimaan_barang_persetujuan.id_pegawai))
        .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .where(eq(penerimaan_barang_persetujuan.id, id))
        .orderBy(penerimaan_barang_persetujuan.urut);
};

export const getPenerimaanBarangPersetujuanByPegawai = async (id: PenerimaanBarangPersetujuan["id"], id_pegawai: PenerimaanBarangPersetujuan["id_pegawai"], tx = db) => {
    const [data] = await tx
        .select()
        .from(penerimaan_barang_persetujuan)
        .where(and(eq(penerimaan_barang_persetujuan.id, id), eq(penerimaan_barang_persetujuan.id_pegawai, id_pegawai)));
    return data;
};

export const getPersetujuanPenerimaanBarang = async (id_pegawai: PenerimaanBarangPersetujuan["id_pegawai"], tx = db) => {
    const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, a.referensi, d.kontak as kontak,  a.status as status_po, c.nama as created_name, b.* 
                FROM penerimaan_barang a  
                LEFT JOIN penerimaan_barang_persetujuan b ON a.id = b.id 
                LEFT JOIN hr.pegawai c ON a.created_by = c.id
                LEFT JOIN kontak d ON d.id=a.id_supplier
                WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
                AND (
                    b.urut = 1 OR
                    (b.urut > 1 AND EXISTS (
                        SELECT 1
                        FROM penerimaan_barang z
                        INNER JOIN penerimaan_barang_persetujuan y ON z.id = y.id
                        WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
                            AND z.nomor = a.nomor
                    ))
                ) AND a.status='S'
                ORDER BY nomor, urut`);
    return data;
};

export const createPenerimaanBarangPersetujuan = async (
    id: PenerimaanBarangPersetujuan["id"],
    id_pegawai: PenerimaanBarangPersetujuan["id_pegawai"],
    urut: PenerimaanBarangPersetujuan["urut"] = 1,
    tx = db,
) => {
    const Columns = getTableColumns(pegawai);
    const [dataPegawai] = await tx
        .select({
            ...column,
            jabatan: jabatan.jabatan,
        })
        .from(pegawai)
        .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .where(eq(pegawai.id, id_pegawai));

    const form = insertPenerimaanBarangPersetujuanSchema.parse({
        id: id,
        urut: urut,
        id_pegawai: id_pegawai,
        tanggal_persetujuan: null,
        id_jabatan: dataPegawai.id_jabatan,
        status: false,
    });
    const [data] = await tx.insert(penerimaan_barang_persetujuan).values(form).returning();

    return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
};

export const updatePersetujuanPenerimaanBarang = async (
    id: PenerimaanBarangPersetujuan["id"],
    id_pegawai: PenerimaanBarangPersetujuan["id_pegawai"],
    status: PenerimaanBarangPersetujuan["status"],
    keterangan: PenerimaanBarangPersetujuan["keterangan"],
    tx = db,
) => {
    return await tx.transaction(async (tx) => {
        const [dataPersetujuan] = await tx
            .update(penerimaan_barang_persetujuan)
            .set({
                status: status,
                tanggal_persetujuan: sql`NOW()`,
                keterangan: keterangan,
            })
            .where(and(eq(penerimaan_barang_persetujuan.id, id), eq(penerimaan_barang_persetujuan.id_pegawai, id_pegawai)))
            .returning();

        const [max] = await tx
            .select({
                urut: sql`MAX(urut)`,
            })
            .from(penerimaan_barang_persetujuan)
            .where(eq(penerimaan_barang_persetujuan.id, id));

        if (dataPersetujuan.urut == max.urut && status) {
            await tx.update(penerimaan_barang).set({ status: "C" }).where(eq(penerimaan_barang.id, id));
            // update stok
            const data = await getPenerimaanBarangById(id, tx);
            const dataDetail = await getPenerimaanBarangDetailById(id, tx);
            await closingPenerimaanBarang(data, dataDetail, tx);
            return { ...dataPersetujuan, status_pp: "C" };
        } else if (!status) {
            await tx.update(penerimaan_barang).set({ status: "R" }).where(eq(penerimaan_barang.id, id));
            return { ...dataPersetujuan, status_pp: "R" };
        }
        return dataPersetujuan;
    });
};

export const deletePenerimaanBarangPersetujuan = async (id: PenerimaanBarangPersetujuan["id"], tx = db) => {
    const deletePersetujuan = await tx.delete(penerimaan_barang_persetujuan).where(eq(penerimaan_barang_persetujuan.id, id)).returning();
    return deletePersetujuan;
};
