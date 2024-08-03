import { NextFunction, Request, Response } from "express";
import { createJenisKendaraan, deleteJenisKendaraan, getJenisKendaraan, getJenisKendaraanById, updateJenisKendaraan } from "./service";
import { insertJenisKendaraanSchema } from "./schema";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getJenisKendaraan();
        return res.status(200).json({
            message: "Success Get Jenis Kendaraan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getJenisKendaraanById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get Jenis Kendaraan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertJenisKendaraanSchema.parse(req.body);

        const data = await createJenisKendaraan(validate);
        return res.status(200).json({
            message: "Success Create Jenis Kendaraan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertJenisKendaraanSchema.parse(req.body);

        const data = await updateJenisKendaraan(parseInt(req.params.id), validate);
        return res.status(200).json({
            message: "Success Update Jenis Kendaraan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteJenisKendaraan(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Delete Jenis Kendaraan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
