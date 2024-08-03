// import { eq, sql } from "drizzle-orm";


// import { account } from "../../account/schema";
// import { barang } from "../../barang/schema";
// import { penerimaan_barang } from "../../penerimaan_barang/schema";
// import { proyek } from "../../proyek/schema";
// import { ap_detail, ApDetail, apDetailColumns, NewApDetail } from "./schema";
// import { satuan } from "../../barang/satuan/schema";

// export const getApDetailById = async (params: ApDetail["id"], tx = db) => {
//     const data = await tx
//         .select({
//             ...apDetailColumns,
//             kode_barang: barang.kode_barang,
//             satuan: satuan.satuan,
//             is_stok: barang.is_stok,
//             id_account_harga_beli: barang.id_account_harga_beli,
//             akun: account.name,
//             proyek: proyek.proyek,
//             nomor_pb: penerimaan_barang.nomor,
//             type: sql`CASE WHEN ap_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END as type`,
//         })
//         .from(ap_detail)
//         .leftJoin(barang, eq(barang.id, ap_detail.id_barang))
//         .leftJoin(proyek, eq(proyek.id, ap_detail.id_proyek))
//         .leftJoin(satuan, eq(satuan.id, ap_detail.id_satuan))
//         .leftJoin(account, eq(account.id, ap_detail.id_account))
//         .leftJoin(penerimaan_barang, eq(penerimaan_barang.id, ap_detail.id_pb))
//         .where(eq(ap_detail.id, params))
//         .orderBy(ap_detail.urut);
//     return data;
// };

// export const createApDetail = async (form: NewApDetail[], tx = db) => {
//     const data = await tx.insert(ap_detail).values(form).returning();
//     return data;
// };

// export const updateApDetail = async (params: ApDetail["id"], form: NewApDetail[], tx = db) => {
//     const data = await tx.transaction(async (tx) => {
//         await deleteApDetail(params, tx);
//         return await createApDetail(form, tx);
//     });
//     return data;
// };

// export const deleteApDetail = async (id: ApDetail["id"], tx = db) => {
//     const data = await tx.delete(ap_detail).where(eq(ap_detail.id, id)).returning();
//     return data;
// };
