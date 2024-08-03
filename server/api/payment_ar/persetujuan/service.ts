// import { getTableColumns, eq, and, sql } from "drizzle-orm";

// import { jabatan } from "../../jabatan/schema";
// import { pegawai } from "../../pegawai/schema";
// import { payment_ar } from "../schema";
// import { PaymentArPersetujuan, insertPaymentArPersetujuanSchema, payment_ar_persetujuan } from "./schema";
// import { updateAmountAccArFaktur } from "../../ar/service";
// import { updateInvoiceStatusByNomor } from "../../invoice/service";
// import { getPaymentArDetailById } from "../detail/service";

// export const getPaymentArPersetujuan = async (id: PaymentArPersetujuan["id"], tx = db) => {
//     return await tx.select().from(payment_ar_persetujuan).where(eq(payment_ar_persetujuan.id, id)).orderBy(payment_ar_persetujuan.urut);
// };

// export const getPaymentArPersetujuanByPegawai = async (id: PaymentArPersetujuan["id"], id_pegawai: PaymentArPersetujuan["id_pegawai"], tx = db) => {
//     const [data] = await tx
//         .select()
//         .from(payment_ar_persetujuan)
//         .where(and(eq(payment_ar_persetujuan.id, id), eq(payment_ar_persetujuan.id_pegawai, id_pegawai)));
//     return data;
// };


// export const createPaymentArPersetujuan = async (id: PaymentArPersetujuan["id"], id_pegawai: PaymentArPersetujuan["id_pegawai"], urut: PaymentArPersetujuan["urut"] = 1, tx = db) => {
//     const Columns = getTableColumns(pegawai);
//     const [dataPegawai] = await tx
//         .select({
//             ...column,
//             jabatan: jabatan.jabatan,
//         })
//         .from(pegawai)
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .where(eq(pegawai.id, id_pegawai));

//     const form = insertPaymentArPersetujuanSchema.parse({
//         id: id,
//         urut: urut,
//         id_pegawai: id_pegawai,
//         tanggal_persetujuan: null,
//         id_jabatan: dataPegawai.id_jabatan,
//         status: false,
//     });
//     const [data] = await tx.insert(payment_ar_persetujuan).values(form).returning();

//     return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
// };

// export const deletePaymentArPersetujuan = async (id: PaymentArPersetujuan["id"], tx = db) => {
//     const deletePersetujuan = await tx.delete(payment_ar_persetujuan).where(eq(payment_ar_persetujuan.id, id)).returning();
//     return deletePersetujuan;
// };

// export const updatePersetujuanPaymentAr = async (
//     id: PaymentArPersetujuan["id"],
//     id_pegawai: PaymentArPersetujuan["id_pegawai"],
//     status: PaymentArPersetujuan["status"],
//     keterangan: PaymentArPersetujuan["keterangan"],
//     tx = db,
// ) => {
//     const returning = await tx.transaction(async (tx) => {
//         const now = new Date();
//         const [dataPersetujuan] = await tx
//             .update(payment_ar_persetujuan)
//             .set({
//                 status: status,
//                 tanggal_persetujuan: sql`NOW()`,
//                 keterangan: keterangan,
//             })
//             .where(and(eq(payment_ar_persetujuan.id, id), eq(payment_ar_persetujuan.id_pegawai, id_pegawai)))
//             .returning();

//         const [max] = await tx
//             .select({
//                 urut: sql`MAX(urut)`,
//             })
//             .from(payment_ar_persetujuan)
//             .where(eq(payment_ar_persetujuan.id, id));

//         if (dataPersetujuan.urut == max.urut && status) {
//             const dataDetail = await getPaymentArDetailById(dataPersetujuan.id, tx)
//             for (const detail of dataDetail) {
//                 await updateAmountAccArFaktur({ pay: detail.amount, discount: detail.discount, invoice: detail.invoice }, tx);
//                 await updateInvoiceStatusByNomor(detail.invoice, "C", tx);
//             }
//             await tx.update(payment_ar).set({ status: "C" }).where(eq(payment_ar.id, id));
//             return {...dataPersetujuan, status_pp: 'C'};
//         } else if (!status) {
//             await tx.update(payment_ar).set({ status: "R" }).where(eq(payment_ar.id, id));
//             return {...dataPersetujuan, status_pp: 'R'};
//         }
//         return dataPersetujuan;
//     });
//     return returning;
// };

// export const getPersetujuanPaymentAr = async (id_pegawai: PaymentArPersetujuan["id_pegawai"], tx = db) => {
//     const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, a.referensi, d.kontak as kontak,  a.status as status_po, a.total, c.nama as created_name, b.* 
//                 FROM payment_ar a  
//                 LEFT JOIN payment_ar_persetujuan b ON a.id = b.id 
//                 LEFT JOIN hr.pegawai c ON a.created_by = c.id
//                 LEFT JOIN kontak d ON d.id=a.id_supplier
//                 WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
//                 AND (
//                     b.urut = 1 OR
//                     (b.urut > 1 AND EXISTS (
//                         SELECT 1
//                         FROM payment_ar z
//                         INNER JOIN payment_ar_persetujuan y ON z.id = y.id
//                         WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
//                             AND z.nomor = a.nomor
//                     ))
//                 ) AND a.status='S'
//                 ORDER BY nomor, urut`);
//     return data;
// };