// import { sql, eq } from "drizzle-orm";

// import { barang } from "../../barang/schema";
// import { satuan } from "../../satuan/schema";
// import { Quotation } from "../schema";
// import { quotationDetailColumns, quotation_detail, NewQuotationDetail } from "./schema";

// export const getQuotationDetailById = async (id: Quotation["id"], tx = db) => {
//     const data = await tx
//         .select({
//             ...quotationDetailColumns,
//             kode_barang: barang.kode_barang,
//             satuan: satuan.satuan,
//             type: sql<string>`CASE WHEN quotation_detail.id_barang IS NOT NULL THEN 'produk' ELSE 'jasa' END`,
//         })
//         .from(quotation_detail)
//         .leftJoin(barang, eq(barang.id, quotation_detail.id_barang))
//         .leftJoin(satuan, eq(satuan.id, quotation_detail.id_satuan))
//         .where(eq(quotation_detail.id, id))
//         .orderBy(quotation_detail.urut);
//     return data;
// };

// export const createQuotationDetail = async (form: NewQuotationDetail, tx = db) => {
//     const data = tx.insert(quotation_detail).values(form).returning();
//     return data;
// };

// export const updateQuotationDetail = async (id: Quotation["id"], form: NewQuotationDetail, tx = db) => {
//     const data = tx.transaction(async (trx) => {
//         await deleteQuotationDetail(id, trx);
//         return await createQuotationDetail(form, trx);
//     });
//     return data;
// };

// export const deleteQuotationDetail = async (id: Quotation["id"], tx = db) => {
//     const data = tx.delete(quotation_detail).where(eq(quotation_detail.id, id)).returning();
//     return data;
// };
