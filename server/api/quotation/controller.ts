// import { eq } from "drizzle-orm";
// import { NextFunction, Response } from "express";
// import * as dayjs from 'dayjs'


// import { MyRequest } from "../../middleware/authMiddleware";
// import { COMPANY_ID, generateHTMLContent, generatePDF, injectStylesAndScripts, sendPDFResponse, setupPuppeteer } from "../cetakan/service";
// import { getInternalPerusahaanById } from "../internal-perusahaan/service";
// import { sales_order } from "../sales_order/schema";
// import { insertQuotationDetailSchema, NewQuotationDetail, QuotationDetail } from "./detail/schema";
// import { createQuotationDetail, deleteQuotationDetail, getQuotationDetailById, updateQuotationDetail } from "./detail/service";
// import { deleteQuotationPersetujuan, getQuotationPersetujuan } from "./persetujuan/service";
// import { insertQuotationSchema, NewQuotation, updateQuotationSchema } from "./schema";
// import {
//     createQuotation,
//     createQuotationPersetujuanBySetting,
//     deleteQuotation,
//     getDataOptionForSalesOrder,
//     getOptionQuotation,
//     getQuotation,
//     getQuotationById,
//     nomorQuotation,
//     updateQuotation,
// } from "./service";
// import { io } from "../../plugin/socket.io";

// export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const type = req.query.type;
//         if (type == "option") {
//             const option = req.query.option;
//             const data = await getOptionQuotation(option);
//             return res.status(200).json({
//                 message: "Success Get Pr",
//                 data: data,
//             });
//         }
//         const data = await getQuotation(req.query);
//         return res.status(200).json({
//             message: "Success Get Quotation",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
// //     try {
// //         const data = await getOptionQuotation(req.query);
// //         return res.status(200).json({
// //             message: "Success Get Quotation",
// //             data: data,
// //         });
// //     } catch (error) {
// //         next(error);
// //     }
// // };

// export const getOptionForSalesOrder = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getDataOptionForSalesOrder();
//         return res.status(200).json({
//             message: "Success Get Quotation",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             const data = await getQuotationById(id, tx);
//             const dataDetail = await getQuotationDetailById(id, tx);
//             const dataPersetujuan = await getQuotationPersetujuan(id, tx);

//             return { ...data, detail: dataDetail, persetujuan: dataPersetujuan };
//         });
//         return res.status(200).json({
//             message: "Success Get Quotation",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             // bedah data
//             const { id, detail, ...rest } = req.body;

//             // generate nomor quotation
//             const nomorFix = await nomorQuotation(rest.tanggal, tx);

//             // validasi quotation
//             const validate: NewQuotation = insertQuotationSchema.parse({
//                 ...rest,
//                 nomor: nomorFix,
//                 tanggal: formatDate(rest.tanggal),
//                 total: rest.total.toString(),
//                 dpp: rest.dpp.toString(),
//                 total_discount: rest.total_discount.toString(),
//                 diskonpersen: rest.diskonpersen.toString(),
//                 grandtotal: rest.grandtotal.toString(),
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });

//             const today = dayjs();
//             if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today)) {
//                 throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
//             }

//             const data = await createQuotation(validate, tx);

//             const validateDetail = detail.map((item: NewQuotationDetail, index: number) =>
//                 insertQuotationDetailSchema.parse({
//                     ...item,
//                     id: data.id,
//                     urut: index + 1,
//                     qty: ToString(item.qty),
//                     harga: ToString(item.harga),
//                     diskonrp: ToString(item.diskonrp),
//                     diskonpersen: ToString(item.diskonpersen),
//                     total: ToString(item.total),
//                 }),
//             );

//             const dataDetail = await createQuotationDetail(validateDetail, tx);

//             if (data.status === "S") {
//                 const lPersetujuan = await createQuotationPersetujuanBySetting(data.id, req.user!.id, tx);

//                 io.emit('update-persetujuan-quotation');

//                 return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
//             }

//             return { ...data, detail: dataDetail };
//         });
//         return res.status(200).json({
//             message: "Success Create Quotation",
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
//             const { detail, ...rest } = req.body;

//             // check persetujuan
//             const [dataQuotationPersetujuan] = await getQuotationPersetujuan(id, tx);
//             if (dataQuotationPersetujuan?.tanggal_persetujuan != null) {
//                 throw ValidationError("Quotation Sudah ada Persetujuan");
//             }

//             const [dataSalesOrder] = await tx.select().from(sales_order).where(eq(sales_order.id_quotation, id));

//             if (dataSalesOrder) {
//                 throw ValidationError("Quotation tidak boleh dihapus karena sudah digunakan");
//             }

//             // validasi quotation
//             const validate = updateQuotationSchema.parse({
//                 ...rest,
//                 tanggal: formatDate(rest.tanggal),
//                 total: rest.total.toString(),
//                 dpp: rest.dpp.toString(),
//                 total_discount: rest.total_discount.toString(),
//                 diskonpersen: rest.diskonpersen.toString(),
//                 grandtotal: rest.grandtotal.toString(),
//                 updated_by: req.user?.id,
//             });

//             const today = dayjs();
//             if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today)) {
//                 throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
//             }

//             const data = await updateQuotation(id, validate, tx);

//             // validasi quotation detail
//             const validateDetail = detail.map((item: QuotationDetail, index: number) =>
//                 insertQuotationDetailSchema.parse({
//                     ...item,
//                     id: data.id,
//                     urut: index + 1,
//                     qty: ToString(item.qty),
//                     harga: ToString(item.harga),
//                     diskonrp: ToString(item.diskonrp),
//                     diskonpersen: ToString(item.diskonpersen),
//                     total: ToString(item.total),
//                 }),
//             );

//             const dataDetail = await updateQuotationDetail(id, validateDetail, tx);

//             if (data.status === "S") {
//                 await deleteQuotationPersetujuan(id, tx);
//                 const lPersetujuan = await createQuotationPersetujuanBySetting(id, req.user!.id, tx);

//                 io.emit('update-persetujuan-quotation');

//                 return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
//             }

//             return { ...data, detail: dataDetail, persetujuan: [] };
//         });
//         return res.status(200).json({
//             message: "Success Update Quotation",
//             data: data,
//         });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             const dataQuotation = await getQuotationById(id, tx);
//             if (dataQuotation.status == 'C') {
//                 throw ValidationError("Quotation tidak dapat dihapus, Status CLOSED");
//             }
//             // check persetujuan
//             const [dataQuotationPersetujuan] = await getQuotationPersetujuan(id, tx);
//             if (dataQuotationPersetujuan?.tanggal_persetujuan != null) {
//                 throw ValidationError("Quotation Sudah ada Persetujuan");
//             }

//             const dataPersetujuan = await deleteQuotationPersetujuan(id, tx);
//             const dataDetail = await deleteQuotationDetail(id, tx);
//             const data = await deleteQuotation(id, tx);

//             io.emit('update-persetujuan-quotation');

//             return { ...data, detail: dataDetail, persetujuan: dataPersetujuan };
//         });
//         return res.status(200).json({
//             message: "Success Delete Quotation",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const cetak = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         // Get Data
//         const quotationId: number = parseInt(req.params.id, 10);
//         const data = await getQuotationById(quotationId);
//         const dataDetail = await getQuotationDetailById(quotationId);

//         const perusahaan = await getInternalPerusahaanById(COMPANY_ID);

//         // Generate PDF
//         const module = "quotation";

//         const { browser, page, template } = await setupPuppeteer();

//         const { templateContent, htmlContent } = generateHTMLContent({ ...data, detail: dataDetail }, perusahaan, module, template);

//         await injectStylesAndScripts(page, htmlContent);

//         const pdfBuffer = await generatePDF(page);

//         sendPDFResponse(res, pdfBuffer);

//         await browser.close();
//     } catch (error) {
//         next(error);
//     }
// };

// // TODO: mboh ra roh
// // export const postRevisi = async (req: MyRequest, res: Response, next: NextFunction) => {
// //     const { id } = req.params;
// //     try {
// //         const quotation = (await getQuotationById(parseInt(id))) as any;

// //         const newQuotation: NewQuotation = {
// //             nomor: quotation.nomor,
// //             total_discount: quotation.total_discount.toString(),
// //             diskonpersen: quotation.diskonpersen.toString(),
// //             top: quotation.top,
// //             total: quotation.total.toString(),
// //             dpp: quotation.dpp.toString(),
// //             grandtotal: quotation.grandtotal.toString(),
// //             tanggal: quotation.tanggal,
// //             keterangan: quotation.keterangan,
// //             id_customer: quotation.id_customer,
// //             id_gudang: quotation.id_gudang,
// //             kepada: quotation.kepada,
// //             telepon: quotation.telepon,
// //             hp: quotation.hp,
// //             email: quotation.email,
// //             id_salesman: quotation.id_salesman,
// //             status: quotation.status,
// //             created_by: req.user?.id,
// //             created_date: new Date().toISOString(),
// //         };

// //         let lNewDetail = new Array<NewQuotationDetail>();
// //         for (let i = 0; i < quotation.detail.length; i++) {
// //             const e = quotation.detail[i];
// //             let newDetail: NewQuotationDetail = {
// //                 id: 0,
// //                 total: e.total.toString(),
// //                 qty: e.qty.toString(),
// //                 harga: e.harga.toString(),
// //                 urut: i,
// //                 nama_barang: e.nama_barang,
// //                 id_barang: e.id_barang,
// //                 id_satuan: e.id_satuan,
// //                 id_pajak: e.id_pajak,
// //                 diskonrp: (e.diskonrp || 0).toString(),
// //                 diskonpersen: (e.diskonpersen || 0).toString(),
// //                 persen_pajak: e.persen_pajak,
// //                 note: e.note,
// //             };

// //             lNewDetail.push(newDetail);
// //         }

// //         console.log(newQuotation);

// //         const data = await revisiQuotation(parseInt(id));
// //         return res.status(200).json({
// //             message: "Success Delete Quotation",
// //             data: data,
// //         });
// //     } catch (error) {
// //         next(error);
// //     }
// // };
