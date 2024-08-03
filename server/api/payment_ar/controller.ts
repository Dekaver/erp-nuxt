import { NextFunction, Request, Response } from "express";

import { ToString, formatDate } from "../../libs/formater";
import { MyRequest } from "../../middleware/authMiddleware";
import { deleteAccGlTrans, getAccGlTransByReference } from "../accounting/acc_gl_trans/service";
import { insertPaymentArSchema, updatePaymentArSchema } from "./schema";
import { createJurnal, createPaymentAr, createPaymentArPersetujuanBySetting, deletePaymentAr, getPaymentAr, getPaymentArById, nomorPaymentAr, updatePaymentAr } from "./service";
import { createPaymentArDetail, deletePaymentArDetail } from "./detail/service";
import { updateAmountAccArFaktur } from "../ar/service";
import { NewPaymentArDetail, insertPaymentArDetailSchema, PaymentArDetail } from "./detail/schema";
import { updateInvoiceStatusByNomor } from "../invoice/service";
import { deletePaymentArPersetujuan, getPaymentArPersetujuan } from "./persetujuan/service";
import { io } from "../../app";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPaymentAr();
        res.status(200).json({
            message: "Success Get Data Payment Ar",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPaymentArById(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Get Data Payment Ar By ID",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (tx) => {
            const { jurnal, detail, ...rest } = req.body;
            const nomorFix = await nomorPaymentAr(formatDate(rest.date), tx);

            const validate = insertPaymentArSchema.parse({
                ...rest,
                number: nomorFix,
                date: formatDate(rest.date),
                total: ToString(rest.total),
                other_cost: ToString(rest.other_cost),
                created_by: req.user!.id,
                updated_by: req.user!.id,
            });
            const data = await createPaymentAr(validate, tx);

            const validateDetail = detail.map((item: NewPaymentArDetail, index: number) => {
                return insertPaymentArDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    amount: ToString(item.amount),
                    ar_amount: ToString(item.ar_amount),
                    discount: ToString(item.discount),
                });
            });

            const dataDetail = await createPaymentArDetail(validateDetail, tx);

            // persetujuan
            if (validate.status == "S") {
                const lPersetujuan = await createPaymentArPersetujuanBySetting(data.id, req.user!.id, tx);
                io.emit("update-persetujuan-payment-ar");
                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status === "C") {
                for (const detail of dataDetail) {
                    await updateAmountAccArFaktur({ pay: detail.amount, discount: detail.discount, invoice: detail.invoice }, tx);
                    await updateInvoiceStatusByNomor(detail.invoice, "C", tx);
                }

                // create journal
                await createJurnal(data, jurnal, tx);
            }
            return { ...data, detail: dataDetail };
        });

        res.status(200).json({
            message: "Success Create Data Payment Ar",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await db.transaction(async (tx) => {
            const { jurnal, detail, ...rest } = req.body;

            // check persetujuan ap
            const [dataArPersetujuan] = await getPaymentArPersetujuan(id, tx);
            if (dataArPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("AP Sudah ada Persetujuan");
            }

            const validate = updatePaymentArSchema.parse({
                ...rest,
                date: formatDate(rest.date),
                total: ToString(rest.total),
                other_cost: ToString(rest.other_cost),
                updated_by: req.user!.id,
            });
            const data = await updatePaymentAr(id, validate, tx);

            const formDetail = detail.map((item: PaymentArDetail, index: number) => {
                return {
                    ...item,
                    id: id,
                    urut: index + 1,
                    discount: ToString(item.discount),
                    amount: ToString(item.amount),
                    ar_amount: ToString(item.ar_amount),
                };
            });

            const validateDetail = formDetail.map((item: PaymentArDetail) => {
                return insertPaymentArDetailSchema.parse(item);
            });

            await deletePaymentArDetail(data.id, tx);
            const dataDetail = await createPaymentArDetail(validateDetail, tx);

            // persetujuan
            if (validate.status == "S") {
                await deletePaymentArPersetujuan(id, tx);
                const lPersetujuan = await createPaymentArPersetujuanBySetting(data.id, req.user!.id, tx);

                // create journal
                await deleteAccGlTrans(data.number, tx);
                await createJurnal(data, jurnal, tx);
                io.emit("update-persetujuan-payment-ar");
                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status === "C") {
                for (const detail of dataDetail) {
                    await updateAmountAccArFaktur({ pay: detail.amount, discount: detail.discount, invoice: detail.invoice }, tx);
                    await updateInvoiceStatusByNomor(detail.invoice, "C", tx);
                }
                // create journal
                await createJurnal(data, jurnal, tx);
            }
            return { ...data, detail: dataDetail };
        });

        res.status(200).json({
            message: "Success Update Data Payment Ar",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id)
        const data = await db.transaction(async (tx) => {
            // check persetujuan ap
            const [dataArPersetujuan] = await getPaymentArPersetujuan(id, tx);
            if (dataArPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("AP Sudah ada Persetujuan");
            }
            const data = await deletePaymentAr(id, tx);
            return data
        })
        res.status(200).json({
            message: "Success Delete Data Payment Ar",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const journalCetak = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataPaymentAr = await getPaymentArById(parseInt(req.params.id));
        const data = await getAccGlTransByReference(dataPaymentAr.number);
        res.status(200).json({
            message: "Success get journal voucher",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
