import { NextFunction, Request, Response } from "express";
import { ToString, formatDate } from "../../libs/formater";
import { nomorUangMuka } from "../../libs/nomor";
import { createJurnal, createUangMuka, deleteUangMuka, getPurchaseOrder, getUangMuka, getUangMukaById, getUangMukaByPo, updateUangMuka } from "./service";
import { NewUangMuka, insertUangMukaSchema, updateUangMukaSchema } from "./schema";
import { getAccGlTransByReference } from "../accounting/acc_gl_trans/service";
import { MyRequest } from "../../middleware/authMiddleware";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_kontak, status } = req.query;
        const data = await getUangMuka({ id_kontak: parseInt(id_kontak as string), status: status as string });
        res.status(200).json({
            message: "Success get ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (trx) => {
            const data = await getUangMukaById(parseInt(req.params.id), trx);
            const dataPo = await getPurchaseOrder(data.id_po, trx);
            return { ...data, dataPo: dataPo };
        });
        res.status(200).json({
            message: "Success get ap by id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (trx) => {
            // Bedah data
            const { id, detailConvert, ...rest } = req.body;

            // Nomor AP
            const nomorFix = await nomorUangMuka(formatDate(rest.tanggal), trx);

            // Validasi AP
            const validate = insertUangMukaSchema.parse({
                ...rest,
                nomor: nomorFix,
                tanggal: formatDate(rest.tanggal),
                total_po: ToString(rest.total_po),
                sisa_tagihan: ToString(rest.sisa_tagihan),
                bayar: ToString(rest.bayar),
                pajak: ToString(rest.pajak),
                grandtotal: ToString(rest.grandtotal),
                created_by: req.user!.id,
                updated_by: req.user!.id,
            });

            // Buat AP
            const data = await createUangMuka(validate, trx);

            if (data.status == "C") {
                await createJurnal(data, trx);
            }

            return { ...data };
        });
        res.status(200).json({
            message: "Success create Uang Muka",
            data: data,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (trx) => {
            const id = parseInt(req.params.id);

            const { ...rest } = req.body;

            // Validasi AP
            const validate = updateUangMukaSchema.parse({
                ...rest,
                tanggal: formatDate(rest.tanggal),
                total_po: ToString(rest.total_po),
                sisa_tagihan: ToString(rest.sisa_tagihan),
                bayar: ToString(rest.bayar),
                pajak: ToString(rest.pajak),
                grandtotal: ToString(rest.grandtotal),
                updated_by: req.user!.id,
            });

            const data = await updateUangMuka(id, validate, trx);

            if (data.status == "C") {
                await createJurnal(data, trx);
            }

            return { ...data };
        });
        res.status(200).json({
            message: "Success update Uang Muka",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const check = await getUangMukaById(parseInt(req.params.id));
        if (check.status === "C") {
            throw ValidationError("Data tidak dapat dihapus karena sudah diacc");
        }
        const data = await deleteUangMuka(parseInt(req.params.id));
        res.status(200).json({
            message: "Success delete ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const journalCetak = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dataPaymentUangMuka = await getUangMukaById(parseInt(req.params.id));
        const data = await getAccGlTransByReference(dataPaymentUangMuka.nomor);
        res.status(200).json({
            message: "Success get journal voucher",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getByIdPo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getUangMukaByPo(parseInt(req.params.id));
        res.status(200).json({
            message: "Success get journal voucher",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
