import { NextFunction, Request, Response } from "express";
import { createRencanaAnggaranBiaya, deleteRencanaAnggaranBiaya, getRencanaAnggaranBiaya, getRencanaAnggaranBiayaById, nomorRencanaAnggaranBiaya, updateRencanaAnggaranBiaya } from "./service";
import { insertRencanaAnggaranBiayaSchema, updateRencanaAnggaranBiayaSchema } from "./schema";
import { MyRequest } from "../../middleware/authMiddleware";
import { ToString, formatDate } from "../../libs/formater";
import * as dayjs from 'dayjs'
import { createRencanaAnggaranBiayaDetail, deleteRencanaAnggaranBiayaDetail, getRencanaAnggaranBiayaDetailById } from "./detail/service";
import { NewRencanaAnggaranBiayaDetail, insertRencanaAnggaranBiayaDetailSchema } from "./detail/schema";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getRencanaAnggaranBiaya();
        return res.status(200).json({
            message: "Success Get Rencana Anggaran Biaya",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await getRencanaAnggaranBiayaById(id);
        const dataDetail = await getRencanaAnggaranBiayaDetailById(id);
        return res.status(200).json({
            message: "Success Get Rencana Anggaran Biaya",
            data: { ...data, detail: dataDetail },
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { detail, ...rest } = req.body;
        const data = await db.transaction(async (tx) => {
            const nomorFix = await nomorRencanaAnggaranBiaya(formatDate(rest.tanggal), tx);
            const validate = insertRencanaAnggaranBiayaSchema.parse({
                ...rest,
                nomor: nomorFix,
                tanggal: formatDate(rest.tanggal),
                total: ToString(rest.total),
                created_by: req.user?.id,
                updated_by: req.user?.id,
            });

            const data = await createRencanaAnggaranBiaya(validate, tx);

            const validateDetail: NewRencanaAnggaranBiayaDetail[] = detail.map((item: NewRencanaAnggaranBiayaDetail, index: number) => {
                return insertRencanaAnggaranBiayaDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    qty: ToString(item.qty),
                    sisa: ToString(item.qty),
                    harga: ToString(item.harga),
                    total: ToString(item.total),
                    diambil: "0",
                });
            });

            const dataDetail = await createRencanaAnggaranBiayaDetail(validateDetail, tx);

            return { ...data, detail: dataDetail };
        });
        return res.status(200).json({
            message: "Success Create Rencana Anggaran Biaya",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (tx) => {
            const id = parseInt(req.params.id);
            const { detail, ...rest } = req.body;
            const validate = updateRencanaAnggaranBiayaSchema.parse({
                ...rest,
                total: ToString(rest.total),
                tanggal: dayjs(rest.tanggal).tz("Asia/Makassar").format("YYYY-MM-DD"),
                updated_by: req.user?.id,
            });

            const data = await updateRencanaAnggaranBiaya(id, validate, tx);

            const validateDetail: NewRencanaAnggaranBiayaDetail[] = detail.map((item: NewRencanaAnggaranBiayaDetail, index: number) => {
                return insertRencanaAnggaranBiayaDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    qty: ToString(item.qty),
                    sisa: ToString(item.qty),
                    harga: ToString(item.harga),
                    total: ToString(item.total),
                    diambil: "0",
                });
            });
            await deleteRencanaAnggaranBiayaDetail(id, tx);

            const dataDetail = await createRencanaAnggaranBiayaDetail(validateDetail, tx);
            return { ...data, detail: dataDetail };
        });
        return res.status(200).json({
            message: "Success Update Rencana Anggaran Biaya",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await deleteRencanaAnggaranBiaya(id);
        return res.status(200).json({
            message: "Success Delete Rencana Anggaran Biaya",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
