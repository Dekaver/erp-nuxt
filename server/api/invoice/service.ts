// import { and, eq, sql } from "drizzle-orm";


// import { alias } from "drizzle-orm/pg-core";
// import { gudang } from "../gudang/schema";
// import { kontak } from "../kontak/schema";
// import { Pegawai, pegawai } from "../pegawai/schema";
// import { Barang } from "../barang/schema";
// import { jabatan } from "../jabatan/schema";
// import { getBarangById } from "../barang/service";
// import { sales_order_detail } from "../sales_order/detail/schema";
// import { sales_order } from "../sales_order/schema";
// import { getQtyAvailability, kurangStokBarang, updateStokBarang } from "../gudang/stok_barang/service";
// import { checkSisaDetail, updateStatusSalesOrder } from "../sales_order/service";
// import { insertAccGlDetailSchema } from "../accounting/acc_gl_trans/acc_gl_detail/schema";
// import { insertAccGlTransSchema } from "../accounting/acc_gl_trans/schema";
// import { createAccGlTrans } from "../accounting/acc_gl_trans/service";
// import { invoice_delivery_order } from "./delivery_order/schema";
// import { invoice_detail, InvoiceDetail } from "./detail/schema";
// import { Invoice, invoiceColumns, invoice, NewInvoice, UpdateInvoice } from "./schema";
// import * as dayjs from 'dayjs'
// import { top } from "../top/schema";
// import { updateStokBarangSchema } from "../gudang/stok_barang/schema";
// import { invoice_hpp } from "./hpp/schema";
// import { getPegawaiById, getPegawaiHeadDepartemen, getPegawaiByIdJabatan } from "../pegawai/service";
// import { persetujuanStrings, jabatanPersetujuanStrings } from "../schema";
// import { InvoicePersetujuan } from "./persetujuan/schema";
// import { createInvoicePersetujuan, getInvoicePersetujuanByPegawai } from "./persetujuan/service";
// import { getInvoiceSettings } from "./setting/service";

// export const nomorInvoice = async (tanggal: string, tx = db) => {
//     return await moduleNumberGenerator("invoice", "nomor", "tanggal", "INV", tanggal, tx);
// };

// export const getInvoice = async (params: any) => {
//     let status = params.status;
//     let query = `SELECT a.*, b.nama as created_name, c.nama as updated_name, d.name as created_jabatan, e.name as updated_jabatan, f.kontak as customer, i.gudang
//                     FROM invoice a 
//                         LEFT JOIN hr.pegawai b ON b.id=a.created_by 
//                         LEFT JOIN hr.pegawai c ON c.id=a.updated_by 
//                         LEFT JOIN hr.jabatan d ON d.id=b.id_jabatan 
//                         LEFT JOIN hr.jabatan e ON e.id=c.id_jabatan 
//                         LEFT JOIN hr.pegawai g ON g.id=a.id_salesman
//                         LEFT JOIN gudang i ON i.id=a.id_gudang
//                         LEFT JOIN delivery_order h ON h.id=a.id_salesman
// 						            LEFT JOIN kontak f ON f.id=a.id_kontak 
//                 WHERE true `;
//     if (status !== null && status !== undefined) {
//         if (typeof status === "string") {
//             query += ` AND a.status='${status}' `;
//         } else if (Array.isArray(status)) {
//             const statusValues = status.map((s) => `'${s}'`).join(", ");
//             query += ` AND a.status IN (${statusValues}) `;
//         }
//     }

//     query += " ORDER BY tanggal DESC, nomor DESC";
//     const data = await db.execute(sql.raw(query));
//     return data;
// };

// export const getOptionInvoice = async (params: any) => {
//     let status = params.status;
//     let query = `SELECT a.id, a.nomor, a.tanggal, b.nama as created_name, c.nama as updated_name, d.name as created_jabatan, e.name as updated_jabatan
//                     FROM invoice a 
//                         LEFT JOIN hr.pegawai b ON b.id=a.created_by 
//                         LEFT JOIN hr.pegawai c ON c.id=a.updated_by 
//                         LEFT JOIN hr.jabatan d ON d.id=b.id_jabatan 
//                         LEFT JOIN hr.jabatan e ON e.id=c.id_jabatan 
// 						            LEFT JOIN kontak f ON f.id=a.id_kontak
//                         WHERE true `;
//     if (status !== null && status !== undefined) {
//         if (typeof status === "string") {
//             query += ` AND a.status='${status}' `;
//         } else if (Array.isArray(status)) {
//             const statusValues = status.map((s) => `'${s}'`).join(", ");
//             query += ` AND a.status IN (${statusValues}) `;
//         }
//     }
//     const data = await db.execute(sql`(${sql.raw(query)})`);
//     return data;
// };

// export const getInvoiceById = async (id: Invoice["id"], tx = db) => {
//     const salesman = alias(pegawai, "salesman");
//     const [data] = await tx
//         .select({
//             ...invoiceColumns,
//             customer: kontak.kontak,
//             alamat: kontak.alamat_kirim,
//             akun_piutang: kontak.akun_piutang,
//             salesman: salesman.nama,
//             created_name: pegawai.nama,
//             created_jabatan: jabatan.jabatan,
//             gudang: gudang.gudang,
//             nomor_so: sales_order.nomor,
//             top_keterangan: sql`(CASE 
//                                     WHEN top.keterangan='Custom' THEN invoice.top || ' Day'
//                                     ELSE top.keterangan
//                                 END)`.as("top_keterangan"),
//         })
//         .from(invoice)
//         .innerJoin(pegawai, eq(pegawai.id, invoice.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(salesman, eq(salesman.id, invoice.id_salesman))
//         .innerJoin(kontak, eq(kontak.id, invoice.id_kontak))
//         .innerJoin(gudang, eq(gudang.id, invoice.id_gudang))
//         .leftJoin(sales_order, eq(sales_order.id, invoice.id_so))
//         .innerJoin(top, eq(top.id, invoice.id_top))
//         .where(eq(invoice.id, id));
//     if (data == undefined) {
//         throw NotFoundError("Not found");
//     }

//     return data;
// };

// export const createInvoice = async (newInvoice: NewInvoice, tx = db) => {
//     try {
//         const [data] = await tx.insert(invoice).values(newInvoice).returning();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw ValidationError("error");
//     }
// };

// export const createInvoicePersetujuanBySetting = async (id: Invoice["id"], id_pegawai: Pegawai["id"], tx = db) => {
//     const lPersetujuan: InvoicePersetujuan[] = [];
//     const settingPersetujuan = await getInvoiceSettings(tx);
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
//                     dataPersetujuan = await createInvoicePersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
//                     lPersetujuan.push(dataPersetujuan);
//                     break;

//                 case "2": // head departemen
//                     const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
//                     if (pegawai2) {
//                         const check = await getInvoicePersetujuanByPegawai(id, pegawai2.id, tx);
//                         if (pegawai2.id == id_pegawai || check) {
//                             break;
//                         }
//                         const persetujuan = await createInvoicePersetujuan(id, pegawai2.id as number, index + 1, tx);
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
//                         const check = await getInvoicePersetujuanByPegawai(id, pegawai3.id, tx);
//                         if (pegawai3.id == id_pegawai || check) {
//                             break;
//                         }
//                         const persetujuan = await createInvoicePersetujuan(id, pegawai3.id as number, index + 1, tx);
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
//     return lPersetujuan;
// };

// export const updateStatusInvoiceOpen = async (form: Invoice, formDetail: InvoiceDetail[], tx = db) => {
//     const dataInvoiceHpp = await tx.select().from(invoice_hpp).where(eq(invoice_hpp.id, form.id));
//     for (const invoiceHpp of dataInvoiceHpp) {
//         const dataStokBarang = await updateStokBarang(invoiceHpp.id_stok_barang, parseFloat(invoiceHpp.qty), tx);
//         const bulan = formatDate(form.tanggal, "M");
//         const tahun = formatDate(form.tanggal, "YYYY");
//         await tx.execute(
//             sql.raw(`UPDATE stok_value set cr${bulan}=cr${bulan} - ${invoiceHpp.qty} WHERE id_gudang=${dataStokBarang.id_gudang} AND id_barang=${dataStokBarang.id_barang} AND tahun=${tahun}`),
//         );
//     }
//     await tx.delete(invoice_hpp).where(eq(invoice_hpp.id, form.id));

//     const id_gudang = form.id_gudang;
//     for (let j = 0; j < formDetail.length; j++) {
//         const d = formDetail[j];
//         const dataBarang: Barang = await getBarangById(d.id_barang as number, tx);
//         // TODO: check if barang is stok gk tau jasa itu gmn
//         if (dataBarang?.is_stok) {
//             //ambil stok barang dari gudang sesuai id barang
//             const availability_stok = await getQtyAvailability(parseFloat(d.qty as string), d.id_barang as number, d.id_satuan, id_gudang as number, tx);

//             //cek stok apakah mencukupi untuk di pakai
//             if (availability_stok.is_available_qty) {
//                 if (form.id_so) {
//                     await tx
//                         .update(sales_order_detail)
//                         .set({
//                             diambil: d.qty as string,
//                             sisa: sql`sisa - ${d.qty}`,
//                         })
//                         .where(and(eq(sales_order_detail.id, form.id_so), eq(sales_order_detail.id_barang, d.id_barang as number)));
//                 }

//                 const validate = updateStokBarangSchema.parse({
//                     id_gudang: form.id_gudang,
//                     id_barang: d.id_barang,
//                     stok: d.qty,
//                     tanggal: formatDate(form.tanggal),
//                     stok_awal: d.qty,
//                     updated_by: form.updated_by,
//                 });
//                 const lHpp = await kurangStokBarang([validate], "FIFO", tx);

//                 for (const hpp of lHpp as any[]) {
//                     await tx.insert(invoice_hpp).values({ id: form.id, id_stok_barang: hpp.id_stok, qty: hpp.qty });
//                 }
//             } else {
//                 throw ValidationError(`Stok ${dataBarang.nama_barang} Tersisa ${availability_stok.sisa_stok || 0} ${availability_stok.satuan}`);
//             }
//         }
//     }
//     //tambah ke dalam stok value
//     // jika yang di ubah adalah tahun sebelumnya maka update saldo awal tahun ini
//     if (form.id_so) {
//         const sisa = await checkSisaDetail(form.id_so, tx);
//         if (sisa > 0) {
//             await updateStatusSalesOrder(form.id_so, "P", tx);
//         } else {
//             await updateStatusSalesOrder(form.id_so, "C", tx);
//         }
//     }
// };

// export const updateInvoice = async (id: Invoice["id"], form: UpdateInvoice, tx = db) => {
//     try {
//         const [data] = await tx
//             .update(invoice)
//             .set({
//                 ...form,
//                 updated_at: sql`now()`,
//             })
//             .where(eq(invoice.id, id))
//             .returning();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("error");
//     }
// };

// export const updateInvoiceStatusByNomor = async (nomor: Invoice["nomor"], status: UpdateInvoice["status"], tx = db) => {
//     try {
//         const [data] = await tx
//             .update(invoice)
//             .set({
//                 status: status,
//                 updated_at: sql`now()`,
//             })
//             .where(eq(invoice.nomor, nomor))
//             .returning();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("error");
//     }
// };

// export const deleteInvoice = async (id: Invoice["id"], tx = db) => {
//     try {
//         await tx.transaction(async (tx) => {
//             await tx.delete(invoice_delivery_order).where(eq(invoice_delivery_order.id_invoice, id)).returning();
//             await tx.delete(invoice_detail).where(eq(invoice_detail.id, id));
//             const [data] = await tx.delete(invoice).where(eq(invoice.id, id)).returning();
//             const dataInvoiceHpp = await tx.select().from(invoice_hpp).where(eq(invoice_hpp.id, id));
//             for (const invoiceHpp of dataInvoiceHpp) {
//                 const dataStokBarang = await updateStokBarang(invoiceHpp.id_stok_barang, parseFloat(invoiceHpp.qty), tx);
//                 const bulan = formatDate(data.tanggal, "M");
//                 const tahun = formatDate(data.tanggal, "YYYY");
//                 await tx.execute(
//                     sql.raw(`UPDATE stok_value set cr${bulan}=cr${bulan} + ${invoiceHpp.qty} WHERE id_gudang=${dataStokBarang.id_gudang} AND id_barang=${dataStokBarang.id_barang} AND tahun=${tahun}`),
//                 );
//             }
//             await tx.delete(invoice_hpp).where(eq(invoice_hpp.id, id));
//         });
//         return 1;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("error");
//     }
// };

// export const createJurnal = async (data: Invoice, jurnal: any, tx = db) => {
//     return await tx.transaction(async (tx) => {
//         //Tambah ke dalam ACC GL Trans;
//         const numberGL = await nomorGlTrans(dayjs(data.tanggal).format("YYYY-MM-DD"), tx);

//         const validate = insertAccGlTransSchema.parse({
//             journal_code: "JPU",
//             gl_number: numberGL,
//             gl_date: formatDate(data.tanggal),
//             note: data.keterangan,
//             is_posting: true,
//             reference: data.nomor,
//         });

//         // Tambah Detailnya
//         const validateDetail = jurnal.map((item: any, index: number) => {
//             return insertAccGlDetailSchema.parse({
//                 ...item,
//                 gl_number: numberGL,
//                 line: index + 1,
//                 amount: ToString(item.amount),
//                 description: data.keterangan,
//             });
//         });

//         await createAccGlTrans(validate, validateDetail, tx);
//     });
// };

// export const getYearlyInvoice = async (year: string, tx = db) => {
//     const data = await tx.execute(
//         sql.raw(`
// 			SELECT
// 				EXTRACT(MONTH FROM m.month) AS month,
// 				COALESCE(SUM(i.grandtotal), 0) AS grandtotal
// 			FROM
// 				(
// 					SELECT
// 						generate_series(
// 							DATE_TRUNC('month', '${year}-01-01'::DATE),
// 							DATE_TRUNC('month', '${year}-12-01'::DATE),
// 							INTERVAL '1 month'
// 						)::DATE AS month
// 				) m
// 			LEFT JOIN
// 				invoice i ON DATE_TRUNC('month', i.tanggal) = m.month
// 			GROUP BY
// 				m.month
// 			ORDER BY
// 				month;
// 			`),
//     );

//     return data;
// };
