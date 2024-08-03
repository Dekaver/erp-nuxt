// import { and, eq, sql } from "drizzle-orm";


// import { sales_order } from "../schema";
// import { insertSalesOrderPersetujuanSchema, sales_order_persetujuan, SalesOrderPersetujuan, salesOrderPersetujuanColumns } from "./schema";
// import { getPegawaiById } from "../../pegawai/service";
// import { pegawai } from "../../pegawai/schema";
// import { jabatan } from "../../jabatan/schema";

// export const getSalesOrderPersetujuan = async (id: SalesOrderPersetujuan["id"], tx = db) => {
//     return await tx.select({
//         ...salesOrderPersetujuanColumns,
//         nama:pegawai.nama,
//         jabatan: jabatan.jabatan
//     }).from(sales_order_persetujuan)
//     .innerJoin(pegawai, eq(pegawai.id, sales_order_persetujuan.id_pegawai))
//     .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//     .where(eq(sales_order_persetujuan.id, id)).orderBy(sales_order_persetujuan.urut);
// };

// export const getSalesOrderPersetujuanByPegawai = async (id: SalesOrderPersetujuan["id"], id_pegawai: SalesOrderPersetujuan["id_pegawai"], tx = db) => {
//     const [data] = await tx
//         .select()
//         .from(sales_order_persetujuan)
//         .where(and(eq(sales_order_persetujuan.id, id), eq(sales_order_persetujuan.id_pegawai, id_pegawai)));
//     return data;
// };

// export const createSalesOrderPersetujuan = async (
//     id: SalesOrderPersetujuan["id"],
//     id_pegawai: SalesOrderPersetujuan["id_pegawai"],
//     urut: SalesOrderPersetujuan["urut"] = 1,
//     tx = db,
// ) => {
//     const dataPegawai = await getPegawaiById(id_pegawai, tx);

//     const form = insertSalesOrderPersetujuanSchema.parse({
//         id: id,
//         urut: urut,
//         id_pegawai: id_pegawai,
//         tanggal_persetujuan: null,
//         id_jabatan: dataPegawai.id_jabatan,
//         status: false,
//     });
//     const [data] = await tx.insert(sales_order_persetujuan).values(form).returning();

//     return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
// };

// export const deleteSalesOrderPersetujuan = async (id: SalesOrderPersetujuan["id"], tx = db) => {
//     const deletePersetujuan = await tx.delete(sales_order_persetujuan).where(eq(sales_order_persetujuan.id, id)).returning();
//     return deletePersetujuan;
// };

// export const updatePersetujuanSalesOrder = async (
//     id: SalesOrderPersetujuan["id"],
//     id_pegawai: SalesOrderPersetujuan["id_pegawai"],
//     status: SalesOrderPersetujuan["status"],
//     keterangan: SalesOrderPersetujuan["keterangan"],
//     tx = db,
// ) => {
//     const returning = await tx.transaction(async (trx) => {
//         const [dataPersetujuan] = await trx
//             .update(sales_order_persetujuan)
//             .set({
//                 status: status,
//                 tanggal_persetujuan: sql`NOW()`,
//                 keterangan: keterangan,
//             })
//             .where(and(eq(sales_order_persetujuan.id, id), eq(sales_order_persetujuan.id_pegawai, id_pegawai)))
//             .returning();

//         const [max] = await trx
//             .select({
//                 urut: sql`MAX(urut)`,
//             })
//             .from(sales_order_persetujuan)
//             .where(eq(sales_order_persetujuan.id, id));

//         if (dataPersetujuan.urut == max.urut && status) {
//             await trx.update(sales_order).set({ status: "O" }).where(eq(sales_order.id, id));
//             return { ...dataPersetujuan, status_pr: "O" };
//         } else if (!status) {
//             await trx.update(sales_order).set({ status: "R" }).where(eq(sales_order.id, id));
//             return { ...dataPersetujuan, status_pr: "R" };
//         }
//         return dataPersetujuan;
//     });
//     return returning;
// };

// export const getPersetujuanSalesOrder = async (id_pegawai: SalesOrderPersetujuan["id_pegawai"], tx = db) => {
//     const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, a.keterangan as keterangan_pr, a.status as status_pr, a.grandtotal as total, c.nama as created_name, b.* 
//                 FROM sales_order a  
//                 LEFT JOIN sales_order_persetujuan b ON a.id = b.id 
//                 LEFT JOIN hr.pegawai c ON a.created_by = c.id
//                 WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
//                 AND (
//                     b.urut = 1 OR
//                     (b.urut > 1 AND EXISTS (
//                         SELECT 1
//                         FROM sales_order z
//                         INNER JOIN sales_order_persetujuan y ON z.id = y.id
//                         WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
//                             AND z.nomor = a.nomor
//                     ))
//                 ) AND a.status='S'
//                 ORDER BY nomor, urut`);
//     return data;
// };