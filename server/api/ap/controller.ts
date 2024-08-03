// import { NextFunction, Request, Response } from "express";
// import * as dayjs from 'dayjs'
// import { MyRequest } from "src/middleware/authMiddleware";

// 
// import { deleteAccGlTrans, getAccGlTransByReference } from "../accounting/acc_gl_trans/service";
// import { getKontakById } from "../kontak/service";
// import { getPenerimaanBarangDetailById } from "../penerimaan_barang/detail/service";
// import { getPenerimaanBarangById } from "../penerimaan_barang/service";
// import { PurchaseOrderDetail } from "../purchase_order/detail/schema";
// import { getPurchaseOrderDetailById } from "../purchase_order/detail/service";
// import { getPurchaseOrderById } from "../purchase_order/service";
// import { ApDetail, insertApDetailSchema, NewApDetail } from "./detail/schema";
// import { createApDetail, deleteApDetail, getApDetailById } from "./detail/service";
// import { ApPenerimaanBarang, insertApPenerimaanBarangSchema, NewApPenerimaanBarang } from "./penerimaan_barang/schema";
// import { createApPenerimaanBarang, deleteApPenerimaanBarang, getApPenerimaanBarangById } from "./penerimaan_barang/service";
// import { insertAccApFakturSchema, insertApSchema, NewAp, updateApSchema } from "./schema";
// import {
//     createAccApFaktur,
//     createAp,
//     createApPersetujuanBySetting,
//     createJurnal,
//     deleteAccApFaktur,
//     deleteAp,
//     getAccApFaktur,
//     getAccApFakturByDate,
//     getAccApFakturBySupplier,
//     getAp,
//     getApById,
//     getApDetailBySupplier,
//     getLaporanAp,
//     getUmurInvoiceAp,
//     nomorAp,
//     updateAp,
//     updateStatusApOpen,
// } from "./service";
// import { deleteApPersetujuan, getApPersetujuan } from "./persetujuan/service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id_kontak, status } = req.query;
//         const data = await getAp({ id_kontak: parseInt(id_kontak as string), status: status as string });
//         res.status(200).json({
//             message: "Success get ap",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             const data = await getApById(id, tx);
//             const dataDetail = await getApDetailById(id, tx);
//             const dataPersetujuan = await getApPersetujuan(id, tx);
//             const dataPenerimaanBarang = await getApPenerimaanBarangById(id, tx);

//             const hasil: any = {};
//             dataDetail.forEach((item) => {
//                 if (hasil[item.nama_barang]) {
//                     // Jika nama barang sudah ada dalam hasil, tambahkan qty
//                     hasil[item.nama_barang].qty = parseFloat(hasil[item.nama_barang].qty) + parseFloat(item.qty);
//                     hasil[item.nama_barang].total = parseFloat(hasil[item.nama_barang].total) + parseFloat(item.total);
//                     hasil[item.nama_barang].nomor_pb += item.nomor_pb ? `, ${item.nomor_pb}` : "";
//                 } else {
//                     // Jika nama barang belum ada dalam hasil, tambahkan entri baru
//                     hasil[item.nama_barang] = { ...item };
//                 }
//             });

//             // Mengonversi objek hasil kembali menjadi array
//             const hasilArray = Object.values(hasil);

//             return { ...data, detail: hasilArray, penerimaan_barang: dataPenerimaanBarang, persetujuan: dataPersetujuan };
//         });
//         res.status(200).json({
//             message: "Success get ap by id",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             // Bedah data
//             const { id, jurnal, detail, ...rest } = req.body;

//             // Nomor AP
//             const nomorFix = await nomorAp(rest.tanggal, tx);

//             // Validasi AP
//             const validate: NewAp = insertApSchema.parse({
//                 ...rest,
//                 nomor: nomorFix,
//                 tanggal: formatDate(rest.tanggal),
//                 tanggal_jatuh_tempo: formatDate(rest.tanggal_jatuh_tempo),
//                 tanggal_referensi: rest.tanggal_referensi ? formatDate(rest.tanggal_referensi) : null,
//                 tanggal_pengiriman: rest.tanggal_pengiriman ? formatDate(rest.tanggal_pengiriman) : null,
//                 total_discount: ToString(rest.total_discount),
//                 total_pajak: ToString(rest.total_pajak),
//                 total: ToString(rest.total),
//                 persendiskon: ToString(rest.persendiskon),
//                 grandtotal: ToString(rest.grandtotal),
//                 biaya_transportasi: ToString(rest.biaya_transportasi),
//                 biaya_asuransi: ToString(rest.biaya_asuransi),
//                 biaya_bongkar_muat: ToString(rest.biaya_bongkar_muat),
//                 biaya_bongkar_muat_external: ToString(rest.biaya_bongkar_muat_external),
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });

//             // Buat AP
//             const data = await createAp(validate, tx);

//             // Validasi AP Detail
//             const validateDetail = detail.map((item: NewApDetail, index: number) =>
//                 insertApDetailSchema.parse({
//                     ...item,
//                     id: data.id,
//                     urut: index + 1,
//                     qty: ToString(item.qty),
//                     total: ToString(item.total),
//                     diskonpersen: ToString(item.diskonpersen),
//                     diskonrp: ToString(item.diskonrp),
//                     harga: ToString(item.harga),
//                 }),
//             );

//             const dataDetail = await createApDetail(validateDetail, tx);
//             if (data.status == "C") {
//                 const lPersetujuan = await createApPersetujuanBySetting(data.id, req.user!.id, tx);
//                 return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
//             }

//             if (data.status == "O") {
//                 // Add acc ap faktur
//                 const validateAccApFaktur = insertAccApFakturSchema.parse({
//                     ap_number: data.nomor,
//                     invoice_date: formatDate(data.tanggal_referensi as string),
//                     invoice_number: data.referensi as string,
//                     date: formatDate(data.tanggal),
//                     due_date: formatDate(data.tanggal_jatuh_tempo),
//                     id_supplier: data.id_supplier,
//                     id_top: data.id_top,
//                     pay: "0",
//                     amount: ToString(data.grandtotal) as string,
//                     top: data.top,
//                 });
//                 // hapus acc_ar_faktur
//                 await createAccApFaktur(validateAccApFaktur, tx);

//                 await updateStatusApOpen(data, dataDetail, tx);
//                 await createJurnal(data, jurnal, tx);
//             }

//             return { ...data, detail: dataDetail, persetujuan: [] };
//         });
//         res.status(200).json({
//             message: "Success create ap",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const storeWithPenerimaanBarang = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             // Bedah data
//             const list_penerimaan_barang = req.body.list_penerimaan_barang;

//             const id_supplier = list_penerimaan_barang[0].id_supplier;
//             const supplier = await getKontakById(id_supplier, tx);

//             const id_purchase_order = list_penerimaan_barang[0].id_po;
//             const dataPurchaseOrder = await getPurchaseOrderById(id_purchase_order, tx);

//             const tanggal = dayjs();
//             const tanggal_jatuh_tempo = tanggal.clone().add(supplier.top, "days");

//             // Nomor AP
//             const nomorFix = await nomorAp(formatDate(tanggal.toDate()), tx);

//             const validate: NewAp = insertApSchema.parse({
//                 nomor: nomorFix,
//                 id_supplier: dataPurchaseOrder.id_supplier,
//                 id_gudang: dataPurchaseOrder.id_gudang,
//                 id_po: dataPurchaseOrder.id,
//                 tanggal: formatDate(tanggal.toDate()),
//                 tanggal_jatuh_tempo: formatDate(tanggal_jatuh_tempo.toDate()),
//                 status: "D",
//                 id_top: supplier.id_top,
//                 top: supplier.top,
//                 referensi: null,
//                 keterangan: `Faktu Pembelian ${supplier.kontak}`,
//                 tanggal_referensi: null,
//                 tanggal_pengiriman: null,
//                 total_discount: null,
//                 total_pajak: null,
//                 total: "0",
//                 persendiskon: "0",
//                 grandtotal: "0",
//                 biaya_transportasi: "0",
//                 biaya_asuransi: "0",
//                 biaya_bongkar_muat: "0",
//                 biaya_bongkar_muat_external: "0",
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });

//             // Buat AP
//             const data = await createAp(validate, tx);
//             const validateDetail: NewApDetail[] = [];
//             const validateApPenerimaanBarang: NewApPenerimaanBarang[] = [];
//             let index = 0;
//             let TotalPajak = 0;
//             let SubTotal = 0;

//             let tanggal_penerimaan : string = '';
//             for (const penerimaan_barang of list_penerimaan_barang) {
//                 const dataPenerimaanBarang = await getPenerimaanBarangById(penerimaan_barang.id, tx);
//                 const dataPenerimaanBarangDetail = await getPenerimaanBarangDetailById(penerimaan_barang.id, tx);
//                 for (const detail of dataPenerimaanBarangDetail) {
//                     const total = (parseFloat(detail?.harga as string) - parseFloat((detail?.diskonrp as string) || "0")) * parseFloat(detail.diambil);
//                     validateDetail.push(
//                         insertApDetailSchema.parse({
//                             ...detail,
//                             id: data.id,
//                             id_po: dataPurchaseOrder.id,
//                             id_pb: dataPenerimaanBarang.id,
//                             urut: ++index,
//                             qty: ToString(detail.diambil),
//                             total: ToString(detail.total),
//                             diskonpersen: ToString(detail.diskonpersen),
//                             diskonrp: ToString(detail.diskonrp),
//                             harga: ToString(detail.harga),
//                         }),
//                     );
//                     const pajak = detail.persen_pajak
//                         ?.split(",")
//                         .reduce((a, b) => a + (((parseFloat(detail.harga as string) - parseFloat((detail.diskonrp as string) || "0")) * parseFloat(b)) / 100) * parseFloat(detail.diambil), 0);
//                     TotalPajak += pajak || 0;
//                     SubTotal += total;
//                 }
//                 if (tanggal_penerimaan > dataPenerimaanBarang.tanggal || tanggal_penerimaan == '') {
//                     tanggal_penerimaan = formatDate(dataPenerimaanBarang.tanggal);
//                 }

//                 // Validasi PB Detail
//                 validateApPenerimaanBarang.push(
//                     insertApPenerimaanBarangSchema.parse({
//                         id_ap: data.id,
//                         id_penerimaan_barang: dataPenerimaanBarang.id,
//                     }),
//                 );
//             }

//             const dpp = SubTotal - (SubTotal * parseFloat((data.persendiskon as string) || "0")) / 100;
//             const updateValidate = updateApSchema.parse({
//                 ...data,
//                 tanggal: formatDate(data.tanggal),
//                 tanggal_jatuh_tempo: formatDate(data.tanggal_jatuh_tempo as string),
//                 tanggal_pengiriman: tanggal_penerimaan,
//                 total: ToString(SubTotal),
//                 dpp: ToString(dpp),
//                 total_pajak: ToString(TotalPajak),
//                 grandtotal: ToString(dpp - TotalPajak),
//                 updated_at: undefined,
//             });

//             await updateAp(data.id, updateValidate, tx);

//             const dataDetail = await createApDetail(validateDetail, tx);
//             const dataApPenerimaanBarang = await createApPenerimaanBarang(validateApPenerimaanBarang, tx);

//             return { ...data, detail: dataDetail, penerimaan_ap: dataApPenerimaanBarang };
//         });
//         res.status(200).json({
//             message: "Success create ap",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const storeWithPurchaseOrder = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             // Bedah data
//             const purchase_order = req.body.purchase_order;

//             const dataPurchaseOrder = await getPurchaseOrderById(purchase_order.id, tx);
//             const dataDetailPurchaseOrder = await getPurchaseOrderDetailById(purchase_order.id, false, tx);

//             const supplier = await getKontakById(dataPurchaseOrder.id_supplier, tx);

//             const tanggal = dayjs();
//             const tanggal_jatuh_tempo = tanggal.clone().add(supplier.top, "days");

//             // Nomor AP
//             const nomorFix = await nomorAp(formatDate(tanggal.toDate()), tx);

//             const validate: NewAp = insertApSchema.parse({
//                 nomor: nomorFix,
//                 id_supplier: dataPurchaseOrder.id_supplier,
//                 id_gudang: dataPurchaseOrder.id_gudang,
//                 id_po: dataPurchaseOrder.id,
//                 tanggal: formatDate(tanggal.toDate()),
//                 tanggal_jatuh_tempo: formatDate(tanggal_jatuh_tempo.toDate()),
//                 status: "D",
//                 keterangan: `Faktu Pembelian ${supplier.kontak}`,
//                 top: supplier.top,
//                 id_top: supplier.id_top,
//                 tanggal_referensi: null,
//                 tanggal_pengiriman: null,
//                 total_discount: null,
//                 total_pajak: null,
//                 total: dataPurchaseOrder.total,
//                 persendiskon: dataPurchaseOrder.persendiskon,
//                 grandtotal: dataPurchaseOrder.grandtotal,
//                 biaya_transportasi: "0",
//                 biaya_asuransi: "0",
//                 biaya_bongkar_muat: "0",
//                 biaya_bongkar_muat_external: "0",
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });

//             // Buat AP
//             const data = await createAp(validate, tx);
//             // Validasi AP Detail
//             const validateDetail = dataDetailPurchaseOrder.map((item: PurchaseOrderDetail, index: number) =>
//                 insertApDetailSchema.parse({
//                     ...item,
//                     id: data.id,
//                     urut: index + 1,
//                     id_po: item.id,
//                     urut_po: item.urut,
//                     qty: ToString(item.qty),
//                     total: ToString(item.total),
//                     diskonpersen: ToString(item.diskonpersen),
//                     diskonrp: ToString(item.diskonrp),
//                     harga: ToString(item.harga),
//                 }),
//             );

//             const dataDetail = await createApDetail(validateDetail, tx);

//             return { ...data, detail: dataDetail };
//         });
//         res.status(200).json({
//             message: "Success create ap",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             // Bedah data
//             const { jurnal, penerimaan_barang, detail, ...rest } = req.body;

            
//             // check persetujuan ap
//             const [dataApPersetujuan] = await getApPersetujuan(id, tx);
//             if (dataApPersetujuan?.tanggal_persetujuan != null) {
//                 throw ValidationError("AP Sudah ada Persetujuan");
//             }

//             // Validasi AP
//             const validate = updateApSchema.parse({
//                 ...rest,
//                 tanggal: formatDate(rest.tanggal),
//                 tanggal_jatuh_tempo: formatDate(rest.tanggal_jatuh_tempo),
//                 tanggal_referensi: rest.tanggal_referensi ? formatDate(rest.tanggal_referensi) : null,
//                 tanggal_pengiriman: rest.tanggal_pengiriman ? formatDate(rest.tanggal_pengiriman) : null,
//                 total_discount: ToString(rest.total_discount),
//                 total_pajak: ToString(rest.total_pajak),
//                 total: ToString(rest.total),
//                 persendiskon: ToString(rest.persendiskon),
//                 grandtotal: ToString(rest.grandtotal),
//                 updated_by: req.user?.id,
//             });

//             const data = await updateAp(id, validate, tx);

//             let dataDetail: ApDetail[] = [];
//             let dataApPenerimaanBarang: ApPenerimaanBarang[] = [];

//             if (penerimaan_barang?.length) {
//                 const dataApDetail = await getApDetailById(data.id, tx);
//                 const validateDetail = dataApDetail.map((item: NewApDetail) => {
//                     const newData = detail.find((form: NewApDetail) => form.nama_barang == item.nama_barang);
//                     return insertApDetailSchema.parse({
//                         ...item,
//                         harga: ToString(newData.harga),
//                         diskonpersen: ToString(newData.diskonpersen),
//                         diskonrp: ToString(newData.diskonrp),
//                         total: ToString(newData.total),
//                     });
//                 });
//                 await deleteApDetail(id, tx);
//                 dataDetail = await createApDetail(validateDetail, tx);
//                 const validateApPenerimaanBarang = penerimaan_barang.map((item: NewApDetail) => {
//                     return insertApPenerimaanBarangSchema.parse({
//                         id_ap: data.id,
//                         id_penerimaan_barang: item.id,
//                     });
//                 });
//                 await deleteApPenerimaanBarang(data.id, tx);
//                 dataApPenerimaanBarang = await createApPenerimaanBarang(validateApPenerimaanBarang, tx);
//             } else {
//                 // Validasi AP Detail
//                 const validateDetail = detail.map((item: ApDetail, index: number) =>
//                     insertApDetailSchema.parse({
//                         ...item,
//                         id: data.id,
//                         urut: index + 1,
//                         qty: ToString(item.qty),
//                         diskonpersen: ToString(item.diskonpersen),
//                         diskonrp: ToString(item.diskonrp),
//                         total: ToString(item.total),
//                         harga: ToString(item.harga),
//                     }),
//                 );
//                 const isAccount: boolean = validate.status != "D" ? validateDetail.some((obj: ApDetail) => (obj.id_account as number) != null) : true;
//                 if (!isAccount) {
//                     throw ValidationError("Error, Akun wajib diisi");
//                 }
//                 await deleteApDetail(id, tx);
//                 dataDetail = await createApDetail(
//                     validateDetail.filter((val: ApDetail) => parseInt(val.qty as string) > 0),
//                     tx,
//                 );
//                 if (data.status == "O") {
//                     await updateStatusApOpen(data, dataDetail, tx);
//                 }
//             }
//             if (data.status == "S") {
//                 await deleteApPersetujuan(id, tx);
//                 const lPersetujuan = await createApPersetujuanBySetting(id, req.user!.id, tx);
//                 // Add acc ap faktur
//                 const validateAccApFaktur = insertAccApFakturSchema.parse({
//                     ap_number: data.nomor,
//                     invoice_date: formatDate(data.tanggal_referensi as string),
//                     invoice_number: data.referensi as string,
//                     date: formatDate(data.tanggal),
//                     due_date: formatDate(data.tanggal_jatuh_tempo),
//                     id_supplier: data.id_supplier,
//                     id_top: data.id_top,
//                     pay: "0",
//                     amount: ToString(data.grandtotal) as string,
//                     top: data.top,
//                 });
//                 // hapus acc_ar_faktur
//                 await deleteAccApFaktur(data.nomor, tx);
//                 await createAccApFaktur(validateAccApFaktur, tx);
//                 // hapus jurnal
//                 await deleteAccGlTrans(data.nomor, tx);
//                 await createJurnal(data, jurnal, tx);
//                 return { ...data, detail: dataDetail, persetujuan: lPersetujuan, penerimaan_barang: dataApPenerimaanBarang };
                
//             }

//             if (data.status == "O") {
//                 // Add acc ap faktur
//                 const validateAccApFaktur = insertAccApFakturSchema.parse({
//                     ap_number: data.nomor,
//                     invoice_date: formatDate(data.tanggal_referensi as string),
//                     invoice_number: data.referensi as string,
//                     date: formatDate(data.tanggal),
//                     due_date: formatDate(data.tanggal_jatuh_tempo),
//                     id_supplier: data.id_supplier,
//                     id_top: data.id_top,
//                     pay: "0",
//                     amount: ToString(data.grandtotal) as string,
//                     top: data.top,
//                 });
//                 // hapus acc_ar_faktur
//                 await deleteAccApFaktur(data.nomor, tx);
//                 await createAccApFaktur(validateAccApFaktur, tx);
//                 // hapus jurnal
//                 await deleteAccGlTrans(data.nomor, tx);
//                 await createJurnal(data, jurnal, tx);
//             }
            
//             return { ...data, detail: dataDetail, persetujuan: [], penerimaan_barang: dataApPenerimaanBarang };
//         });
//         res.status(200).json({
//             message: "Success update ap",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             const check = await getApById(id, tx);
//             if (check.status === "C") {
//                 throw ValidationError("Data tidak dapat dihapus karena sudah diacc");
//             }

//             // check persetujuan purchase_request
//             const [dataApPersetujuan] = await getApPersetujuan(id, tx);
//             if (dataApPersetujuan?.tanggal_persetujuan != null) {
//                 throw ValidationError("AP Sudah ada Persetujuan");
//             }
//             await deleteApPersetujuan(id, tx);
//             await deleteApPenerimaanBarang(id, tx);
//             const data = await deleteAp(id, tx);

//             // hapus acc_ar_faktur
//             await deleteAccApFaktur(data.nomor, tx);
//             // hapus jurnal
//             await deleteAccGlTrans(data.nomor, tx);
//         });
//         res.status(200).json({
//             message: "Success delete ap",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const journalCetak = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);

//         const dataPaymentAp = await getApById(id);
//         const data = await getAccGlTransByReference(dataPaymentAp.nomor);
//         res.status(200).json({
//             message: "Success get journal voucher",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexBySupplierDetail = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getApDetailBySupplier(parseInt(req.params.supplier));
//         res.status(200).json({
//             message: "Success get ap detail",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexFaktur = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id_kontak, status } = req.query;
//         const data = await getAccApFaktur({ id_kontak: parseInt(id_kontak as string) });
//         res.status(200).json({
//             message: "Success Get Acc Ap Faktur",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexByJatuhTempoFaktur = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAccApFakturByDate(req.params.tanggal);
//         res.status(200).json({
//             message: "Success Get Acc Ap Faktur By Tanggal",
//             data: data,
//             tanggal: req.params.tanggal,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexBySupplierFaktur = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAccApFakturBySupplier(parseInt(req.params.supplier));
//         res.status(200).json({
//             message: "Success Get Acc Ap Faktur By Supplier",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const umurInvoiceAp = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getUmurInvoiceAp();
//         res.status(200).json({
//             message: "Success Umur Invoice Ap",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const showLaporanAp = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getLaporanAp();
//         res.status(200).json({
//             message: "Success Get Laporan AP",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
