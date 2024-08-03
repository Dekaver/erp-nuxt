import { NextFunction, Request, Response } from "express";
import { nomorSaldoAwalAp } from "../../libs/nomor";
import { ToString } from "../../libs/formater";
import { MyRequest } from "../../middleware/authMiddleware";
import { insertAccApFakturSchema } from "../ap/schema";
import { getAccApFakturSaldoAwal, getAccApFakturByNomor, createAccApFaktur, isCanEdit, updateAccApFaktur, deleteAccApFaktur } from "../ap/service";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAccApFakturSaldoAwal();
        res.status(200).json({
            message: "Success get Saldo Awal",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ap_number = req.params.ap_number;
        const data = await getAccApFakturByNomor(ap_number);
        res.status(200).json({
            message: "Success get saldo awal",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { amount, date, ...rest } = req.body;

        const defTanggal = new Date(date);
        const month = defTanggal.getMonth() + 1;
        const year = defTanggal.getFullYear();
        const nomor = await nomorSaldoAwalAp(year, month);

        const validate = insertAccApFakturSchema.parse({
            ...rest,
            ap_number: nomor,
            date: date,
            amount: ToString(amount),
        });

        const data = await createAccApFaktur(validate);
        res.status(200).json({
            message: "Success crate Saldo Awal",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, ...rest } = req.body;

        const ap_number = req.params.id;

        const isCan = await isCanEdit(ap_number);

        if (!isCan) {
            throw ValidationError("Sudah Ada Pembayaran, Tidak Dapat Di Edit");
        }

        const validate = insertAccApFakturSchema.parse({
            ...rest,
            amount: ToString(amount),
        });

        const data = await updateAccApFaktur(ap_number, validate);
        res.status(200).json({
            message: "Success crate Saldo Awal",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ap_number = req.params.id;
        const isCan = await isCanEdit(ap_number);

        if (!isCan) {
            throw ValidationError("Sudah Ada Pembayaran, Tidak Dapat Di Hapus");
        }
        const data = await deleteAccApFaktur(ap_number);
        res.status(200).json({
            message: "Success Delete Saldo Awal",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
