// import { eq } from "drizzle-orm";
// import { type NewRencanaAnggaranBiayaDetail, type RencanaAnggaranBiayaDetail, rencana_anggaran_biaya_detail } from "./schema";
// import { ValidationError } from "../../../libs/errors";


// export const getRencanaAnggaranBiayaDetailById = async (id: RencanaAnggaranBiayaDetail['id'],tx = db) => {
//     return await tx.select().from(rencana_anggaran_biaya_detail).orderBy(rencana_anggaran_biaya_detail.urut);
// };

// export const createRencanaAnggaranBiayaDetail = async (form: NewRencanaAnggaranBiayaDetail[], tx = db) => {
//     const [data] = await tx.insert(rencana_anggaran_biaya_detail).values(form).returning();
//     return data;
// };

// export const deleteRencanaAnggaranBiayaDetail = async (id: RencanaAnggaranBiayaDetail["id"], tx = db) => {
//     try {
//         const [data] = await tx.delete(rencana_anggaran_biaya_detail).where(eq(rencana_anggaran_biaya_detail.id, id)).returning();
//         return data;
//     } catch (error) {
//         throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
//     }
// };
