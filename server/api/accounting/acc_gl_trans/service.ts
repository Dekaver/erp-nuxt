// import { eq, sql } from "drizzle-orm";

// import { account } from "../../account/schema";
// import { kontak } from "../../kontak/schema";
// import { accGLDetailColumns, acc_gl_detail, NewAccGlDetail, AccGlDetail } from "./acc_gl_detail/schema";
// import { accGLTransColumns, acc_gl_trans, AccGlTrans, NewAccGlTrans } from "./schema";
// import { NotFoundError, ValidationError } from "../../../libs/errors";
// import { updateAccValue } from "../service";
// import { formatDate } from "../../../libs/formater";
// import { proyek } from "../../../modules/proyek/schema";

// export const getAccGlTrans = async (tx = db) => {
//     const data = await tx
//         .select({
//             ...accGLTransColumns,
//         })
//         .from(acc_gl_trans);
//     return data;
// };

// export const getAccGlTransByJU = async (tx = db) => {
//     const data = await tx
//         .select({
//             ...accGLTransColumns,
//         })
//         .from(acc_gl_trans)
//         .where(eq(acc_gl_trans.journal_code, "JUM"));
//     return data;
// };

// export const getAccGlTransById = async (gl_number: AccGlTrans["gl_number"], tx = db) => {
//     return await tx.transaction(async (tx) => {
//         const [data] = await tx
//             .select({
//                 ...accGLTransColumns
//             })
//             .from(acc_gl_trans)
//             .where(eq(acc_gl_trans.gl_number, gl_number));

//         // if data not found return 404
//         if (data == undefined) {
//             throw NotFoundError("No Payment Ar Founded");
//         }

//         const dataDetail = await tx
//             .select({
//                 ...accGLDetailColumns,
//                 name_account: account.name,
//                 code_account: account.code,
//                 proyek: proyek.proyek,
//                 debit: sql`CASE WHEN is_debit=true THEN amount ELSE 0 END`,
//                 credit: sql`CASE WHEN is_debit=false THEN amount ELSE 0  END`,
//             })
//             .from(acc_gl_detail)
//             .innerJoin(account, eq(account.id, acc_gl_detail.id_account))
//             .leftJoin(proyek, eq(proyek.id, acc_gl_detail.id_proyek))
//             .where(eq(acc_gl_detail.gl_number, data.gl_number));
//         return { ...data, detail: dataDetail };
//     });
// };

// export const getAccGlTransByReference = async (reference: AccGlTrans["reference"], tx = db) => {
//     return await tx.transaction(async (tx) => {
//         const [data] = await tx
//             .select({
//                 ...accGLTransColumns,
//             })
//             .from(acc_gl_trans)
//             .where(eq(acc_gl_trans.reference, reference as string));

//         // if data not found return 404
//         if (data == undefined) {
//             throw NotFoundError("No Payment Founded");
//         }

//         const dataDetail = await tx
//             .select({
//                 ...accGLDetailColumns,
//                 account_name: account.name,
//                 account_code: account.code,
//                 debit: sql`CASE WHEN is_debit=true THEN amount ELSE 0 END`,
//                 credit: sql`CASE WHEN is_debit=false THEN amount ELSE 0  END`,
//             })
//             .from(acc_gl_detail)
//             .innerJoin(account, eq(account.id, acc_gl_detail.id_account))
//             .where(eq(acc_gl_detail.gl_number, data.gl_number))
//             .orderBy(acc_gl_detail.line);
//         return { ...data, detail: dataDetail };
//     });
// };

// export const createAccGlTrans = async (form: NewAccGlTrans, formDetail: NewAccGlDetail[], tx = db) => {
//     const data = tx.transaction(async (tx) => {
//         const [data] = await tx.insert(acc_gl_trans).values(form).returning();

//         const isBalance = formDetail.reduce((a, b) => a + parseFloat(b.amount as string) * (b.is_debit ? 1 : -1), 0);
//         if (parseInt(isBalance.toFixed(0)) != parseInt("0")) {
//             console.error(formDetail, isBalance.toFixed(0), isBalance.toFixed(0) != "0");
//             throw ValidationError("Jurnal tidak balance");
//         }

//         const dataDetail = await tx
//             .insert(acc_gl_detail)
//             .values(
//                 formDetail.map((item) => {
//                     return { ...item, gl_number: data.gl_number };
//                 }),
//             )
//             .returning();
//         //update acc value
//         await updateAccValue(formatDate(form.gl_date), tx);

//         return { ...data, detail: dataDetail };
//     });
//     return data;
// };

// export const deleteAccGlTransByGlNumber = async (gl_number: AccGlTrans["gl_number"], tx = db) => {
//     const data = await tx.transaction(async (tx) => {
//         const [data] = await tx.select().from(acc_gl_trans).where(eq(acc_gl_trans.gl_number, gl_number));
//         if (data) {
//             const dataDetail = await tx.delete(acc_gl_detail).where(eq(acc_gl_detail.gl_number, data.gl_number)).returning();
//             await tx.delete(acc_gl_trans).where(eq(acc_gl_trans.gl_number, data.gl_number));
//             // update acc_value
//             await updateAccValue(formatDate(data.gl_date), tx);
//             return { ...data, detail: dataDetail };
//         }
//         console.error(`Jurnal dengan ${gl_number} tidak ditemukan`);
//         return;
//     });
//     return data;
// };

// export const deleteAccGlTrans = async (reference: AccGlTrans["reference"], tx = db) => {
//     const data = await tx.transaction(async (tx) => {
//         const [data] = await tx.select().from(acc_gl_trans).where(eq(acc_gl_trans.reference, reference));
//         if (data) {
//             const dataDetail = await tx.delete(acc_gl_detail).where(eq(acc_gl_detail.gl_number, data.gl_number)).returning();
//             await tx.delete(acc_gl_trans).where(eq(acc_gl_trans.gl_number, data.gl_number));
//             // update acc_value
//             await updateAccValue(formatDate(data.gl_date), tx);
//             return { ...data, detail: dataDetail };
//         }
//         console.error(`Jurnal dengan ${reference} tidak ditemukan`);
//         return;
//     });
//     return data;
// };

// export const deleteAccGlDetail = async (gl_number: AccGlDetail["gl_number"], tx = db) => {
//     const data = await tx.transaction(async (tx) => {
//         const [data] = await tx.select().from(acc_gl_trans).where(eq(acc_gl_trans.gl_number, gl_number));
//         if (data) {
//             const dataDetail = await tx.delete(acc_gl_detail).where(eq(acc_gl_detail.gl_number, data.gl_number)).returning();
//             // update acc_value
//             await updateAccValue(formatDate(data.gl_date), tx);
//             return { ...data, detail: dataDetail };
//         }
//         console.error(`Jurnal dengan ${gl_number} tidak ditemukan`);
//         return;
//     });
//     return data;
// };

// export const updateAccGlTrans = async (params: AccGlTrans["gl_number"], form: NewAccGlTrans, formDetail: NewAccGlDetail[], tx = db) => {
//     const [data] = await tx
//         .update(acc_gl_trans)
//         .set({ ...form })
//         .where(eq(acc_gl_trans.gl_number, params))
//         .returning();

//     const dataDetail = await tx
//         .insert(acc_gl_detail)
//         .values(
//             formDetail.map((item) => {
//                 return { ...item, gl_number: data.gl_number };
//             }),
//         )
//         .returning();
//     await updateAccValue(formatDate(form.gl_date), tx);

//     return { ...data, detail: dataDetail };
// };
