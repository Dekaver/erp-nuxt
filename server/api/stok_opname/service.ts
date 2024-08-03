// import { alias } from "drizzle-orm/pg-core";
// import { moduleNumberGenerator } from "../../libs/nomor";
// import { NewStokOpname, StokOpname, UpdateStokOpname, stokOpnameColumns, stok_opname } from "./schema";
// import { pegawai } from "../pegawai/schema";
// import { desc, eq, sql } from "drizzle-orm";

// export const nomorStokOpname = async (tanggal: string, tx = db) => {
//     return await moduleNumberGenerator("stok_opname", "nomor", "tanggal", "OP", tanggal, tx);
// };

// export const getStokOpname = async (tx = db) => {
//     const creator = alias(pegawai, "creator");
//     const uploader = alias(pegawai, "uploader");
//     const approver = alias(pegawai, "approver");
//     const data = await tx
//         .select({
//             ...stokOpnameColumns,
//             creator_name: creator.nama,
//             uploader_name: uploader.nama,
//             approver_name: approver.nama,
//         })
//         .from(stok_opname)
//         .leftJoin(creator, eq(creator.id, stok_opname.created_by))
//         .leftJoin(uploader, eq(uploader.id, stok_opname.upload_by))
//         .leftJoin(approver, eq(approver.id, stok_opname.approved_by))
//         .orderBy(desc(stok_opname.nomor));
//     return data;
// };

// export const getStokOpnameById = async (id: StokOpname["id"], tx = db) => {
//     const creator = alias(pegawai, "creator");
//     const uploader = alias(pegawai, "uploader");
//     const approver = alias(pegawai, "approver");
//     const [data] = await tx
//         .select({
//             ...stokOpnameColumns,
//             creator_name: creator.nama,
//             uploader_name: uploader.nama,
//             approver_name: approver.nama,
//         })
//         .from(stok_opname)
//         .leftJoin(creator, eq(creator.id, stok_opname.created_by))
//         .leftJoin(uploader, eq(uploader.id, stok_opname.upload_by))
//         .leftJoin(approver, eq(approver.id, stok_opname.approved_by))
//         .where(eq(stok_opname.id, id))
//         .orderBy(stok_opname.id);
//     return data;
// };

// export const createStokOpname = async (id: NewStokOpname, tx = db) => {
//     const [data] = await tx.insert(stok_opname).values(id).returning();
//     return data;
// };

// export const updateStokOpname = async (id: StokOpname["id"], form: UpdateStokOpname, tx = db) => {
//     const approved_at = { approved_at: form.status == "C" ? sql`NOW()` : null };
//     const [data] = await tx
//         .update(stok_opname)
//         .set({ ...form, updated_at: sql`NOW()`, ...approved_at })
//         .where(eq(stok_opname.id, id))
//         .returning();
//     return data;
// };

// export const deleteStokOpname = async (id: StokOpname["id"], tx = db) => {
//     try {
//         const [data] = await tx.delete(stok_opname).where(eq(stok_opname.id, id)).returning();
//         return data;
//     } catch (error) {
//         throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
//     }
// };
