// import { eq } from "drizzle-orm";

// import { AbsenTempat, NewAbsenTempat, absenTempat } from "./schema";

// export const get = async (tx = db) => {
//     const data = await tx.select().from(absenTempat);
//     return data;
// };

// export const getById = async (params: AbsenTempat["id"], tx = db) => {
//     const [data] = await tx.select().from(absenTempat).where(eq(absenTempat.id, params));
//     return data;
// };

// export const create = async (params: NewAbsenTempat, tx = db) => {
//     const [data] = await tx.insert(absenTempat).values(params).returning();
//     return data;
// };

// export const update = async (params: NewAbsenTempat, tx = db) => {
//     const [data] = await tx
//         .update(absenTempat)
//         .set(params)
//         .where(eq(absenTempat.id, params.id as number))
//         .returning();
//     return data;
// };

// export const deleteAbsenTempat = async (params: AbsenTempat["id"], tx = db) => {
//     const [data] = await tx.delete(absenTempat).where(eq(absenTempat.id, params)).returning();
//     return data;
// };
