// import { and, desc, eq, getTableColumns, inArray, ne, notInArray, or, sql } from "drizzle-orm";

// import { NotFoundError, ValidationError } from "../../../libs/errors";
// import { ptkpTerColumns, ptkpTer, PtkpTer, NewPtkpTer } from "./schema";
// import { ter, terColumns } from "../ter/schema";
// import { ptkp } from "../ptkp/schema";

// export const getPtkpTer = async (id_ptkp: PtkpTer["id_ptkp"], tx = db) => {
//     let query = tx
//         .select({
//             ...ptkpTerColumns,
//             ter: ter.ter,
//             ptkp: ptkp.ptkp,
//         })
//         .from(ptkpTer)
//         .innerJoin(ter, eq(ter.id, ptkpTer.id_ter))
//         .innerJoin(ptkp, eq(ptkp.id, ptkpTer.id_ptkp))
//         .where(eq(ptkpTer.id_ptkp, id_ptkp));
//     return await query.orderBy(ptkpTer.id_ptkp);
// };

// export const getOptionPtkpTer = async (tx = db) => {
//     let query = tx
//         .select({
//             id: ptkpTer.id,
//             // id_ptkp: ptkpTer.id_ptkp,
//             id_ter: ptkpTer.id_ter,
//         })
//         .from(ptkpTer);
//     return await query.orderBy(ptkpTer.id_ptkp);
// };

// export const getPtkpTerById = async (id: PtkpTer["id"]) => {
//     const [data] = await db
//         .select({
//             ...ptkpTerColumns,
//         })
//         .from(ptkpTer)
//         .where(eq(ptkpTer.id, id));
//     if (data == undefined) {
//         throw NotFoundError("TER PTKP tidak Di temukan");
//     }

//     return data;
// };

// export const createPtkpTer = async (newPtkpTer: NewPtkpTer, tx = db) => {
//     try {
//         const [data] = await tx.insert(ptkpTer).values(newPtkpTer).returning();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw ValidationError("error");
//     }
// };

// export const updatePtkpTer = async (id: PtkpTer["id"], form: NewPtkpTer, tx = db) => {
//     try {
//         const returning: any = await tx.transaction(async (tx) => {
//             const [data] = await tx
//                 .update(ptkpTer)
//                 .set({
//                     id_ter: form.id_ter,
//                     id_ptkp: form.id_ptkp,
//                 })
//                 .where(eq(ptkpTer.id, id))
//                 .returning();
//             return data;
//         });
//         return returning;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("error");
//     }
// };

// export const deletePtkpTer = async (id: PtkpTer["id"]) => {
//     try {
//         await db.transaction(async (tx) => {
//             await tx.delete(ptkpTer).where(eq(ptkpTer.id, id));
//         });
//         return 1;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("Gagal Hapus TER PTKP");
//     }
// };

// export const getTerForMapping = async (id_ptkp: PtkpTer["id_ptkp"], tx = db) => {
//     const data = await tx.execute(
//         sql.raw(`
//         SELECT a.* 
//         FROM hr.ter a
//         WHERE a.id NOT IN (SELECT b.id_ter FROM hr.ter_ptkp b WHERE b.id_ptkp=${id_ptkp});`),
//     );

//     return data;
// };
