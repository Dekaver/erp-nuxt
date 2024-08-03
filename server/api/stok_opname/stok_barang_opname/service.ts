// import { eq } from "drizzle-orm";

// import { NewStokBarangOpname, StokBarangOpname, stok_barang_opname } from "./schema";
// import { ValidationError } from "../../../../libs/errors";

// export const getStokBarangOpnameById = async (id: StokBarangOpname['id'],tx = db) => {
//     return await tx.select().from(stok_barang_opname).where(eq(stok_barang_opname.id, id)).orderBy(stok_barang_opname.id_stok);
// };

// export const createStokBarangOpname = async (form: NewStokBarangOpname[], tx = db) => {
//     return await tx.insert(stok_barang_opname).values(form).returning();
// };

// export const deleteStokBarangOpname = async (id: StokBarangOpname["id"], tx = db) => {
//     try {
//         const [data] = await tx.delete(stok_barang_opname).where(eq(stok_barang_opname.id, id)).returning();
//         return data;
//     } catch (error) {
//         throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
//     }
// };
