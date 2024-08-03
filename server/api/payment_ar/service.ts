// import { eq, sql } from "drizzle-orm";




// import { insertAccGlDetailSchema } from "../accounting/acc_gl_trans/acc_gl_detail/schema";
// import { insertAccGlTransSchema } from "../accounting/acc_gl_trans/schema";
// import { createAccGlTrans } from "../accounting/acc_gl_trans/service";
// import { acc_ar_faktur } from "../ar/schema";
// import { kontak } from "../kontak/schema";
// import { paymentArDetailColumns, payment_ar_detail, NewPaymentArDetail } from "./detail/schema";
// import { paymentArColumns, payment_ar, PaymentAr, NewPaymentAr, UpdatePaymentAr } from "./schema";
// import { PaymentArPersetujuan } from "./persetujuan/schema";
// import { getPaymentArSettings } from "./setting/service";
// import { jabatanPersetujuanStrings, persetujuanStrings } from "../schema";
// import { Pegawai } from "../pegawai/schema";
// import { getPegawaiById, getPegawaiHeadDepartemen, getPegawaiByIdJabatan } from "../pegawai/service";
// import { createPaymentArPersetujuan, getPaymentArPersetujuanByPegawai } from "./persetujuan/service";

// export const nomorPaymentAr = async (tanggal: string, tx = db) => {
//     return await moduleNumberGenerator("payment_ar", "number", "date", "PAR", tanggal, tx);
// };

// export const getPaymentAr = async (tx = db) => {
//     const data = await tx
//         .select({
//             ...paymentArColumns,
//             customer: kontak.kontak,
//         })
//         .from(payment_ar)
//         .leftJoin(kontak, eq(payment_ar.id_customer, kontak.id));
//     return data;
// };

// export const getPaymentArById = async (params: PaymentAr["id"], tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const [data] = await trx
//             .select({
//                 ...paymentArColumns,
//                 kontak: kontak.kontak,
//                 akun_piutang: kontak.akun_piutang,
//             })
//             .from(payment_ar)
//             .innerJoin(kontak, eq(kontak.id, payment_ar.id_customer))
//             .where(eq(payment_ar.id, params));

//         // if data not found return 404
//         if (data == undefined) {
//             throw NotFoundError("No Payment Ar Founded");
//         }

//         const dataDetail = await trx
//             .select({
//                 ...paymentArDetailColumns,
//                 date: acc_ar_faktur.invoice_date,
//             })
//             .from(payment_ar_detail)
//             .innerJoin(acc_ar_faktur, eq(acc_ar_faktur.invoice, payment_ar_detail.invoice))
//             .where(eq(payment_ar_detail.id, data.id));
//         return { ...data, detail: dataDetail };
//     });
// };

// export const createPaymentAr = async (form: NewPaymentAr, tx = db) => {
//     const [data] = await tx.insert(payment_ar).values(form).returning();
//     return data;
// };

// export const updatePaymentAr = async (params: PaymentAr["id"], form: UpdatePaymentAr, tx = db) => {
//     const [data] = await tx.update(payment_ar).set(form).where(eq(payment_ar.id, params)).returning();
//     return data;
// };

// export const deletePaymentAr = async (id: PaymentAr["id"], tx = db) => {
//     const [data] = await tx.transaction(async (trx) => {
//         await trx.delete(payment_ar_detail).where(eq(payment_ar_detail.id, id));
//         const data = await trx.delete(payment_ar).where(eq(payment_ar.id, id)).returning();
//         return data;
//     });
//     return data;
// };
// export const createJurnal = async (data: PaymentAr, jurnal: any, tx = db) => {
//     return await tx.transaction(async (tx) => {
//         //Tambah ke dalam ACC GL Trans;
//         const numberGL = await nomorGlTrans(data.date, tx);

//         const validate = insertAccGlTransSchema.parse({
//             journal_code: "PAR",
//             gl_number: numberGL,
//             gl_date: formatDate(data.date),
//             note: data.description,
//             is_posting: true,
//             reference: data.number,
//         });

//         // Tambah Detailnya
//         const validateDetail = jurnal.map((item: any, index: number) => {
//             return insertAccGlDetailSchema.parse({
//                 ...item,
//                 gl_number: numberGL,
//                 line: index + 1,
//                 amount: ToString(item.amount),
//                 description: data.description,
//             });
//         });

//         await createAccGlTrans(validate, validateDetail, tx);
//     });
// };


// export const createPaymentArPersetujuanBySetting = async (id: PaymentAr['id'], id_pegawai: Pegawai['id'],tx = db) => {
//     const lPersetujuan: PaymentArPersetujuan[] = [];
//     const settingPersetujuan = await getPaymentArSettings(tx);
//     for (let index = 0; index < persetujuanStrings.length; index++) {
//         const persetujuan = persetujuanStrings[index];
//         const jabatan = jabatanPersetujuanStrings[index];
//         if (settingPersetujuan[persetujuan]) {
//             let dataPersetujuan;
//             // ulang setiap level persetujuan
//             switch (settingPersetujuan[persetujuan]) {
//                 case "1": // atasan langsung
//                     const pegawai1 = await getPegawaiById(id_pegawai, tx);
//                     if (pegawai1.atasan_langsung && pegawai1.atasan_langsung == id_pegawai) {
//                         break;
//                     }
//                     // Persetujuan 1
//                     dataPersetujuan = await createPaymentArPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
//                     lPersetujuan.push(dataPersetujuan);
//                     break;

//                 case "2": // head departemen
//                     const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
//                     if (pegawai2) {
//                         const check = await getPaymentArPersetujuanByPegawai(id, pegawai2.id, tx);
//                         if (pegawai2.id == id_pegawai || check) {
//                             break;
//                         }
//                         const persetujuan = await createPaymentArPersetujuan(id, pegawai2.id as number, index + 1, tx);
//                         lPersetujuan.push(persetujuan);
//                     } else {
//                         throw ValidationError("Tidak Ada pegawai pada jabatan yang dipilih");
//                     }
//                     break;

//                 case "3": // jabatan tertentu
//                     const lPegawai = await getPegawaiByIdJabatan(settingPersetujuan[jabatan], tx);
//                     if (lPegawai.length > 1) {
//                         throw ValidationError(`Pegawai Pada Jabatan ${lPegawai[0].jabatan} lebih dari 1`);
//                     }
//                     const [pegawai3] = lPegawai;
//                     if (pegawai3) {
//                         const check = await getPaymentArPersetujuanByPegawai(id, pegawai3.id, tx);
//                         if (pegawai3.id == id_pegawai || check) {
//                             break;
//                         }
//                         const persetujuan = await createPaymentArPersetujuan(id, pegawai3.id as number, index + 1, tx);
//                         lPersetujuan.push(persetujuan);
//                     } else {
//                         throw ValidationError("Tidak Ada pegawai pada jabatan yang dipilih");
//                     }
//                     break;

//                 default:
//                     break;
//             }
//             continue;
//         }
//         // jika persetujuan false hentikan loop level
//         break;
//     }
//     return lPersetujuan
// };