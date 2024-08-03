import { NextFunction, Request, Response } from "express";
import { MyRequest } from "../../middleware/authMiddleware";
import { ToString, formatDate } from "../../libs/formater";
import {
    getDeliveryOrder,
    getOptionDeliveryOrder,
    getOptionDeliveryOrderForInvoice,
    getDeliveryOrderById,
    createDeliveryOrder,
    updateStatusDoSend,
    updateDeliveryOrder,
    deleteDeliveryOrder,
    checkIfDeliveryOrderClosing,
    checkIfDeliveryOrderPosting,
    nomorDeliveryOrder,
    createDeliveryOrderPersetujuanBySetting,
} from "./service";
import { COMPANY_ID, generateHTMLContent, generatePDF, injectStylesAndScripts, sendPDFResponse, setupPuppeteer } from "../cetakan/service";
import { getInternalPerusahaanById } from "../internal-perusahaan/service";
import { NewDeliveryOrderDetail, insertDeliveryOrderDetailSchema } from "./detail/schema";
import { getDeliveryOrderDetailById, createDeliveryOrderDetail, deleteDeliveryOrderDetail } from "./detail/service";
import { NewDeliveryOrder, insertDeliveryOrderSchema, updateDeliveryOrderSchema } from "./schema";
import { deleteDeliveryOrderPersetujuan, getDeliveryOrderPersetujuan } from "./persetujuan/service";
import { io } from "../../app";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const type = req.query.type;
        const module = req.query.module;
        if (type === "option") {
            const data = await getOptionDeliveryOrder(module as string);
            res.status(200).json({
                message: "Success Get Delivery Order",
                data: data,
            });
            return;
        }
        const { status } = req.query;
        const data = await getDeliveryOrder(status);
        return res.status(200).json({
            message: "Success Get DeliveryOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOptionForInvoice = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getOptionDeliveryOrderForInvoice();
        return res.status(200).json({
            message: "Success Get DeliveryOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await db.transaction(async (tx) => {
            const data = await getDeliveryOrderById(id, tx);
            const dataDetail = await getDeliveryOrderDetailById(id, tx);
            const datapersetujuan = await getDeliveryOrderPersetujuan(id, tx);
            return { ...data, detail: dataDetail, persetujuan: datapersetujuan };
        });
        return res.status(200).json({
            message: "Success Get DeliveryOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const nomorFix = await nomorDeliveryOrder(rest.tanggal, tx);

            const validate: NewDeliveryOrder = insertDeliveryOrderSchema.parse({
                ...rest,
                nomor: nomorFix,
                tanggal: formatDate(rest.tanggal),
                created_by: req.user?.id,
                updated_by: req.user?.id,
            });

            const data = await createDeliveryOrder(validate, tx);

            const validateDetail: NewDeliveryOrderDetail[] = detail.map((item: NewDeliveryOrderDetail, index: number) => {
                return insertDeliveryOrderDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    qty: ToString(item.qty),
                    qty_diterima: ToString(item.qty_diterima),
                });
            });

            if (validate.status == "S") {
                const dataDetail = await createDeliveryOrderDetail(
                    validateDetail.filter((d) => parseFloat(d.qty as string) != 0),
                    tx,
                );
                const lPersetujuan = await createDeliveryOrderPersetujuanBySetting(data.id, req.user!.id, tx);
                io.emit("update-persetujuan-delivery-order");
                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status == "C") {
                const dataDetail = await createDeliveryOrderDetail(
                    validateDetail.filter((d) => parseFloat(d.qty as string) != 0),
                    tx,
                );
                await updateStatusDoSend(
                    data,
                    dataDetail.filter((d) => parseFloat(d.qty) != 0),
                    tx,
                );
                return { ...data, detail: dataDetail };
            }
            const dataDetail = await createDeliveryOrderDetail(validateDetail, tx);
            return { ...data, detail: dataDetail, persetujuan: [] };
        });

        return res.status(200).json({
            message: "Success Create DeliveryOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { nomor, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const statusDO = await checkIfDeliveryOrderPosting(id, tx);

            if (statusDO.is_closed) {
                throw ValidationError("Status Delivery Order Has Posted");
            }

            const [dataPersetujuan] = await getDeliveryOrderPersetujuan(id, tx);
            if (dataPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("Sales Order Sudah ada Persetujuan");
            }

            const validate = updateDeliveryOrderSchema.parse({
                ...rest,
                nomor: nomor,
                tanggal: formatDate(rest.tanggal),
                updated_by: req.user?.id,
            });

            const data = await updateDeliveryOrder(id, validate, tx);

            const validateDetail: NewDeliveryOrderDetail[] = detail.map((item: NewDeliveryOrderDetail, i: number) => {
                return insertDeliveryOrderDetailSchema.parse({
                    ...item,
                    id: id,
                    urut: i + 1,
                    qty: ToString(item.qty),
                    qty_diterima: ToString(item.qty_diterima),
                });
            });

            await deleteDeliveryOrderDetail(id, tx);

            if (validate.status == "S") {
                const dataDetail = await createDeliveryOrderDetail(
                    validateDetail.filter((d) => parseFloat(d.qty as string) != 0),
                    tx,
                );
                // persetujuan
                await deleteDeliveryOrderPersetujuan(id, tx);
                const lPersetujuan = await createDeliveryOrderPersetujuanBySetting(id, req.user!.id, tx);
                io.emit("update-persetujuan-delivery-order");
                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status == "C") {
                const dataDetail = await createDeliveryOrderDetail(
                    validateDetail.filter((d) => parseFloat(d.qty as string) != 0),
                    tx,
                );
                await updateStatusDoSend(
                    data,
                    dataDetail.filter((d) => parseFloat(d.qty) != 0),
                    tx,
                );
                return { ...data, detail: dataDetail, persetujuan: [] };
            }

            const dataDetail = await createDeliveryOrderDetail(validateDetail, tx);
            return { ...data, detail: dataDetail, persetujuan: [] };
        });

        return res.status(200).json({
            message: "Success Update Delivery Order",
            data: data,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await db.transaction(async (tx) => {
            const [dataPersetujuan] = await getDeliveryOrderPersetujuan(id, tx);
            if (dataPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("Sales Order Sudah ada Persetujuan");
            }

            await deleteDeliveryOrderPersetujuan(id, tx);

            const data = await deleteDeliveryOrder(id, tx);
            return data;
        });
        return res.status(200).json({
            message: "Success Delete DeliveryOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateReceipt = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { nomor, tanggal, shipping_costs, received_date_posting, return_date, arrived_date, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const statusDO = await checkIfDeliveryOrderClosing(id, tx);

            if (statusDO.is_closed) {
                throw ValidationError("Status Delivery Order Has Closed");
            }

            const validate: NewDeliveryOrder = insertDeliveryOrderSchema.parse({
                ...rest,
                nomor: nomor,
                tanggal: tanggal,
                received_date_posting: received_date_posting,
                return_date: return_date,
                arrived_date: arrived_date,
                origin: origin,
                modified_by: req.user?.id,
                modified_date: new Date().toISOString(),
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
            });

            const data = await updateDeliveryOrder(id, validate, tx);

            const validateDetail = detail.map((item: NewDeliveryOrderDetail, i: number) => {
                return insertDeliveryOrderDetailSchema.parse({
                    ...item,
                    id: id,
                    urut: i + 1,
                    qty: ToString(item.qty),
                    qty_diterima: ToString(item.qty_diterima),
                });
            });

            const dataDetail = await createDeliveryOrderDetail(validateDetail, tx);
            return { ...data, detail: dataDetail };
        });

        return res.status(200).json({
            message: "Success Update Delivery Order",
            data: data,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const cetak = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get Data
        const id: number = parseInt(req.params.id, 10);
        const data = await getDeliveryOrderById(id);
        const dataDetail = await getDeliveryOrderDetailById(id);

        const perusahaan = await getInternalPerusahaanById(COMPANY_ID);

        // Generate PDF
        const module = "delivery-order";

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
