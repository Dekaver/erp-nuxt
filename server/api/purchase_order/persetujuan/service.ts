// import { getTableColumns, eq, and, sql } from "drizzle-orm";

// import { jabatan } from "../../jabatan/schema";
// import { pegawai } from "../../pegawai/schema";
// import { purchase_order } from "../schema";
// import { PurchaseOrderPersetujuan, insertPurchaseOrderPersetujuanSchema, purchase_order_persetujuan } from "./schema";

// export const getPurchaseOrderPersetujuan = async (id: PurchaseOrderPersetujuan["id"], tx = db) => {
//     return await tx.select().from(purchase_order_persetujuan).where(eq(purchase_order_persetujuan.id, id)).orderBy(purchase_order_persetujuan.urut);
// };

// export const getPurchaseOrderPersetujuanByPegawai = async (id: PurchaseOrderPersetujuan["id"], id_pegawai: PurchaseOrderPersetujuan["id_pegawai"], tx = db) => {
//     const [data] = await tx
//         .select()
//         .from(purchase_order_persetujuan)
//         .where(and(eq(purchase_order_persetujuan.id, id), eq(purchase_order_persetujuan.id_pegawai, id_pegawai)));
//     return data;
// };

// export const createPurchaseOrderPersetujuan = async (id: PurchaseOrderPersetujuan["id"], id_pegawai: PurchaseOrderPersetujuan["id_pegawai"], urut: PurchaseOrderPersetujuan["urut"] = 1, tx = db) => {
//     const Columns = getTableColumns(pegawai);
//     const [dataPegawai] = await tx
//         .select({
//             ...column,
//             jabatan: jabatan.jabatan,
//         })
//         .from(pegawai)
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .where(eq(pegawai.id, id_pegawai));

//     const form = insertPurchaseOrderPersetujuanSchema.parse({
//         id: id,
//         urut: urut,
//         id_pegawai: id_pegawai,
//         tanggal_persetujuan: null,
//         id_jabatan: dataPegawai.id_jabatan,
//         status: false,
//     });
//     const [data] = await tx.insert(purchase_order_persetujuan).values(form).returning();

//     return { ...data, nama: dataPegawai.nama, jabatan: dataPegawai.jabatan };
// };

// export const deletePurchaseOrderPersetujuan = async (id: PurchaseOrderPersetujuan["id"], tx = db) => {
//     const deletePersetujuan = await tx.delete(purchase_order_persetujuan).where(eq(purchase_order_persetujuan.id, id)).returning();
//     return deletePersetujuan;
// };

// export const updatePersetujuanPurchaseOrder = async (
//     id: PurchaseOrderPersetujuan["id"],
//     id_pegawai: PurchaseOrderPersetujuan["id_pegawai"],
//     status: PurchaseOrderPersetujuan["status"],
//     keterangan: PurchaseOrderPersetujuan["keterangan"],
//     tx = db,
// ) => {
//     const returning = await tx.transaction(async (trx) => {
//         const now = new Date();
//         const [dataPersetujuan] = await trx
//             .update(purchase_order_persetujuan)
//             .set({
//                 status: status,
//                 tanggal_persetujuan: sql`NOW()`,
//                 keterangan: keterangan,
//             })
//             .where(and(eq(purchase_order_persetujuan.id, id), eq(purchase_order_persetujuan.id_pegawai, id_pegawai)))
//             .returning();

//         const [max] = await trx
//             .select({
//                 urut: sql`MAX(urut)`,
//             })
//             .from(purchase_order_persetujuan)
//             .where(eq(purchase_order_persetujuan.id, id));

//         if (dataPersetujuan.urut == max.urut && status) {
//             await trx.update(purchase_order).set({ status: "O" }).where(eq(purchase_order.id, id));
//             return { ...dataPersetujuan, status_pp: "O" };
//         } else if (!status) {
//             await trx.update(purchase_order).set({ status: "R" }).where(eq(purchase_order.id, id));
//             return { ...dataPersetujuan, status_pp: "R" };
//         }
//         return dataPersetujuan;
//     });
//     return returning;
// };

// export const getPersetujuanPurchaseOrder = async (id_pegawai: PurchaseOrderPersetujuan["id_pegawai"], tx = db) => {
//     const data = await tx.execute(sql`SELECT a.id, a.nomor, a.tanggal, a.referensi, d.kontak as kontak,  a.status as status_po, a.total, c.nama as created_name, b.* 
//         FROM purchase_order a  
//         LEFT JOIN purchase_order_persetujuan b ON a.id = b.id 
//         LEFT JOIN hr.pegawai c ON a.created_by = c.id
//         LEFT JOIN kontak d ON d.id=a.id_supplier
//         WHERE id_pegawai = ${id_pegawai} AND b.tanggal_persetujuan IS NULL
//         AND (
//             b.urut = 1 OR
//             (b.urut > 1 AND EXISTS (
//                 SELECT 1
//                 FROM purchase_order z
//                 INNER JOIN purchase_order_persetujuan y ON z.id = y.id
//                 WHERE y.urut = b.urut - 1 AND y.tanggal_persetujuan IS NOT NULL
//                     AND z.nomor = a.nomor
//             ))
//         ) AND a.status='S'
//         ORDER BY nomor, urut`);
//     return data;
// };
