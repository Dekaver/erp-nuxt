import { NextFunction, Request, Response } from "express";
import { MyRequest } from "../../middleware/authMiddleware";
import { ToString, formatDate } from "../../libs/formater";
import { insertPaymentApSchema, updatePaymentApSchema } from "./schema";
import { getPaymentAp, getPaymentApDetail, getPaymentApById, createPaymentAp, updatePaymentAp, deletePaymentAp, nomorPaymentAp, createJurnal, createPaymentApPersetujuanBySetting } from "./service";
import { getAccGlTransByReference } from "../accounting/acc_gl_trans/service";
import { NewPaymentApDetail, insertPaymentApDetailSchema } from "./detail/schema";
import { createPaymentApDetail, deletePaymentApDetail } from "./detail/service";
import { updateAmountAccApFaktur, updateApStatusByNomor } from "../ap/service";
import { deletePaymentApPersetujuan, getPaymentApPersetujuan } from "./persetujuan/service";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPaymentAp();
        res.status(200).json({
            message: "Success Get Data Payment Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexBySupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPaymentApDetail(parseInt(req.params.supplier));
        res.status(200).json({
            message: "Success Get Data Payment Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await db.transaction(async (tx) => {
            const data = await getPaymentApById(id, tx);
            const dataPersetujuan = await getPaymentApPersetujuan(id, tx);
            return { ...data, persetujuan: dataPersetujuan };
        });
        res.status(200).json({
            message: "Success Get Data Payment Ap By ID",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { jurnal, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const nomorFix = await nomorPaymentAp(rest.date, tx);

            // validasi payment ap
            const validate = insertPaymentApSchema.parse({
                ...rest,
                date: formatDate(rest.date),
                number: nomorFix,
                other_cost: ToString(rest.other_cost),
                total: ToString(rest.total),
                created_by: req.user!.id,
                updated_by: req.user!.id,
            });

            const data = await createPaymentAp(validate, tx);

            const validateDetail = detail.map((item: NewPaymentApDetail, index: number) => {
                return insertPaymentApDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    ap_amount: ToString(item.ap_amount) as string,
                    amount: ToString(item.amount) as string,
                    discount: ToString(item.discount) as string,
                });
            });

            const dataDetail = await createPaymentApDetail(validateDetail, tx);

            // persetujuan
            if (validate.status == "S") {
                const lPersetujuan = await createPaymentApPersetujuanBySetting(data.id, req.user!.id, tx);
                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status == "C") {
                for (const detail of dataDetail) {
                    await updateAmountAccApFaktur(detail.ap_number, { pay: detail.amount, discount: detail.discount }, tx);
                    await updateApStatusByNomor(detail.ap_number, "C", tx);
                }
                await createJurnal(data, jurnal, tx);
            }
            return { ...data, detail: dataDetail };
        });
        res.status(200).json({
            message: "Success Create Data Payment Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { jurnal, detail, ...rest } = req.body;
        const data = await db.transaction(async (tx) => {
            const validate = updatePaymentApSchema.parse({
                ...rest,
                date: formatDate(rest.date),
                other_cost: ToString(rest.other_cost),
                total: ToString(rest.total),
                updated_by: req.user!.id,
            });

            const data = await updatePaymentAp(id, validate, tx);

            const validateDetail = detail.map((item: any, index: number) => {
                return insertPaymentApDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    ap_amount: ToString(item.amount) as string,
                    amount: ToString(item.pay) as string,
                    discount: ToString(item.discountrp) as string,
                });
            });

            await deletePaymentApDetail(id, tx);
            const dataDetail = await createPaymentApDetail(validateDetail, tx);

            // persetujuan
            if (validate.status == "S") {
                await deletePaymentApPersetujuan(id, tx);
                const lPersetujuan = await createPaymentApPersetujuanBySetting(data.id, req.user!.id, tx);
                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status == "C") {
                for (const detail of dataDetail) {
                    await updateAmountAccApFaktur(detail.ap_number, { pay: detail.amount, discount: detail.discount }, tx);
                }
                await createJurnal(data, jurnal, tx);
            }
            return { ...data, detail: dataDetail };
        });

        res.status(200).json({
            message: "Success Update Data Payment Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deletePaymentAp(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Delete Data Payment Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const journalCetak = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataPaymentAp = await getPaymentApById(parseInt(req.params.id));
        const data = await getAccGlTransByReference(dataPaymentAp.number);
        res.status(200).json({
            message: "Success get journal voucher",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
