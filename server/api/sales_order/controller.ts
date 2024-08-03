// import { NextFunction, Request, Response } from "express";
// import * as dayjs from 'dayjs'


// import { MyRequest } from "../../middleware/authMiddleware";
// import { getKontakById } from "../kontak/service";
// import { getQuotationById } from "../quotation/service";
// import {
//     createSalesOrder,
//     createSalesOrderPersetujuanBySetting,
//     deleteSalesOrder,
//     getLaporanMonitoringSalesOrder,
//     getOptionSalesOrder,
//     getOutstandingSalesOrder,
//     getSalesOrder,
//     getSalesOrderById,
//     nomorSalesOrder,
//     updateSalesOrder,
// } from "../sales_order/service";
// import { insertSalesOrderDetailSchema, NewSalesOrderDetail } from "./detail/schema";
// import { createSalesOrderDetail, deleteSalesOrderDetail, getSalesOrderDetailById, updateSalesOrderDetail } from "./detail/service";
// import { deleteSalesOrderPersetujuan, getSalesOrderPersetujuan } from "./persetujuan/service";
// import { insertSalesOrderSchema, NewSalesOrder, updateSalesOrderSchema } from "./schema";
// import { getQuotationDetailById } from "../quotation/detail/service";
// import { io } from "../../plugin/socket.io";

// export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const type = req.query.type;

//         const module = req.query.module;
//         if (type == "option") {
//             const data = await getOptionSalesOrder(module as string);
//             return res.status(200).json({
//                 message: "Success Get Option SalesOrder",
//                 data: data,
//             });
//         }
//         const data = await getSalesOrder(req.query);
//         return res.status(200).json({
//             message: "Success Get Option SalesOrder",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
// //     try {
// //         const data = await getOptionSalesOrder(req.query);
// //         return res.status(200).json({
// //             message: "Success Get SalesOrder",
// //             data: data,
// //         });
// //     } catch (error) {
// //         next(error);
// //     }
// // };

// export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             const data = await getSalesOrderById(id, tx);
//             const dataDetail = await getSalesOrderDetailById(id, tx);
//             const dataPersetujuan = await getSalesOrderPersetujuan(id, tx);
//             return { ...data, detail: dataDetail, persetujuan: dataPersetujuan };
//         });
//         return res.status(200).json({
//             message: "Success Get SalesOrder",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             const { id, detail, ...rest } = req.body;

//             const nomorFix = await nomorSalesOrder(formatDate(rest.tanggal), tx);

//             const validate = insertSalesOrderSchema.parse({
//                 ...rest,
//                 nomor: nomorFix,
//                 tanggal: formatDate(rest.tanggal),
//                 tanggal_referensi: formatDate(rest.tanggal_referensi),
//                 subtotal: ToString(rest.subtotal),
//                 total_discount: ToString(rest.total_discount),
//                 dpp: ToString(rest.dpp),
//                 grandtotal: ToString(rest.grandtotal),
//                 diskonpersen: ToString(rest.diskonpersen),
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             }) as NewSalesOrder;

//             const today = dayjs();
//             if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today)) {
//                 throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
//             }

//             const data = await createSalesOrder(validate, tx);

//             const validateDetail = detail.map((item: NewSalesOrderDetail, index: number) =>
//                 insertSalesOrderDetailSchema.parse({
//                     ...item,
//                     id: data.id,
//                     urut: index + 1,
//                     harga: ToString(item.harga),
//                     total: ToString(item.total),
//                     diskonrp: ToString(item.diskonrp),
//                     diskonpersen: ToString(item.diskonpersen),
//                     qty: ToString(item.qty),
//                     diambil: ToString(0),
//                     sisa: ToString(item.qty),
//                 }),
//             );

//             const dataDetail = await createSalesOrderDetail(validateDetail, tx);

//             // persetujuan
//             if (validate.status == "S") {
//                 const lPersetujuan = await createSalesOrderPersetujuanBySetting(data.id, req.user!.id, tx);

//                 io.emit('update-persetujuan-sales-order')

//                 return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
//             }

//             return { ...data, detail: dataDetail, persetujuan: [] };
//         });

//         return res.status(200).json({
//             message: "Success Create SalesOrder",
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

//             const soData: any = await getSalesOrderById(parseInt(req.params.id), tx);
//             if (soData.status == "P" || soData.status == "C") {
//                 throw ValidationError("SalesOrder Telah di proses");
//             }

//             const [dataPersetujuan] = await getSalesOrderPersetujuan(id, tx);
//             if (dataPersetujuan?.tanggal_persetujuan != null) {
//                 throw ValidationError("Sales Order Sudah ada Persetujuan");
//             }

//             const validate = updateSalesOrderSchema.parse({
//                 ...rest,
//                 tanggal: dayjs(rest.tanggal).tz("Asia/Makassar").format("YYYY-MM-DD"),
//                 tanggal_referensi: formatDate(rest.tanggal_referensi),
//                 subtotal: ToString(rest.subtotal),
//                 total_discount: ToString(rest.total_discount),
//                 dpp: ToString(rest.dpp),
//                 grandtotal: ToString(rest.grandtotal),
//                 diskonpersen: ToString(rest.diskonpersen),
//                 updated_by: req.user?.id,
//             });
//             const today = dayjs();
//             if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today)) {
//                 throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
//             }

//             const data = await updateSalesOrder(id, validate, tx);

//             const validateDetail = detail.map((item: NewSalesOrderDetail, index: number) =>
//                 insertSalesOrderDetailSchema.parse({
//                     ...item,
//                     id: data.id,
//                     urut: index + 1,
//                     harga: ToString(item.harga),
//                     total: ToString(item.total),
//                     diskonrp: ToString(item.diskonrp),
//                     diskonpersen: ToString(item.diskonpersen),
//                     qty: ToString(item.qty),
//                     diambil: ToString(0),
//                     sisa: ToString(item.qty),
//                 }),
//             );

//             const dataDetail = await updateSalesOrderDetail(parseInt(req.params.id), validateDetail, tx);

//             // persetujuan
//             if (validate.status == "S") {
//                 await deleteSalesOrderPersetujuan(id, tx);
//                 const lPersetujuan = await createSalesOrderPersetujuanBySetting(id, req.user!.id, tx);

//                 io.emit('update-persetujuan-sales-order')
                
//                 return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
//             }

//             return { ...data, detail: dataDetail };
//         });
//         return res.status(200).json({
//             message: "Success Update SalesOrder",
//             data: data,
//         });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

// export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             const soData: any = await getSalesOrderById(id, tx);
//             if (soData.status == "P" || soData.status == "C") {
//                 throw ValidationError("SalesOrder Telah di proses");
//             }

//             const [dataPersetujuan] = await getSalesOrderPersetujuan(id, tx);
//             if (dataPersetujuan?.tanggal_persetujuan != null) {
//                 throw ValidationError("Sales Order Sudah ada Persetujuan");
//             }

//             await deleteSalesOrderPersetujuan(id, tx)
//             const dataDetail = await deleteSalesOrderDetail(id, tx);
//             const data = await deleteSalesOrder(id, tx);

//             return { ...data, detail: dataDetail };
//         });
//         return res.status(200).json({
//             message: "Success Delete SalesOrder",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const monitoringSalesOrder = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getLaporanMonitoringSalesOrder();
//         return res.status(200).json({
//             message: "Success Get Laporan AR",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const outstandingSalesOrder = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getOutstandingSalesOrder();
//         return res.status(200).json({
//             message: "Success Get Outstanding SO",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const storeWithQuotation = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             const { id, ...rest } = req.body;

//             const tanggal = dayjs();

//             const nomorFix = await nomorSalesOrder(tanggal.tz("Asia/Makassar").format("YYYY-MM-DD"), tx);

//             const dataQuotation = await getQuotationById(id, tx);
//             const dataQuotationDetail = await getQuotationDetailById(id, tx)

//             const dataSupplier = await getKontakById(rest.id_customer, tx);

//             const validate = insertSalesOrderSchema.parse({
//                 ...dataQuotation,
//                 id: undefined,
//                 status: "D",
//                 syarat: null,
//                 id_quotation: id,
//                 nomor: nomorFix,
//                 tanggal: tanggal.tz("Asia/Makassar").format("YYYY-MM-DD"),
//                 subtotal: ToString(dataQuotation.total),
//                 total_discount: ToString(dataQuotation.total_discount),
//                 dpp: ToString(dataQuotation.dpp),
//                 grandtotal: ToString(dataQuotation.grandtotal),
//                 deliverypoint: dataSupplier.alamat_kirim,
//                 diskonpersen: ToString(dataQuotation.diskonpersen),
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//                 created_at: undefined,
//                 updated_at: undefined,
//             });

//             const today = dayjs();
//             if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today)) {
//                 throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
//             }

//             const data = await createSalesOrder(validate, tx);

//             const validateDetail = dataQuotationDetail.map((item: any, index: number) =>
//                 insertSalesOrderDetailSchema.parse({
//                     ...item,
//                     id: data.id,
//                     keterangan: item.note,
//                     urut: index + 1,
//                     harga: ToString(item.harga),
//                     total: ToString(item.total),
//                     diskonrp: ToString(item.diskonrp),
//                     diskonpersen: ToString(item.diskonpersen),
//                     qty: ToString(item.qty),
//                     diambil: ToString(0),
//                     sisa: ToString(item.qty),
//                 }),
//             );

//             const dataDetail = await createSalesOrderDetail(validateDetail, tx);

//             return { ...data, detail: dataDetail };
//         });

//         return res.status(200).json({
//             message: "Success Create SalesOrder",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
