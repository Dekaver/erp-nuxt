// import { sql, eq, and } from "drizzle-orm";

// import { PenerimaanBarang, penerimaan_barang } from "../schema";
// import { NewPenerimaanBarangDetail, PenerimaanBarangDetail, penerimaanBarangDetailColumns, penerimaan_barang_detail } from "./schema";
// import { purchase_order_detail } from "../../purchase_order/detail/schema";
// import { barang } from "../../barang/schema";
// import { satuan } from "../../satuan/schema";

// export const getPenerimaanBarangDetailById = async (id: PenerimaanBarangDetail["id"], tx = db) => {
//     const data = await tx
//         .select({
//             ...penerimaanBarangDetailColumns,
//             kode_barang: barang.kode_barang,
//             satuan: satuan.satuan,
//             harga: purchase_order_detail.harga,
//             total: purchase_order_detail.total,
//             diskonrp: purchase_order_detail.diskonrp,
//             diskonpersen: purchase_order_detail.diskonpersen,
//             id_pajak: purchase_order_detail.id_pajak,
//             persen_pajak: purchase_order_detail.persen_pajak,
//             id_proyek: purchase_order_detail.id_proyek,
//             keterangan: purchase_order_detail.keterangan,
//             type: sql`CASE WHEN penerimaan_barang_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END`,
//         })
//         .from(penerimaan_barang_detail)
//         .innerJoin(purchase_order_detail, and(eq(purchase_order_detail.id, penerimaan_barang_detail.id_po), eq(purchase_order_detail.urut, penerimaan_barang_detail.urut_po)))
//         .leftJoin(barang, eq(barang.id, penerimaan_barang_detail.id_barang))
//         .leftJoin(satuan, eq(satuan.id, penerimaan_barang_detail.id_satuan))
//         .where(eq(penerimaan_barang_detail.id, id));
//     return data;
// };

// export const createPenerimaanBarangDetail = async (form: NewPenerimaanBarangDetail[], tx = db) => {
//     const data = await tx.insert(penerimaan_barang_detail).values(form).returning();
//     return data;
// };

// export const updatePenerimaanBarangDetail = async (params: PenerimaanBarangDetail["id"], form: NewPenerimaanBarangDetail[], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         await deletePenerimaanBarangDetail(params, trx);
//         return await createPenerimaanBarangDetail(form, trx);
//     });
//     return data;
// };

// export const deletePenerimaanBarangDetail = async (id: PenerimaanBarangDetail["id"], tx = db) => {
//     const data = await tx.delete(penerimaan_barang_detail).where(eq(penerimaan_barang_detail.id, id)).returning();
//     return data;
// };

// export const checkIfPenerimaanBarangIsComplete = async (id: PenerimaanBarang["id"], tx = db) => {
//     const [data] = await tx
//         .select({ status: penerimaan_barang.status })
//         .from(penerimaan_barang)
//         .where(and(eq(penerimaan_barang.id, id), eq(penerimaan_barang.status, "C")));
//     return data;
// };
