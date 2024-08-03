import { NextFunction, Request, Response } from "express";
import { MyRequest } from "../../middleware/authMiddleware";
import { insertSettingPembelianSchema } from "./schema";
import { createSettingPembelian, deleteSettingPembelian, getSettingPembelian, updateSettingPembelian } from "./service";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getSettingPembelian();
        res.status(200).json({
            message: "Success Get Setting Pembelian",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const validate = insertSettingPembelianSchema.parse({
            ...rest,
            created_by: req.user?.id,
            updated_by: req.user?.id,
        });
        const data = await createSettingPembelian(validate);
        res.status(200).json({
            message: "Success Create Setting Pembelian",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;
        
        const validate = insertSettingPembelianSchema.parse({
            ...rest,
            updated_by: req.user?.id,
        });

        const data = await updateSettingPembelian(validate);

        res.status(200).json({
            message: "Success Update Setting Pembelian",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteSettingPembelian();

        res.status(200).json({
            message: "Success Delete Setting Pembelian",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
