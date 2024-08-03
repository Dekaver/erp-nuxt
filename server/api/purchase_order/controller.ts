// import { eq, getTableColumns } from "drizzle-orm";
// import { NextFunction, Request, Response } from "express";

// import { io } from "../../plugin/socket.io";

// import { MyRequest } from "../../middleware/authMiddleware";
// import { COMPANY_ID, generateHTMLContent, generatePDF, injectStylesAndScripts, sendPDFResponse, setupPuppeteer } from "../cetakan/service";
// import { getInternalPerusahaanById } from "../internal-perusahaan/service";
// import { jabatan } from "../jabatan/schema";
// import { getKontakById } from "../kontak/service";
// import { sendNotificationToUser } from "../notification/socket";
// import { NilaiPajak } from "../pajak/schema";
// import { pegawai } from "../pegawai/schema";
// import { penerimaan_barang } from "../penerimaan_barang/schema";
// import { NewPurchaseRequestDetail } from "../purchase_request/detail/schema";
// import { insertPurchaseOrderDetailSchema, NewPurchaseOrderDetail, PurchaseOrderDetail } from "./detail/schema";
// import { createPurchaseOrderDetail, deletePurchaseOrderDetail, getPurchaseOrderDetailById, updatePurchaseOrderDetail } from "./detail/service";
// import { purchase_order_persetujuan } from "./persetujuan/schema";
// import { deletePurchaseOrderPersetujuan, getPurchaseOrderPersetujuan } from "./persetujuan/service";
// import { insertPurchaseOrderSchema, NewPurchaseOrder, purchase_order, updatePurchaseOrderSchema } from "./schema";
// import {
//     createPurchaseOrder,
//     createPurchaseOrderPersetujuanBySetting,
//     deletePurchaseOrder,
//     getBarangTracking,
//     getOutstandingPO,
//     getPurchaseOrder,
//     getPurchaseOrderById,
//     getPurchaseOrderOption,
//     getPurchaseOrderOptionUangMuka,
//     nomorPurchaseOrder,
//     updatePurchaseOrder,
// } from "./service";
// import { updateDiorderPurchaseRequestDetail } from "../purchase_request/detail/service";

// const columnPersetujuan = getTableColumns(purchase_order_persetujuan);

// export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const type = req.query.type;
//         const module = req.query.module;
//         if (type === "option") {
//             const data = await getPurchaseOrderOption(module as string);
//             res.status(200).json({
//                 message: "Success Get PurchaseOrder",
//                 data: data,
//             });
//             return;
//         }
//         const data = await getPurchaseOrder(req.user!.id);
//         res.status(200).json({
//             message: "Success Get PurchaseOrder",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const { with_pb } = req.query;
//         const data = await db.transaction(async (tx) => {
//             const data = await getPurchaseOrderById(id, tx);
//             const dataDetail = await getPurchaseOrderDetailById(id, with_pb === "true", tx);
//             const PB = dataDetail.some((item) => item.with_pb === true);
//             const dataPersetujuan = await tx
//                 .select({
//                     ...columnPersetujuan,
//                     nama: pegawai.nama,
//                     jabatan: jabatan.jabatan,
//                     ttd: pegawai.ttd,
//                 })
//                 .from(purchase_order_persetujuan)
//                 .innerJoin(pegawai, eq(pegawai.id, purchase_order_persetujuan.id_pegawai))
//                 .innerJoin(jabatan, eq(jabatan.id, purchase_order_persetujuan.id_jabatan))
//                 .where(eq(purchase_order_persetujuan.id, id))
//                 .orderBy(purchase_order_persetujuan.urut);
//             return { ...data, detail: dataDetail, PB, persetujuan: dataPersetujuan };
//         });

//         res.status(200).json({
//             message: "Success Get PO By ID",
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

//             // generate nomor purchase_order
//             const nomorFix = await nomorPurchaseOrder(formatDate(rest.tanggal), tx);

//             // validasi purchase_order
//             const validate: NewPurchaseOrder = insertPurchaseOrderSchema.parse({
//                 ...rest,
//                 tanggal: formatDate(rest.tanggal),
//                 tanggal_referensi: formatDate(rest.tanggal_referensi),
//                 nomor: nomorFix,
//                 total: ToString(rest.total),
//                 total_discount: ToString(rest.total_discount),
//                 dpp: ToString(rest.dpp),
//                 grandtotal: ToString(rest.grandtotal),
//                 persendiskon: ToString(rest.persendiskon),
//                 total_ppn: ToString(rest.total_ppn),
//                 total_pph: ToString(rest.total_pph),
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });

//             const today = dayjs();
//             if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today) || dayjs(validate.tanggal_referensi, "YYYY-MM-DD").isAfter(today)) {
//                 throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
//             }

//             //validasi barang & gudang
//             const checkTrackingStok = async () => {
//                 if (validate.id_gudang == null) {
//                     const results = await Promise.all(
//                         detail.map(async (obj: NewPurchaseOrderDetail) => {
//                             return obj.id_barang != null && obj.id_barang != undefined ? await getBarangTracking(obj.id_barang, tx) : true;
//                         }),
//                     );
//                     return !results.some((result) => !result);
//                 }
//                 return true;
//             };
//             const isTrackingStok = await checkTrackingStok();
//             if (!isTrackingStok) {
//                 throw ValidationError("Error, gudang harus dipilih!");
//             }

//             // create purchase_order
//             const data = await createPurchaseOrder(validate, tx);

//             // validasi jumlah barang
//             const isQtyGreaterThanZero: boolean = validate.status == "D" ? true : detail.some((obj: NewPurchaseOrderDetail) => parseFloat(obj.qty as string) > 0);
//             if (!isQtyGreaterThanZero) {
//                 throw ValidationError("Error, jumlah barang harus lebih dari 0");
//             }

//             // validasi purchase_order detail
//             const validateDetail = detail.map((item: NewPurchaseOrderDetail, index: number) => {
//                 return insertPurchaseOrderDetailSchema.parse({
//                     ...item,
//                     id: data.id,
//                     urut: index + 1,
//                     qty: ToString(item.qty),
//                     harga: ToString(item.harga),
//                     total: ToString(item.total),
//                     persen_pajak: ToString(item.persen_pajak),
//                     diambil: ToString(item.diambil) || "0",
//                     sisa: ToString(item.qty),
//                     invoice: ToString(item.invoice) || "0",
//                     diskonpersen: ToString(item.diskonpersen),
//                     diskonrp: ToString(item.diskonrp),
//                 });
//             });

//             // create purchase_order detail
//             const dataDetail = await createPurchaseOrderDetail(validateDetail, tx);

//             // persetujuan
//             if (validate.status == "S") {
//                 const lPersetujuan = await createPurchaseOrderPersetujuanBySetting(data.id, req.user!.id, tx);

//                 io.emit('update-persetujuan-purchase-order');

//                 return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
//             }

//             return { ...data, detail: dataDetail };
//         });

//         return res.status(200).json({
//             message: "Success Create PurchaseOrder",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const storeWithPurchaseRequest = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             // bedah data
//             const { id_supplier, purchase_request_detail } = req.body;

//             const supplier = await getKontakById(id_supplier, tx);

//             const tanggal = dayjs().tz("Asia/Makassar").toDate();
//             // generate nomor purchase_order
//             const nomorFix = await nomorPurchaseOrder(formatDate(tanggal), tx);

//             const validate: NewPurchaseOrder = insertPurchaseOrderSchema.parse({
//                 id_supplier: supplier.id,
//                 tanggal: formatDate(tanggal),
//                 email: supplier.email,
//                 hp: supplier.hp,
//                 nomor: nomorFix,
//                 top: supplier.top,
//                 id_top: supplier.id_top,
//                 alamat_kirim: supplier.alamat_kirim,
//                 keterangan: `Pesanan Pembelian Kepada ${supplier.kontak}`,
//                 status: "D",
//                 dpp: "0",
//                 grandtotal: "0",
//                 persendiskon: "0",
//                 created_by: req.user?.id,
//                 updated_by: req.user?.id,
//             });

//             const data = await createPurchaseOrder(validate, tx);

//             let TotalPajak = 0;
//             let SubTotal = 0;

//             // let total: number = 0;
//             const validateDetail: NewPurchaseOrderDetail[] = await Promise.all(
//                 purchase_request_detail.map(async (detail: NewPurchaseRequestDetail, index: number) => {
//                     const total = (parseFloat(detail?.harga as string) - parseFloat((detail?.diskonrp as string) || "0")) * parseFloat(detail.qty);
//                     // total += parseFloat(detail.total);
//                     const pajak = detail.persen_pajak
//                         ?.split(",")
//                         .reduce((a, b) => a + (((parseFloat(detail.harga as string) - parseFloat((detail.diskonrp as string) || "0")) * parseFloat(b)) / 100) * parseFloat(detail.qty), 0);
//                     TotalPajak += pajak || 0;
//                     SubTotal += total;
//                     // TODO: kenapa ku update ya
//                     // await updateDiorderPurchaseRequestDetail(detail.id, detail.urut, detail.qty, tx);
//                     return insertPurchaseOrderDetailSchema.parse({
//                         ...detail,
//                         id: data.id,
//                         urut: index + 1,
//                         id_pr: detail.id,
//                         urut_pr: detail.urut,
//                         diambil: "0",
//                         sisa: ToString(detail.qty),
//                         qty: ToString(detail.qty),
//                         total: ToString(total),
//                         invoice: "0",
//                     });
//                 }),
//             );

//             const dpp = SubTotal - (SubTotal * parseFloat((data.persendiskon as string) || "0")) / 100;
//             const updateValidate = updatePurchaseOrderSchema.parse({
//                 ...data,
//                 tanggal: formatDate(data.tanggal),
//                 total: ToString(SubTotal),
//                 dpp: ToString(dpp),
//                 total_pajak: ToString(TotalPajak),
//                 grandtotal: ToString(dpp - TotalPajak),
//                 updated_at: undefined,
//             });

//             await updatePurchaseOrder(data.id, updateValidate, tx);

//             const dataDetail = await createPurchaseOrderDetail(validateDetail, tx);

//             return { ...data, detail: dataDetail };
//         });

//         return res.status(200).json({
//             message: "Success Create PurchaseOrder",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const { detail, ...rest } = req.body;

//         const data = await db.transaction(async (tx) => {
//             const [dataPersetujuan] = await getPurchaseOrderPersetujuan(id, tx);
//             if (dataPersetujuan?.tanggal_persetujuan != null) {
//                 throw ValidationError("Purchase Order Sudah ada Persetujuan");
//             }

//             // check purchase_order
//             const [check] = await tx.select({ id: purchase_order.id, status: purchase_order.status }).from(purchase_order).where(eq(purchase_order.id, id));

//             if (check.status !== "D") {
//                 const checkPb = await tx
//                     .select({
//                         id_po: penerimaan_barang.id_po,
//                         status: penerimaan_barang.status,
//                     })
//                     .from(penerimaan_barang)
//                     .where(eq(penerimaan_barang.id_po, id));
//                 if (checkPb.length !== 0) {
//                     throw ValidationError("PO tidak dapat diubah karena sudah ada penerimaan barang");
//                 }
//             }

//             // TODO: notification
//             sendNotificationToUser(io, 2, { message: "testing" });

//             // validasi purchase_order
//             const validate = updatePurchaseOrderSchema.parse({
//                 ...rest,
//                 tanggal: formatDate(rest.tanggal),
//                 tanggal_referensi: formatDate(rest.tanggal_referensi),
//                 total: ToString(rest.total),
//                 total_discount: ToString(rest.total_discount),
//                 dpp: ToString(rest.dpp),
//                 grandtotal: ToString(rest.grandtotal),
//                 persendiskon: ToString(rest.persendiskon),
//                 total_ppn: ToString(rest.total_ppn),
//                 total_pph: ToString(rest.total_pph),
//                 pajak: rest.pajak as NilaiPajak[],
//                 updated_by: req.user?.id,
//             });

//             const today = dayjs();
//             if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today) || dayjs(validate.tanggal_referensi, "YYYY-MM-DD").isAfter(today)) {
//                 throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
//             }

//             const data = await updatePurchaseOrder(id, validate, tx);

//             if (!data) {
//                 throw ValidationError("Error, PO tidak ditemukan");
//             }

//             // validasi purchase_order detail
//             const validateDetail: NewPurchaseOrderDetail[] = detail.map((item: PurchaseOrderDetail, index: number) => {
//                 return insertPurchaseOrderDetailSchema.parse({
//                     ...item,
//                     id: id,
//                     urut: index + 1,
//                     id_pajak: item.id_pajak,
//                     qty: ToString(item.qty),
//                     harga: ToString(item.harga),
//                     total: ToString(item.total),
//                     persen_pajak: ToString(item.persen_pajak),
//                     diambil: ToString(item.diambil) || "0",
//                     sisa: ToString(item.qty),
//                     invoice: ToString(item.invoice) || "0",
//                     diskonpersen: ToString(item.diskonpersen),
//                     diskonrp: ToString(item.diskonrp),
//                 });
//             });

//             //validasi barang & gudang
//             const checkTrackingStok = async () => {
//                 if (validate.id_gudang == null) {
//                     const results = await Promise.all(
//                         detail.map(async (obj: NewPurchaseOrderDetail) => {
//                             return obj.id_barang != null && obj.id_barang != undefined ? await getBarangTracking(obj.id_barang, tx) : true;
//                         }),
//                     );
//                     return !results.some((result) => !result);
//                 }
//                 return true;
//             };
//             const isTrackingStok = await checkTrackingStok();
//             if (!isTrackingStok) {
//                 throw ValidationError("Error, gudang harus dipilih!");
//             }

//             // validasi jumlah barang
//             const isQtyGreaterThanZero: boolean = validate.status != "D" ? detail.some((obj: NewPurchaseOrderDetail) => parseFloat(obj.qty as string) > 0) : true;
//             if (!isQtyGreaterThanZero) {
//                 throw ValidationError("Error, jumlah barang harus lebih dari 0");
//             }

//             // Delete PO Detail yang lama dan insert yang baru
//             const dataDetail = await updatePurchaseOrderDetail(id, validateDetail, tx);

//             // persetujuan
//             if (validate.status == "S") {
//                 await deletePurchaseOrderPersetujuan(id, tx);
//                 const lPersetujuan = await createPurchaseOrderPersetujuanBySetting(id, req.user!.id, tx);

//                 io.emit('update-persetujuan-purchase-order');

//                 return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
//             }

//             if (validate.status == "O" && check.status == "D") {
//                 for (const detail of dataDetail) {
//                     if (detail.id_pr != null && detail.urut_pr != null) {
//                         await updateDiorderPurchaseRequestDetail(detail.id_pr, detail.urut_pr, detail.qty, tx);
//                     }
//                 }
//             }

//             return { ...data, detail: dataDetail };
//         });
//         res.status(200).json({
//             message: "Success Update PurchaseOrder",
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
//             const [check] = await tx.select({ id: purchase_order.id, status: purchase_order.status }).from(purchase_order).where(eq(purchase_order.id, id));
//             if (check.status == "P" || check.status == "C") {
//                 throw ValidationError("PO tidak dapat dihapus karena sudah ada transaksi");
//             } else {
//                 const checkPb = await tx
//                     .select({
//                         id_po: penerimaan_barang.id_po,
//                         status: penerimaan_barang.status,
//                     })
//                     .from(penerimaan_barang)
//                     .where(eq(penerimaan_barang.id_po, id));
//                 if (checkPb.length !== 0) {
//                     throw ValidationError("PO tidak dapat dihapus karena dipakai di draft penerimaan barang");
//                 }
//             }

//             const [dataPersetujuan] = await getPurchaseOrderPersetujuan(id, tx);
//             if (dataPersetujuan?.tanggal_persetujuan != null) {
//                 throw ValidationError("Purchase Order telah disetujui");
//             }

//             const dataDetail = await deletePurchaseOrderDetail(id, tx);
//             await deletePurchaseOrderPersetujuan(id, tx);
//             if(check.status != 'D'){
//                 for (const detail of dataDetail) {
//                     if (detail.id_pr != null && detail.urut_pr != null) {
//                         await updateDiorderPurchaseRequestDetail(detail.id_pr, detail.urut_pr, (parseFloat(detail.qty) * -1).toString(), tx);
//                     }
//                 }
//             }
//             await deletePurchaseOrder(id, tx);

//             io.emit('update-persetujuan-purchase-order');

//             return { id: id };
//         });
//         res.status(200).json({
//             message: "Success Delete PurchaseOrder",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const option = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { transaction } = req.query;

//         // const statusArray = status ? (status as string).split(",") : [];

//         const data = await getPurchaseOrderOption(transaction as string);
//         res.status(200).json({
//             message: "Success Get Option PO",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const optionUangMuka = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getPurchaseOrderOptionUangMuka();
//         res.status(200).json({
//             message: "Success Get Option PO",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const outstandingPO = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getOutstandingPO();
//         res.status(200).json({
//             message: "Success Outstanding PO",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const cetak = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Get Data
//         const poId: number = parseInt(req.params.id, 10);
//         const data = await getPurchaseOrderById(poId);
//         const dataDetail = await getPurchaseOrderDetailById(poId, false);

//         const perusahaan = await getInternalPerusahaanById(COMPANY_ID);

//         // Generate PDF
//         const module = "purchase-order";

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
