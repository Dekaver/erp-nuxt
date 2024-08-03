// import { getTableColumns, eq, and, sql } from "drizzle-orm";

// import { jabatan } from "../../jabatan/schema";
// import { pegawai } from "../../pegawai/schema";
// import { payment_ap } from "../schema";
// import { PaymentApPersetujuan, insertPaymentApPersetujuanSchema, paymentApPersetujuanColumns, payment_ap_persetujuan } from "./schema";

// export const getPaymentApPersetujuan = async (id: PaymentApPersetujuan["id"], tx = db) => {
//     return await tx
//         .select({
//             ...paymentApPersetujuanColumns,
//             nama: pegawai.nama,
//             jabatan: jabatan.jabatan,
//         })
//         .from(payment_ap_persetujuan)
//         .innerJoin(pegawai, eq(pegawai.id, payment_ap_persetujuan.id_pegawai))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .where(eq(payment_ap_persetujuan.id, id))
//         .orderBy(payment_ap_persetujuan.urut);
// };

// export const getPaymentApPersetujuanByPegawai = async (id: PaymentApPersetujuan["id"], id_pegawai: PaymentApPersetujuan["id_pegawai"], tx = db) => {
//     const [data] = await tx
//         .select()
//         .from(payment_ap_persetujuan)
//         .where(and(eq(payment_ap_persetujuan.id, id), eq(payment_ap_persetujuan.id_pegawai, id_pegawai)));
//     return data;
// };

// export const createPaymentApPersetujuan = async (id: PaymentApPersetujuan["id"], id_pegawai: PaymentApPersetujuan["id_pegawai"], urut: PaymentApPersetujuan["urut"] = 1, tx = db) => {
//     const Columns = getTableColumns(pegawai);
//     const [dataPegawai] = await tx
//         .select({
//             ...column,
//             jabatan: jabatan.jabatan,
//         })
//         .from(pegawai)
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .where(eq(pegawai.id, id_pegawai));

//     const form = insertPaymentApPersetujuanSchema.parse({
//         id: id,
//         urut: urut,
//         id_pegawai: id_pegawai,
//         tanggal_persetujuan: null,
//         id_jabatan: dataPegawai.id_jabatan,
//         status: false,
//     });
//     const [data] = await tx.insert(payment_ap_persetujuan).values(form).returning();

//     return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
// };

// export const deletePaymentApPersetujuan = async (id: PaymentApPersetujuan["id"], tx = db) => {
//     const deletePersetujuan = await tx.delete(payment_ap_persetujuan).where(eq(payment_ap_persetujuan.id, id)).returning();
//     return deletePersetujuan;
// };

// export const updatePersetujuanPaymentAp = async (
//     id: PaymentApPersetujuan["id"],
//     id_pegawai: PaymentApPersetujuan["id_pegawai"],
//     status: PaymentApPersetujuan["status"],
//     keterangan: PaymentApPersetujuan["keterangan"],
//     tx = db,
// ) => {
//     const returning = await tx.transaction(async (trx) => {
//         const now = new Date();
//         const [dataPersetujuan] = await trx
//             .update(payment_ap_persetujuan)
//             .set({
//                 status: status,
//                 tanggal_persetujuan: sql`NOW()`,
//                 keterangan: keterangan,
//             })
//             .where(and(eq(payment_ap_persetujuan.id, id), eq(payment_ap_persetujuan.id_pegawai, id_pegawai)))
//             .returning();

//         const [max] = await trx
//             .select({
//                 urut: sql`MAX(urut)`,
//             })
//             .from(payment_ap_persetujuan)
//             .where(eq(payment_ap_persetujuan.id, id));

//         if (dataPersetujuan.urut == max.urut && status) {
//             await trx.update(payment_ap).set({ status: "C" }).where(eq(payment_ap.id, id));
//             return { ...dataPersetujuan, update_status: "C" };
//         } else if (!status) {
//             await trx.update(payment_ap).set({ status: "R" }).where(eq(payment_ap.id, id));
//             return { ...dataPersetujuan, update_status: "R" };
//         }
//         return dataPersetujuan;
//     });
//     return returning;
// };

// export const getPersetujuanPaymentAp = async (id_pegawai: PaymentApPersetujuan["id_pegawai"], tx = db) => {
//     const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, a.referensi, d.kontak as kontak,  a.status as status_po, a.total, c.nama as created_name, b.* 
//                 FROM payment_ap a  
//                 LEFT JOIN payment_ap_persetujuan b ON a.id = b.id 
//                 LEFT JOIN hr.pegawai c ON a.created_by = c.id
//                 LEFT JOIN kontak d ON d.id=a.id_supplier
//                 WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
//                 AND (
//                     b.urut = 1 OR
//                     (b.urut > 1 AND EXISTS (
//                         SELECT 1
//                         FROM payment_ap z
//                         INNER JOIN payment_ap_persetujuan y ON z.id = y.id
//                         WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
//                             AND z.nomor = a.nomor
//                     ))
//                 ) AND a.status='S'
//                 ORDER BY nomor, urut`);
//     return data;
// };
