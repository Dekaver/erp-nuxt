// import { desc, eq, getTableColumns, inArray, ne, or, sql } from "drizzle-orm";

// import { NotFoundError, ValidationError } from "../../../libs/errors";
// import { ptkpColumns, ptkp, Ptkp, NewPtkp } from "./schema";

// export const getPtkp = async (tx = db) => {
//     let query = tx
//         .select({
//             ...ptkpColumns,
//         })
//         .from(ptkp);
//     return await query.orderBy(ptkp.nominal);
// };

// export const getOptionPtkp = async (tx = db) => {
//     let query = tx
//         .select({
//             id: ptkp.id,
//             ptkp: ptkp.ptkp,
//             nominal: ptkp.nominal,
//         })
//         .from(ptkp);
//     return await query.orderBy(ptkp.nominal);
// };

// export const getPtkpById = async (id: Ptkp["id"]) => {
//     const [data] = await db
//         .select({
//             ...ptkpColumns,
//         })
//         .from(ptkp)
//         .where(eq(ptkp.id, id));
//     if (data == undefined) {
//         throw NotFoundError("PTKP tidak Di temukan");
//     }

//     return data;
// };

// export const createPtkp = async (newPtkp: NewPtkp, tx = db) => {
//     try {
//         const [data] = await tx.insert(ptkp).values(newPtkp).returning();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw ValidationError("error");
//     }
// };

// export const updatePtkp = async (id: Ptkp["id"], form: NewPtkp, tx = db) => {
//     try {
//         const returning: any = await tx.transaction(async (tx) => {
//             const [data] = await tx
//                 .update(ptkp)
//                 .set({
//                     ptkp: form.ptkp,
//                     nominal: form.nominal,
//                     updated_by: form.updated_by,
//                     updated_at: sql.raw(`CURRENT_TIMESTAMP`),
//                 })
//                 .where(eq(ptkp.id, id))
//                 .returning();
//             return data;
//         });
//         return returning;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("error");
//     }
// };

// export const deletePtkp = async (id: Ptkp["id"]) => {
//     try {
//         await db.transaction(async (tx) => {
//             await tx.delete(ptkp).where(eq(ptkp.id, id));
//         });
//         return 1;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("Gagal Hapus PTKP");
//     }
// };
