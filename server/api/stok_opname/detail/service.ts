// import { desc, eq } from "drizzle-orm";
// import { ValidationError } from "../../../libs/errors";

// import { NewStokOpnameDetail, StokOpnameDetail, stokOpnameDetailColumns, stok_opname_detail } from "./schema";
// import { barang } from "../../barang/schema";
// import { satuan } from "../../satuan/schema";

// export const getStokOpnameDetailById = async (id: StokOpnameDetail['id'],tx = db) => {
//     return await tx.select({
//         ...stokOpnameDetailColumns,
//         nama_barang: barang.nama_barang,
//         kode_barang: barang.kode_barang,
//         satuan: satuan.satuan,
//     }).from(stok_opname_detail)
//     .where(eq(stok_opname_detail.id, id))
//     .innerJoin(barang, eq(barang.id, stok_opname_detail.id_barang))
//     .innerJoin(satuan, eq(satuan.id, barang.id_satuan))
//     .orderBy(desc(stok_opname_detail.is_selected), stok_opname_detail.urut);
// };

// export const createStokOpnameDetail = async (form: NewStokOpnameDetail[], tx = db) => {
//     const data = await tx.insert(stok_opname_detail).values(form).returning();
//     return data;
// };

// export const deleteStokOpnameDetail = async (id: StokOpnameDetail["id"], tx = db) => {
//     try {
//         const [data] = await tx.delete(stok_opname_detail).where(eq(stok_opname_detail.id, id)).returning();
//         return data;
//     } catch (error) {
//         throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
//     }
// };
