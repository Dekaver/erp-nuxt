import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";

import { formatDate, ToString } from "../../libs/formater";
import { MyRequest } from "../../middleware/authMiddleware";
import { COMPANY_ID, generateHTMLContent, generatePDF, injectStylesAndScripts, sendPDFResponse, setupPuppeteer } from "../cetakan/service";
import { getInternalPerusahaanById } from "../internal-perusahaan/service";
import { jabatan } from "../jabatan/schema";
import { NilaiPajak } from "../pajak/schema";
import { pegawai } from "../pegawai/schema";
import { penerimaan_barang } from "../penerimaan_barang/schema";
import { getPurchaseOrderDetailByIdPurchaseRequest } from "../purchase_order/detail/service";
import { insertPurchaseRequestDetailSchema, NewPurchaseRequestDetail, PurchaseRequestDetail } from "./detail/schema";
import { createPurchaseRequestDetail, deletePurchaseRequestDetail, getPurchaseRequestDetailById, updatePurchaseRequestDetail } from "./detail/service";
import { columnPersetujuan, purchase_request_persetujuan } from "./persetujuan/schema";
import { deletePurchaseRequestPersetujuan, getPurchaseRequestPersetujuan } from "./persetujuan/service";
import { insertPurchaseRequestSchema, NewPurchaseRequest, purchase_request, updatePurchaseRequestSchema } from "./schema";
import {
    createPurchaseRequest,
    createPurchaseRequestPersetujuanBySetting,
    deletePurchaseRequest,
    getDataAutoComplete,
    getOptionPurchaseRequest,
    getPurchaseRequest,
    getPurchaseRequestById,
    nomorPurchaseRequest,
    updatePurchaseRequest,
} from "./service";
import { io } from "../../app";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const type = req.query.type;
        if (type == "option") {
            const data = await getOptionPurchaseRequest("po");
            res.status(200).json({
                message: "Success Get PurchaseRequest",
                data: data,
            });
        }
        const data = await getPurchaseRequest(req.user!.id);
        res.status(200).json({
            message: "Success Get PurchaseRequest",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getAutoComplete = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getDataAutoComplete();
        res.status(200).json({
            message: "Success Get Purchase Request",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { with_pb } = req.query;
        const data = await db.transaction(async (tx) => {
            const data = await getPurchaseRequestById(parseInt(req.params.id), tx);
            const dataDetail = await getPurchaseRequestDetailById(parseInt(req.params.id), with_pb === "true", tx);
            const PB = dataDetail.some((item: any) => item.with_pb === true);

            const dataPersetujuan = await tx
                .select({
                    ...columnPersetujuan,
                    nama: pegawai.nama,
                    jabatan: jabatan.jabatan,
                    ttd: pegawai.ttd,
                })
                .from(purchase_request_persetujuan)
                .innerJoin(pegawai, eq(pegawai.id, purchase_request_persetujuan.id_pegawai))
                .innerJoin(jabatan, eq(jabatan.id, purchase_request_persetujuan.id_jabatan))
                .where(eq(purchase_request_persetujuan.id, parseInt(req.params.id)))
                .orderBy(purchase_request_persetujuan.urut);
            return { ...data, detail: dataDetail, PB, persetujuan: dataPersetujuan };
        });

        res.status(200).json({
            message: "Success Get PO By ID",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (tx) => {
            // bedah data
            const { id, detail, ...rest } = req.body;

            // generate nomor purchase_request
            const nomorFix = await nomorPurchaseRequest(formatDate(rest.tanggal), tx);

            // validasi purchase_request
            const validate: NewPurchaseRequest = insertPurchaseRequestSchema.parse({
                ...rest,
                tanggal: formatDate(rest.tanggal),
                tgl_dibutuhkan: formatDate(rest.tgl_dibutuhkan),
                nomor: nomorFix,
                total: ToString(rest.total),
                total_discount: ToString(rest.total_discount),
                dpp: ToString(rest.dpp),
                grandtotal: ToString(rest.grandtotal),
                persendiskon: ToString(rest.persendiskon),
                total_ppn: ToString(rest.total_ppn),
                total_pph: ToString(rest.total_pph),
                created_by: req.user?.id,
                updated_by: req.user?.id,
            });
            // create purchase_request
            const dataPurchaseRequest = await createPurchaseRequest(validate, tx);

            // validasi jumlah barang
            const isQtyGreaterThanZero: boolean = validate.status != "D" ? detail.some((obj: NewPurchaseRequestDetail) => parseFloat(obj.qty as string) > 0) : true;
            if (!isQtyGreaterThanZero) {
                throw ValidationError("Error, jumlah barang harus lebih dari 0");
            }

            // validasi purchase_request detail
            const validateDetail = detail.map((item: NewPurchaseRequestDetail, index: number) => {
                return insertPurchaseRequestDetailSchema.parse({
                    ...item,
                    id: dataPurchaseRequest.id,
                    urut: index + 1,
                    qty: ToString(item.qty),
                    diorder: "0",
                    harga: ToString(item.harga),
                    total: ToString(item.total),
                    persen_pajak: ToString(item.persen_pajak),
                    diskonpersen: ToString(item.diskonpersen),
                    diskonrp: ToString(item.diskonrp),
                });
            });

            // create purchase_request detail
            const dataPurchaseRequestDetail = await createPurchaseRequestDetail(validateDetail, tx);

            // persetujuan
            if (validate.status == "S") {
                const lPersetujuan = await createPurchaseRequestPersetujuanBySetting(dataPurchaseRequest.id, req.user!.id, tx);
                io.emit("update-persetujuan-purchase-request");
                return { ...dataPurchaseRequest, detail: dataPurchaseRequestDetail, persetujuan: lPersetujuan };
            }
            return { ...dataPurchaseRequest, detail: dataPurchaseRequestDetail, persetujuan: [] };
        });

        return res.status(200).json({
            message: "Success Create PurchaseRequest",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            // check purchase_request
            const [dataPurchaseRequestPersetujuan] = await getPurchaseRequestPersetujuan(id, tx);
            if (dataPurchaseRequestPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("Purchase Request Sudah ada Persetujuan");
            }

            const [dataPurchaseOrderDetail] = await getPurchaseOrderDetailByIdPurchaseRequest(id, tx);
            if (dataPurchaseOrderDetail) {
                throw ValidationError("Purchase Request sudah digunakan");
            }

            // validasi purchase_request
            const validate = updatePurchaseRequestSchema.parse({
                ...rest,
                tanggal: formatDate(rest.tanggal),
                tgl_dibutuhkan: formatDate(rest.tgl_dibutuhkan),
                total: ToString(rest.total),
                total_discount: ToString(rest.total_discount),
                dpp: ToString(rest.dpp),
                grandtotal: ToString(rest.grandtotal),
                persendiskon: ToString(rest.persendiskon),
                total_ppn: ToString(rest.total_ppn),
                total_pph: ToString(rest.total_pph),
                pajak: rest.pajak as NilaiPajak[],
                updated_by: req.user?.id,
            });

            const dataPurchaseRequest = await updatePurchaseRequest(id, validate, tx);

            if (!dataPurchaseRequest) {
                throw ValidationError("Error, PO tidak ditemukan");
            }

            // validasi purchase_request detail
            const validateDetail: NewPurchaseRequestDetail = detail.map((item: PurchaseRequestDetail, index: number) => {
                return insertPurchaseRequestDetailSchema.parse({
                    ...item,
                    id: id,
                    urut: index + 1,
                    id_pajak: item.id_pajak,
                    qty: ToString(item.qty),
                    diorder: "0",
                    harga: ToString(item.harga),
                    total: ToString(item.total),
                    persen_pajak: ToString(item.persen_pajak),
                    diskonpersen: ToString(item.diskonpersen),
                    diskonrp: ToString(item.diskonrp),
                });
            });

            // validasi jumlah barang
            const isQtyGreaterThanZero: boolean = validate.status != "D" ? detail.some((obj: NewPurchaseRequestDetail) => parseFloat(obj.qty as string) > 0) : true;
            if (!isQtyGreaterThanZero) {
                throw ValidationError("Error, jumlah barang harus lebih dari 0");
            }

            // Delete PO Detail yang lama dan insert yang baru
            const dataPurchaseRequestDetail = await updatePurchaseRequestDetail(id, validateDetail, tx);

            // persetujuan
            if (validate.status == "S") {
                await deletePurchaseRequestPersetujuan(id, tx);
                const lPersetujuan = await createPurchaseRequestPersetujuanBySetting(id, req.user!.id, tx);
                // socket
                io.emit("update-persetujuan-purchase-request");
                return { ...dataPurchaseRequest, detail: dataPurchaseRequestDetail, persetujuan: lPersetujuan };
            }
            return { ...dataPurchaseRequest, detail: dataPurchaseRequestDetail, persetujuan: [] };
        });
        res.status(200).json({
            message: "Success Update PurchaseRequest",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await db.transaction(async (tx) => {
            const [check] = await tx.select({ id: purchase_request.id, status: purchase_request.status }).from(purchase_request).where(eq(purchase_request.id, id));
            if (check.status == "P" || check.status == "C") {
                throw ValidationError("PO tidak dapat dihapus karena sudah ada transaksi");
            }

            // check persetujuan purchase_request
            const [dataPurchaseRequestPersetujuan] = await getPurchaseRequestPersetujuan(id, tx);
            if (dataPurchaseRequestPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("Purchase Request Sudah ada Persetujuan");
            }

            await deletePurchaseRequestPersetujuan(id, tx);
            await deletePurchaseRequestDetail(id, tx);
            const data = await deletePurchaseRequest(id, tx);

            return { ...data };
        });
        res.status(200).json({
            message: "Success Delete PurchaseRequest",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const cetak = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get Data
        const prId: number = parseInt(req.params.id, 10);
        const data = await getPurchaseRequestById(prId);
        const dataDetail = await getPurchaseRequestDetailById(prId, false);

        const perusahaan = await getInternalPerusahaanById(COMPANY_ID);

        // Generate PDF
        const module = "purchase-request";

        const { browser, page, template } = await setupPuppeteer();

        const { templateContent, htmlContent } = generateHTMLContent({ ...data, detail: dataDetail }, perusahaan, module, template);

        await injectStylesAndScripts(page, htmlContent);

        const pdfBuffer = await generatePDF(page);

        sendPDFResponse(res, pdfBuffer);

        await browser.close();
    } catch (error) {
        next(error);
    }
};
