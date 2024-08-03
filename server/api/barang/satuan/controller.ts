import { NextFunction, Request, Response } from "express";
import { createSatuan, deleteSatuan, getSatuan, getSatuanById, updateSatuan } from "../satuan/service";
import { insertSatuanSchema } from "../satuan/schema";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getSatuan();
        return res.status(200).json({
            message: "Success Get Satuan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getSatuanById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get Satuan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertSatuanSchema.parse(req.body);

        const data = await createSatuan(validate);
        return res.status(200).json({
            message: "Success Create Satuan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertSatuanSchema.parse(req.body);

        const data = await updateSatuan(parseInt(req.params.id), validate);
        return res.status(200).json({
            message: "Success Update Satuan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteSatuan(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Delete Satuan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
