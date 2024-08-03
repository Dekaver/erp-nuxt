// import { desc, eq, getTableColumns, inArray, ne, or, sql } from "drizzle-orm";

// import { NotFoundError, ValidationError } from "../../../libs/errors";
// import { terTarifColumns, terTarif, TerTarif, NewTerTarif } from "./schema";

// export const getTerTarif = async (id_ter: TerTarif["id_ter"],tx = db) => {
//     let query = tx
//         .select({
//             ...terTarifColumns,
//         })
//         .from(terTarif)
//         .where(eq(terTarif.id_ter, id_ter));
//     return await query.orderBy(terTarif.batas_bawah);
// };

// export const getOptionTerTarif = async (tx = db) => {
//     let query = tx
//         .select({
//             id: terTarif.id,
//             batas_bawah: terTarif.batas_bawah,
//             batas_atas: terTarif.batas_atas,
//             tarif: terTarif.tarif,
//         })
//         .from(terTarif);
//     return await query.orderBy(terTarif.batas_bawah);
// };

// export const getTerTarifById = async (id: TerTarif["id"]) => {
//     const [data] = await db
//         .select({
//             ...terTarifColumns,
//         })
//         .from(terTarif)
//         .where(eq(terTarif.id, id));
//     if (data == undefined) {
//         throw NotFoundError("TER Tarif tidak Ditemukan");
//     }

//     return data;
// };

// export const createTerTarif = async (newTerTarif: NewTerTarif, tx = db) => {
//     try {
//         const [data] = await tx.insert(terTarif).values(newTerTarif).returning();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw ValidationError("error");
//     }
// };

// export const updateTerTarif = async (id: TerTarif["id"], form: NewTerTarif, tx = db) => {
//     try {
//         const returning: any = await tx.transaction(async (tx) => {
//             const [data] = await tx
//                 .update(terTarif)
//                 .set({
//                     batas_bawah: form.batas_bawah,
//                     batas_atas: form.batas_atas,
//                     tarif: form.tarif,
//                     updated_by: form.updated_by,
//                     updated_at: sql.raw(`CURRENT_TIMESTAMP`),
//                 })
//                 .where(eq(terTarif.id, id))
//                 .returning();
//             return data;
//         });
//         return returning;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("error");
//     }
// };

// export const deleteTerTarif = async (id: TerTarif["id"]) => {
//     try {
//         await db.transaction(async (tx) => {
//             await tx.delete(terTarif).where(eq(terTarif.id, id));
//         });
//         return 1;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("Gagal Hapus TER Tarif");
//     }
// };
