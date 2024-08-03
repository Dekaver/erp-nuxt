// import { eq, getTableColumns } from "drizzle-orm";
// import { type NewInternalPerusahaan, type InternalPerusahaan, internal_perusahaan } from "./schema";

// export const getInternalPerusahaan = async (tx = db) => {
//     const internal_perusahaanColumns = getTableColumns(internal_perusahaan);
//     return await tx
//         .select({
//             ...internal_perusahaanColumn,
//         })
//         .from(internal_perusahaan)
//         .orderBy(internal_perusahaan.id);
// };

// export const getInternalPerusahaanById = async (params: InternalPerusahaan["id"], tx = db) => {
//     const [data] = await tx.select().from(internal_perusahaan).where(eq(internal_perusahaan.id, params));
//     return data;
// };

// export const createInternalPerusahaan = async (form: NewInternalPerusahaan, tx = db) => {
//     const [data] = await tx.insert(internal_perusahaan).values(form).returning();
//     return data;
// };

// export const updateInternalPerusahaan = async (params: InternalPerusahaan["id"], form: NewInternalPerusahaan, tx = db) => {
//     const [data] = await tx.update(internal_perusahaan).set(form).where(eq(internal_perusahaan.id, params)).returning();
//     return data;
// };

// export const deleteInternalPerusahaan = async (id: InternalPerusahaan["id"], tx = db) => {
//     const [data] = await tx.delete(internal_perusahaan).where(eq(internal_perusahaan.id, id)).returning();
//     return data;
// };
