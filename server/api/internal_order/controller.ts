import { NextFunction, Response } from "express";
import { MyRequest } from "../../middleware/authMiddleware";
import { ToString } from "../../libs/formater";
import { nomorInternalOrder } from "../../libs/nomor";
import { NewInternalOrder, insertInternalOrderSchema, NewInternalOrderDetail, insertInternalOrderDetailSchema, InternalOrderDetail } from "./schema";
import { getInternalOrder, getOptionInternalOrder, getInternalOrderById, createInternalOrder, createInternalOrderDetail, updateInternalOrder, deleteInternalOrder } from "./service";
import { getAccGlTransByReference } from "../accounting/acc_gl_trans/service";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { status } = req.query;
        const data = await getInternalOrder(status);
        return res.status(200).json({
            message: "Success Get InternalOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getOptionInternalOrder(req.query);
        return res.status(200).json({
            message: "Success Get InternalOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getInternalOrderById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get InternalOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { id, tanggal, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const nomor = await nomorInternalOrder(tanggal, tx);

            const validateInternalOrder: NewInternalOrder = insertInternalOrderSchema.parse({
                ...rest,
                nomor: nomor,
                tanggal: dayjs(tanggal, "DD-MM-YYYY").tz("Asia/Makassar").format("YYYY-MM-DD"),
                modified_by: req.user?.id,
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
            });
            const today = dayjs();
            if (dayjs(validateInternalOrder.tanggal, "YYYY-MM-DD").isAfter(today)) {
                throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
            }
            const data = await createInternalOrder(validateInternalOrder, tx);

            const validateDetail = detail.map((item: NewInternalOrderDetail, index: number) => {
                return insertInternalOrderDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    qty: ToString(item.qty),
                    sisa: ToString(item.qty),
                });
            });

            const dataDetail = await createInternalOrderDetail(data.id, validateDetail, tx);

            return { ...data, detail: dataDetail };
        });

        return res.status(200).json({
            message: "Success Create InternalOrder",
            data: data,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        // Bedah data
        const { nomor, tanggal, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validateInternalOrder = insertInternalOrderSchema.parse({
                ...rest,
                tanggal: dayjs(tanggal, "DD-MM-YYYY").tz("Asia/Makassar").format("YYYY-MM-DD"),
                nomor: nomor,
                send_by: req.user?.id,
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
                modified_by: req.user?.id,
                modified_date: new Date().toISOString(),
            });

            const data = await updateInternalOrder(id, validateInternalOrder, tx);

            const validateDetail: InternalOrderDetail[] = detail.map((item: InternalOrderDetail, index: number) => {
                if (!item.id_barang) {
                    throw ValidationError("Barang tidak boleh kosong.");
                }
                return insertInternalOrderDetailSchema.parse({
                    ...item,
                    id: id,
                    urut: index + 1,
                    qty: ToString(item.qty),
                    sisa: ToString(item.qty),
                });
            });

            const dataDetail = await createInternalOrderDetail(id, validateDetail, tx);

            return { ...data, detail: dataDetail };
        });

        return res.status(200).json({
            message: "Success Update InternalOrder",
            data: data,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const data = await deleteInternalOrder(parseInt(id));
        return res.status(200).json({
            message: "Success Delete InternalOrder",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const journalCetak = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const dataPaymentAp = await getInternalOrderById(parseInt(req.params.id));

        const data = await getAccGlTransByReference(dataPaymentAp.nomor);
        res.status(200).json({
            message: "Success get journal voucher",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
