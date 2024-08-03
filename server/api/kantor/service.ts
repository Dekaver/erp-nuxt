// import { sql, eq } from "drizzle-orm";
// import { type NewKantor, type Kantor, kantor, kantorColumns } from "../kantor/schema";
// import { type NewAccount, type Account, account } from "../account/schema";

// export const getKantor = async (tx = db) => {
//     const data = await tx.execute(
//         sql`
//         SELECT a.*, b.name as akun_penjualan, c.name as akun_hutang, d.name as akun_piutang
//         FROM hr.kantor a 
//         INNER JOIN account b ON b.id=a.account_penjualan
//         INNER JOIN account c ON c.id=a.account_hutang
//         INNER JOIN account d ON d.id=a.account_piutang`
//     );
//     return data;
// };

// export const getKantorById = async (params: Kantor["id"]) => {
//     const [data] = await db.select().from(kantor).where(eq(kantor.id, params));
//     return data;
// };

// export const createKantor = async (params: NewKantor) => {
//     const [data] = await db.insert(kantor).values(params).returning();
//     return data;
// };

// export const updateKantor = async (params: Kantor["id"], form: NewKantor) => {
//     const [data] = await db.update(kantor).set(form).where(eq(kantor.id, params)).returning();
//     return data;
// };

// export const deleteKantor = async (id: Kantor["id"]) => {
//     const [data] = await db.delete(kantor).where(eq(kantor.id, id)).returning();
//     return data;
// };
