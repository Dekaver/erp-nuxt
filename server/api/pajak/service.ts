// import { eq } from "drizzle-orm";
// import { type NewPajak, type Pajak, pajak, pajakColumns } from "../pajak/schema";
// import { alias } from "drizzle-orm/pg-core";
// import { account } from "../account/schema";

// export const getPajak = async (tx = db) => {
//     const account_pembelian = alias(account, "account_pembelian");
//     const account_penjualan = alias(account, "account_penjualan");
//     const data = await tx
//         .select({
//             ...pajakColumns,
//             nama_akun_pembelian: account_pembelian.name,
//             nama_akun_penjualan: account_penjualan.name,
//         })
//         .from(pajak)
//         .innerJoin(account_pembelian, eq(account_pembelian.id, pajak.akun_pembelian))
//         .innerJoin(account_penjualan, eq(account_penjualan.id, pajak.akun_penjualan));
//     return data;
// };

// export const getPajakById = async (id: Pajak["id"], tx = db) => {
//     const [data] = await tx.select().from(pajak).where(eq(pajak.id, id));
//     return data;
// };

// export const getAkunPenjualanById = async (id: Pajak["id"], tx = db) => {
//     const [data] = await tx
//         .select({
//             akun_penjualan: pajak.akun_penjualan,
//         })
//         .from(pajak)
//         .where(eq(pajak.id, id));
//     return data;
// };

// export const createPajak = async (form: NewPajak, tx = db) => {
//     const [data] = await tx.insert(pajak).values(form).returning();
//     return data;
// };

// export const updatePajak = async (id: Pajak["id"], form: NewPajak, tx = db) => {
//     const [data] = await tx.update(pajak).set(form).where(eq(pajak.id, id)).returning();
//     return data;
// };

// export const deletePajak = async (id: Pajak["id"], tx = db) => {
//     const [data] = await tx.delete(pajak).where(eq(pajak.id, id)).returning();
//     return data;
// };
