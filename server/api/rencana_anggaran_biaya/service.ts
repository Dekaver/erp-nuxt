// import { desc, eq, sql } from "drizzle-orm";
// import { type NewRencanaAnggaranBiaya, type RencanaAnggaranBiaya, rencana_anggaran_biaya, UpdateRencanaAnggaranBiaya, rencanaAnggaranBiayaColumns } from "./schema";
// import { proyek } from "../proyek/schema";
// import { moduleNumberGenerator } from "../../libs/nomor";


// export const nomorRencanaAnggaranBiaya = async (tanggal: string, tx = db) => {
//     return await moduleNumberGenerator("rencana_anggaran_biaya", "nomor", "tanggal", "RAB", tanggal, tx);
// };

// export const getRencanaAnggaranBiaya = async (tx = db) => {
//     return await tx.select({
//         ...rencanaAnggaranBiayaColumns,
//         nama_proyek: proyek.proyek,
//         lokasi_proyek: proyek.lokasi,
//         kode_proyek: proyek.kode,
//     }).from(rencana_anggaran_biaya)
//     .innerJoin(proyek, eq(proyek.id, rencana_anggaran_biaya.id_proyek))
//     .orderBy(desc(rencana_anggaran_biaya.tanggal));
// };

// export const getRencanaAnggaranBiayaById = async (id: RencanaAnggaranBiaya["id"], tx = db) => {
//     const [data] = await tx.select().from(rencana_anggaran_biaya).where(eq(rencana_anggaran_biaya.id, id));
//     return data;
// };


// export const createRencanaAnggaranBiaya = async (id: NewRencanaAnggaranBiaya, tx = db) => {
//     const [data] = await tx.insert(rencana_anggaran_biaya).values(id).returning();
//     return data;
// };

// export const updateRencanaAnggaranBiaya = async (id: RencanaAnggaranBiaya["id"], form: UpdateRencanaAnggaranBiaya, tx = db) => {
//     const [data] = await tx
//         .update(rencana_anggaran_biaya)
//         .set({ ...form, updated_at: sql`NOW()` })
//         .where(eq(rencana_anggaran_biaya.id, id))
//         .returning();
//     return data;
// };

// export const deleteRencanaAnggaranBiaya = async (id: RencanaAnggaranBiaya["id"], tx = db) => {
//     try {
//         const [data] = await tx.delete(rencana_anggaran_biaya).where(eq(rencana_anggaran_biaya.id, id)).returning();
//         return data;
//     } catch (error) {
//         throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
//     }
// };
