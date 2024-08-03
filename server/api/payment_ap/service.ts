// import { desc, eq, sql } from "drizzle-orm";

// import { insertAccGlDetailSchema } from "../accounting/acc_gl_trans/acc_gl_detail/schema";
// import { insertAccGlTransSchema } from "../accounting/acc_gl_trans/schema";
// import { createAccGlTrans } from "../accounting/acc_gl_trans/service";
// import { acc_ap_faktur } from "../ap/schema";
// import { getAccApFaktur } from "../ap/service";
// import { kontak } from "../kontak/schema";
// import { getAccProposalApDetail } from "../proposal_ap/service";
// import { getSettingByName } from "../setting/service";
// import { payment_ap_detail, paymentApDetailColumns } from "./detail/schema";
// import { NewPaymentAp, payment_ap, PaymentAp, paymentApColumns, UpdatePaymentAp } from "./schema";
// import { Pegawai } from "../pegawai/schema";
// import { getPegawaiById, getPegawaiHeadDepartemen, getPegawaiByIdJabatan } from "../pegawai/service";
// import { persetujuanStrings, jabatanPersetujuanStrings } from "../schema";
// import { PaymentApPersetujuan } from "./persetujuan/schema";
// import { createPaymentApPersetujuan, getPaymentApPersetujuanByPegawai } from "./persetujuan/service";
// import { getPaymentApSettings } from "./setting/service";

// export const nomorPaymentAp = async (tanggal: string, tx = db) => {
//     return await moduleNumberGenerator("payment_ap", "number", "date", "PAP", tanggal, tx);
// };

// export const getPaymentAp = async (tx = db) => {
//     const data = await tx
//         .select({
//             ...paymentApColumns,
//             supplier: kontak.kontak,
//         })
//         .from(payment_ap)
//         .leftJoin(kontak, eq(payment_ap.id_supplier, kontak.id))
//         .orderBy(desc(payment_ap.date));
//     return data;
// };

// export const getPaymentApDetail = async (supplier: PaymentAp["id_supplier"], tx = db) => {
//     return await tx.transaction(async (tx) => {
//         const method = await getSettingByName("payment_method", tx);
//         switch (method.value) {
//             case "acc_ap_faktur":
//                 return await getAccApFaktur({ id_kontak: supplier }, tx);
//             case "proposal":
//                 return await getAccProposalApDetail({ id_kontak: supplier }, tx);
//             default:
//                 return await getAccApFaktur({ id_kontak: supplier }, tx);
//         }
//     });
// };

// export const getPaymentApById = async (params: PaymentAp["id"], tx = db) => {
//     const data = await tx.transaction(async (tx) => {
//         const [data] = await tx
//             .select({
//                 ...paymentApColumns,
//                 supplier: kontak.kontak,
//                 akun_hutang: kontak.akun_hutang,
//             })
//             .from(payment_ap)
//             .innerJoin(kontak, eq(payment_ap.id_supplier, kontak.id))
//             .where(eq(payment_ap.id, params));
//         const dataDetail = await tx
//             .select({
//                 ...paymentApDetailColumns,
//                 invoice_number: acc_ap_faktur.invoice_number,
//                 date: acc_ap_faktur.date,
//                 pay: payment_ap_detail.amount,
//                 amount: payment_ap_detail.ap_amount,
//             })
//             .from(payment_ap_detail)
//             .leftJoin(acc_ap_faktur, eq(payment_ap_detail.ap_number, acc_ap_faktur.ap_number))
//             .where(eq(payment_ap_detail.id, data.id));
//         return { ...data, detail: dataDetail };
//     });
//     return data;
// };

// export const createPaymentAp = async (form: NewPaymentAp, tx = db) => {
//     const [data] = await tx.insert(payment_ap).values(form).returning();
//     return data;
// };

// export const updatePaymentAp = async (id: PaymentAp["id"], form: UpdatePaymentAp, tx = db) => {
//     const [data] = await tx
//         .update(payment_ap)
//         .set({ ...form, updated_at: sql`NOW()` })
//         .where(eq(payment_ap.id, id))
//         .returning();
//     return data;
// };

// export const deletePaymentAp = async (id: PaymentAp["id"], tx = db) => {
//     const [data] = await tx.transaction(async (tx) => {
//         const [check] = await tx.select({ status: payment_ap.status }).from(payment_ap).where(eq(payment_ap.id, id));
//         if (check.status === "C") {
//             throw ValidationError("Tidak bisa menghapus data yang sudah di posting");
//         }
//         await tx.delete(payment_ap_detail).where(eq(payment_ap_detail.id, id));
//         return await tx.delete(payment_ap).where(eq(payment_ap.id, id)).returning();
//     });
//     return data;
// };

// export const createJurnal = async (data: PaymentAp, jurnal: any, tx = db) => {
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


// export const createPaymentApPersetujuanBySetting = async (id: PaymentAp['id'], id_pegawai: Pegawai['id'],tx = db) => {
//     const lPersetujuan: PaymentApPersetujuan[] = [];
//     const settingPersetujuan = await getPaymentApSettings(tx);
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
//                     dataPersetujuan = await createPaymentApPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
//                     lPersetujuan.push(dataPersetujuan);
//                     break;

//                 case "2": // head departemen
//                     const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
//                     if (pegawai2) {
//                         const check = await getPaymentApPersetujuanByPegawai(id, pegawai2.id, tx);
//                         if (pegawai2.id == id_pegawai || check) {
//                             break;
//                         }
//                         const persetujuan = await createPaymentApPersetujuan(id, pegawai2.id as number, index + 1, tx);
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
//                         const check = await getPaymentApPersetujuanByPegawai(id, pegawai3.id, tx);
//                         if (pegawai3.id == id_pegawai || check) {
//                             break;
//                         }
//                         const persetujuan = await createPaymentApPersetujuan(id, pegawai3.id as number, index + 1, tx);
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