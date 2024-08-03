// import { and, eq, getTableColumns, ne } from "drizzle-orm";
// import { type NewJabatan, type Jabatan, jabatan, jabatanColumns } from "../jabatan/schema";
// import { alias } from "drizzle-orm/pg-core";

// export const getJabatan = async (tx = db) => {
//     const parent = alias(jabatan, "atasan");
//     const data = await tx
//         .select({
//             ...jabatanColumns,
//             atasan_jabatan: parent.jabatan,
//         })
//         .from(jabatan)
//         .leftJoin(parent, eq(jabatan.atasan, parent.id));
//     return data;
// };
// export const getJabatanAtasan = async (tx = db) => {
//     const data = await tx.select().from(jabatan).where(eq(jabatan.is_head_departemen, true)).orderBy(jabatan.jabatan);
//     return data;
// };

// export const getJabatanById = async (params: Jabatan["id"], tx = db) => {
//     const parent = alias(jabatan, "atasan");
//     const data = await tx
//         .select({
//             ...jabatanColumns,
//             atasan_jabatan: parent.jabatan,
//         })
//         .from(jabatan)
//         .leftJoin(parent, eq(jabatan.atasan, parent.id))
//         .where(eq(jabatan.id, params));
//     return data[0];
// };

// export const getJabatanByAtasan = async (params: Jabatan["atasan"], tx = db) => {
//     const data = await tx.transaction(async (trx, tx = db) => {
//         const parent = alias(jabatan, "atasan");
//         return await trx
//             .select({
//                 ...jabatanColumns,
//                 atasan_jabatan: parent.jabatan,
//             })
//             .from(jabatan)
//             .leftJoin(parent, eq(jabatan.atasan, parent.id))
//             .where(and(eq(jabatan.id, params as number), eq(jabatan.is_head_departemen, true)));
//     });

//     return data;
// };

// export const createJabatan = async (params: NewJabatan, tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [check] = await trx.select({ jabatan: jabatan.jabatan }).from(jabatan).where(eq(jabatan.jabatan, params.jabatan));
//         if (check) {
//             throw ValidationError("Jabatan sudah ada");
//         }
//         const [data] = await trx.insert(jabatan).values(params).returning();
//         const extendedData = await getJabatanById(data.id, trx);
//         return extendedData;
//     });
//     return data;
// };

// export const updateJabatan = async (params: Jabatan["id"], form: NewJabatan, tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [check] = await trx
//             .select({ jabatan: jabatan.jabatan })
//             .from(jabatan)
//             .where(and(eq(jabatan.jabatan, form.jabatan), ne(jabatan.id, params)));
//         if (check) {
//             throw ValidationError("Jabatan sudah ada");
//         }
//         const [data] = await trx
//             .update(jabatan)
//             .set(form)
//             .where(eq(jabatan.id, params as number))
//             .returning();
//         return data;
//     });
//     return data;
// };

// export const deleteJabatan = async (id: Jabatan["id"], tx = db) => {
//     const data = tx.transaction(async (trx) => {
//         const [data] = await trx.delete(jabatan).where(eq(jabatan.id, id)).returning();
//         if (data.is_head_departemen) {
//             throw ValidationError("Jabatan ini adalah kepala departemen, tidak bisa dihapus");
//         }
//     });

//     return data;
// };
