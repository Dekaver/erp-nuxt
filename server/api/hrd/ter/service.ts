// import { desc, eq, getTableColumns, inArray, ne, or, sql } from "drizzle-orm";

// import { NotFoundError, ValidationError } from "../../../libs/errors";
// import { terColumns, ter, Ter, NewTer } from "./schema";

// export const getTer = async (tx = db) => {
//     let query = tx
//         .select({
//             ...terColumns,
//         })
//         .from(ter);
//     return await query.orderBy(ter.ter);
// };

// export const getOptionTer = async (tx = db) => {
//     let query = tx
//         .select({
//             id: ter.id,
//             ter: ter.ter,
//         })
//         .from(ter);
//     return await query.orderBy(ter.ter);
// };

// export const getTerById = async (id: Ter["id"]) => {
//     const [data] = await db
//         .select({
//             ...terColumns,
//         })
//         .from(ter)
//         .where(eq(ter.id, id));
//     if (data == undefined) {
//         throw NotFoundError("TER tidak Di temukan");
//     }

//     return data;
// };

// export const createTer = async (newTer: NewTer, tx = db) => {
//     try {
//         const [data] = await tx.insert(ter).values(newTer).returning();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw ValidationError("error");
//     }
// };

// export const updateTer = async (id: Ter["id"], form: NewTer, tx = db) => {
//     try {
//         const returning: any = await tx.transaction(async (tx) => {
//             const [data] = await tx
//                 .update(ter)
//                 .set({
//                     ter: form.ter,
//                     updated_by: form.updated_by,
//                     updated_at: sql.raw(`CURRENT_TIMESTAMP`),
//                 })
//                 .where(eq(ter.id, id))
//                 .returning();
//             return data;
//         });
//         return returning;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("error");
//     }
// };

// export const deleteTer = async (id: Ter["id"]) => {
//     try {
//         await db.transaction(async (tx) => {
//             await tx.delete(ter).where(eq(ter.id, id));
//         });
//         return 1;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("Gagal Hapus TER");
//     }
// };
