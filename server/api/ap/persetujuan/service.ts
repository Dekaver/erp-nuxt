// import { getTableColumns, eq, and, sql } from "drizzle-orm";

// import { jabatan } from "../../jabatan/schema";
// import { pegawai } from "../../pegawai/schema";
// import { ap, insertAccApFakturSchema } from "../schema";
// import { ApPersetujuan, insertApPersetujuanSchema, ap_persetujuan, apPersetujuanColumns } from "./schema";
// import { getApDetailById } from "../detail/service";
// import { createAccApFaktur, updateStatusApOpen } from "../service";
// import { ToString, formatDate } from "../../../libs/formater";

// export const getApPersetujuan = async (id: ApPersetujuan["id"], tx = db) => {
//     return await tx
//         .select({
//             ...apPersetujuanColumns,
//             nama: pegawai.nama,
//             jabatan: jabatan.jabatan,
//         })
//         .from(ap_persetujuan)
//         .innerJoin(pegawai, eq(pegawai.id, ap_persetujuan.id_pegawai))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .where(eq(ap_persetujuan.id, id))
//         .orderBy(ap_persetujuan.urut);
// };

// export const getApPersetujuanByPegawai = async (id: ApPersetujuan["id"], id_pegawai: ApPersetujuan["id_pegawai"], tx = db) => {
//     const [data] = await tx
//         .select()
//         .from(ap_persetujuan)
//         .where(and(eq(ap_persetujuan.id, id), eq(ap_persetujuan.id_pegawai, id_pegawai)));
//     return data;
// };

// export const createApPersetujuan = async (id: ApPersetujuan["id"], id_pegawai: ApPersetujuan["id_pegawai"], urut: ApPersetujuan["urut"] = 1, tx = db) => {
//     const Columns = getTableColumns(pegawai);
//     const [dataPegawai] = await tx
//         .select({
//             ...column,
//             jabatan: jabatan.jabatan,
//         })
//         .from(pegawai)
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .where(eq(pegawai.id, id_pegawai));

//     const form = insertApPersetujuanSchema.parse({
//         id: id,
//         urut: urut,
//         id_pegawai: id_pegawai,
//         tanggal_persetujuan: null,
//         id_jabatan: dataPegawai.id_jabatan,
//         status: false,
//     });
//     const [data] = await tx.insert(ap_persetujuan).values(form).returning();

//     return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
// };

// export const deleteApPersetujuan = async (id: ApPersetujuan["id"], tx = db) => {
//     const deletePersetujuan = await tx.delete(ap_persetujuan).where(eq(ap_persetujuan.id, id)).returning();
//     return deletePersetujuan;
// };

// export const updatePersetujuanAp = async (id: ApPersetujuan["id"], id_pegawai: ApPersetujuan["id_pegawai"], status: ApPersetujuan["status"], keterangan: ApPersetujuan["keterangan"], tx = db) => {
//     const returning = await tx.transaction(async (tx) => {
//         const [dataPersetujuan] = await tx
//             .update(ap_persetujuan)
//             .set({
//                 status: status,
//                 tanggal_persetujuan: sql`NOW()`,
//                 keterangan: keterangan,
//             })
//             .where(and(eq(ap_persetujuan.id, id), eq(ap_persetujuan.id_pegawai, id_pegawai)))
//             .returning();

//         const [max] = await tx
//             .select({
//                 urut: sql`MAX(urut)`,
//             })
//             .from(ap_persetujuan)
//             .where(eq(ap_persetujuan.id, id));

//         if (dataPersetujuan.urut == max.urut && status) {
//             const [data] = await tx.update(ap).set({ status: "O" }).where(eq(ap.id, id)).returning();
//             const dataDetail = await getApDetailById(id, tx);

//             await updateStatusApOpen(data, dataDetail, tx);

//             return { ...dataPersetujuan, update_status: "O" };
//         } else if (!status) {
//             await tx.update(ap).set({ status: "R" }).where(eq(ap.id, id));
//             return { ...dataPersetujuan, update_status: "R" };
//         }
//         return dataPersetujuan;
//     });
//     return returning;
// };

// export const getPersetujuanAp = async (id_pegawai: ApPersetujuan["id_pegawai"], tx = db) => {
//     const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, a.referensi, d.kontak as kontak,  a.status as status_po, a.total, c.nama as created_name, b.* 
//                 FROM ap a  
//                 LEFT JOIN ap_persetujuan b ON a.id = b.id 
//                 LEFT JOIN hr.pegawai c ON a.created_by = c.id
//                 LEFT JOIN kontak d ON d.id=a.id_supplier
//                 WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
//                 AND (
//                     b.urut = 1 OR
//                     (b.urut > 1 AND EXISTS (
//                         SELECT 1
//                         FROM ap z
//                         INNER JOIN ap_persetujuan y ON z.id = y.id
//                         WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
//                             AND z.nomor = a.nomor
//                     ))
//                 ) AND a.status='S'
//                 ORDER BY nomor, urut`);
//     return data;
// };
