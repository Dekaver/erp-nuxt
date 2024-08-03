// import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";
// import { account } from "../account/schema";
// import { updateAccValue } from "../accounting/service";
// import { AccGlDetail, acc_gl_detail } from "../accounting/acc_gl_trans/acc_gl_detail/schema";
// import { acc_gl_trans } from "../accounting/acc_gl_trans/schema";
// import { acc_kas_detail, NewAccKasDetail, AccKasDetail } from "./detail/schema";
// import { AccKas, acc_kas, NewAccKas, AccKasColumns } from "./schema";


// export const getAccKas = async (type: AccKas["type"], tx = db) => {
//     const query = tx
//         .select({
//             ...AccKasColumns,
//             nama_akun: account.name,
//             kode_akun: account.code,
//         })
//         .from(acc_kas)
//         .leftJoin(account, eq(acc_kas.akun, account.id));
//     if (type) {
//         query.where(eq(acc_kas.type, type));
//     }
//     const data = await query.orderBy(asc(acc_kas.id));
//     return data;
// };

// export const getAccKasById = async (params: AccKas["id"], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [data] = await trx.select().from(acc_kas).where(eq(acc_kas.id, params));
//         const dataDetail = await trx
//             .select({
//                 ...accKasDetailColumns,
//                 code_account: account.code,
//                 name_account: account.name,
//             })
//             .from(acc_kas_detail)
//             .leftJoin(account, eq(acc_kas_detail.id_account, account.id))
//             .where(eq(acc_kas_detail.id, params));
//         return { ...data, detail: dataDetail };
//     });
//     return data;
// };

// export const createAccKas = async (form: NewAccKas, formDetail: NewAccKasDetail[], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const [data] = await trx.insert(acc_kas).values(form).returning();
//         const dataDetail = await trx
//             .insert(acc_kas_detail)
//             .values(
//                 formDetail.map((item) => {
//                     return {
//                         ...item,
//                         id: data.id,
//                     };
//                 }),
//             )
//             .returning();

//         if (data.status === "C") {
//             await updateStatusAccKas(data, dataDetail, trx);
//         }

//         return {
//             ...data,
//             detail: dataDetail,
//         };
//     });
//     return data;
// };

// export const updateAccKas = async (params: AccKas["id"], form: NewAccKas, formDetail: NewAccKasDetail[], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const check = await checkStatus(params, trx);
//         if (check.status === "C") {
//             throw ValidationError("Data sudah di Closing");
//         }
//         const [data] = await trx.update(acc_kas).set(form).where(eq(acc_kas.id, params)).returning();
//         const dataDetail = await trx.transaction(async (trx2) => {
//             await trx2.delete(acc_kas_detail).where(eq(acc_kas_detail.id, params));
//             const dataDetail = await trx2
//                 .insert(acc_kas_detail)
//                 .values(
//                     formDetail.map((item) => {
//                         return {
//                             ...item,
//                             id: data.id,
//                         };
//                     }),
//                 )
//                 .returning();
//             return dataDetail;
//         });

//         if (data.status === "C") {
//             await updateStatusAccKas(data, dataDetail, trx);
//         }

//         return {
//             ...data,
//             detail: dataDetail,
//         };
//     });
//     return data;
// };

// export const deleteAccKas = async (id: AccKas["id"], tx = db) => {
//     const data = await tx.transaction(async (trx) => {
//         const check = await checkStatus(id, trx);
//         if (check.status === "C") {
//             throw ValidationError("Data Kas Tidak Bisa di Hapus Karena Sudah di Closing");
//         }
//         const dataDetail = await trx.delete(acc_kas_detail).where(eq(acc_kas_detail.id, id)).returning();
//         const [data] = await trx.delete(acc_kas).where(eq(acc_kas.id, id)).returning();
//     });
//     return data;
// };

// export const checkStatus = async (id: AccKas["id"], tx = db) => {
//     const [data] = await tx.select({ status: acc_kas.status }).from(acc_kas).where(eq(acc_kas.id, id));
//     return data;
// };

// export const updateStatusAccKas = async (form: AccKas, formDetail: AccKasDetail[], tx = db) => {
//     try {
//         return await tx.transaction(async (trx) => {
//             const nomorGLFix = await nomorGlTrans(form.date, trx);
//             // insert ke gl trans
//             const [dataGlTrans] = await trx
//                 .insert(acc_gl_trans)
//                 .values({
//                     ...form,
//                     gl_number: nomorGLFix,
//                     gl_date: form.date,
//                     is_posting: true,
//                     journal_code: form.type === "I" ? "JKI" : "JKK",
//                 })
//                 .returning();

//             // proses bedah data
//             const formDariDetail: AccGlDetail[] = formDetail.map((item: AccKasDetail, index: number) => {
//                 return {
//                     gl_number: dataGlTrans.gl_number,
//                     line: index + 1,
//                     id_account: item.id_account,
//                     amount: item.amount,
//                     description: item.desc,
//                     is_debit: form.type === "I" ? false : true,
//                     id_kantor: null,
//                     id_proyek: null,
//                 };
//             });

//             const formDariHeader: AccGlDetail = {
//                 gl_number: dataGlTrans.gl_number,
//                 line: 0,
//                 id_account: form.akun,
//                 amount: form.total,
//                 description: form.description,
//                 is_debit: form.type === "I" ? true : false,
//                 id_kantor: null,
//                 id_proyek: null,
//             };

//             // kalau kas masuk, maka headernya di depan
//             // kalau kas keluar, maka headernya di belakang
//             let formGlDetail: AccGlDetail[] = [];
//             if (form.type === "I") {
//                 formGlDetail = formDariDetail;
//                 formGlDetail.unshift(formDariHeader);
//             } else {
//                 formGlDetail = formDariDetail;
//                 formGlDetail.push(formDariHeader);
//             }

//             // insert ke gl detail
//             const dataGlDetail = await trx
//                 .insert(acc_gl_detail)
//                 .values(
//                     formGlDetail.map((item: AccGlDetail, index: number) => {
//                         return {
//                             ...item,
//                             line: index + 1,
//                         };
//                     }),
//                 )
//                 .returning();

//             // update acc value
//             return await updateAccValue(formatDate(form.date), trx);
//         });
//     } catch (error) {
//         console.log(error);
//         throw ValidationError("Gagal Update Status Acc Kas");
//     }
// };
