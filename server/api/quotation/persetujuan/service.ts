// import { and, eq, sql } from "drizzle-orm";


// import { quotation } from "../schema";
// import { insertQuotationPersetujuanSchema, quotation_persetujuan, QuotationPersetujuan, quotationPersetujuanColumns } from "./schema";
// import { getPegawaiById } from "../../pegawai/service";
// import { pegawai } from "../../pegawai/schema";
// import { jabatan } from "../../jabatan/schema";

// export const getQuotationPersetujuan = async (id: QuotationPersetujuan["id"], tx = db) => {
//     return await tx.select({
//         ...quotationPersetujuanColumns,
//         nama: pegawai.nama,
//         jabatan: jabatan.jabatan,
//     }).from(quotation_persetujuan)
//     .innerJoin(pegawai, eq(pegawai.id, quotation_persetujuan.id_pegawai))
//     .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//     .where(eq(quotation_persetujuan.id, id)).orderBy(quotation_persetujuan.urut);
// };

// export const getQuotationPersetujuanByPegawai = async (id: QuotationPersetujuan["id"], id_pegawai: QuotationPersetujuan["id_pegawai"], tx = db) => {
//     const [data] = await tx
//         .select()
//         .from(quotation_persetujuan)
//         .where(and(eq(quotation_persetujuan.id, id), eq(quotation_persetujuan.id_pegawai, id_pegawai)));
//     return data;
// };

// export const createQuotationPersetujuan = async (
//     id: QuotationPersetujuan["id"],
//     id_pegawai: QuotationPersetujuan["id_pegawai"],
//     urut: QuotationPersetujuan["urut"] = 1,
//     tx = db,
// ) => {
//     const dataPegawai = await getPegawaiById(id_pegawai, tx);

//     const form = insertQuotationPersetujuanSchema.parse({
//         id: id,
//         urut: urut,
//         id_pegawai: id_pegawai,
//         tanggal_persetujuan: null,
//         id_jabatan: dataPegawai.id_jabatan,
//         status: false,
//     });
//     const [data] = await tx.insert(quotation_persetujuan).values(form).returning();

//     return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
// };

// export const deleteQuotationPersetujuan = async (id: QuotationPersetujuan["id"], tx = db) => {
//     const deletePersetujuan = await tx.delete(quotation_persetujuan).where(eq(quotation_persetujuan.id, id)).returning();
//     return deletePersetujuan;
// };

// export const updatePersetujuanQuotation = async (
//     id: QuotationPersetujuan["id"],
//     id_pegawai: QuotationPersetujuan["id_pegawai"],
//     status: QuotationPersetujuan["status"],
//     keterangan: QuotationPersetujuan["keterangan"],
//     tx = db,
// ) => {
//     const returning = await tx.transaction(async (trx) => {
//         const [dataPersetujuan] = await trx
//             .update(quotation_persetujuan)
//             .set({
//                 status: status,
//                 tanggal_persetujuan: sql`NOW()`,
//                 keterangan: keterangan,
//             })
//             .where(and(eq(quotation_persetujuan.id, id), eq(quotation_persetujuan.id_pegawai, id_pegawai)))
//             .returning();

//         const [max] = await trx
//             .select({
//                 urut: sql`MAX(urut)`,
//             })
//             .from(quotation_persetujuan)
//             .where(eq(quotation_persetujuan.id, id));

//         if (dataPersetujuan.urut == max.urut && status) {
//             await trx.update(quotation).set({ status: "O" }).where(eq(quotation.id, id));
//             return { ...dataPersetujuan, status_pr: "O" };
//         } else if (!status) {
//             await trx.update(quotation).set({ status: "R" }).where(eq(quotation.id, id));
//             return { ...dataPersetujuan, status_pr: "R" };
//         }
//         return dataPersetujuan;
//     });
//     return returning;
// };

// export const getPersetujuanQuotation = async (id_pegawai: QuotationPersetujuan["id_pegawai"], tx = db) => {
//     const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, a.keterangan as keterangan_pr, a.status as status_pr, a.total, c.nama as created_name, b.* 
//                 FROM quotation a  
//                 LEFT JOIN quotation_persetujuan b ON a.id = b.id 
//                 LEFT JOIN hr.pegawai c ON a.created_by = c.id
//                 WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
//                 AND (
//                     b.urut = 1 OR
//                     (b.urut > 1 AND EXISTS (
//                         SELECT 1
//                         FROM quotation z
//                         INNER JOIN quotation_persetujuan y ON z.id = y.id
//                         WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
//                             AND z.nomor = a.nomor
//                     ))
//                 ) AND a.status='S'
//                 ORDER BY nomor, urut`);
//     return data;
// };