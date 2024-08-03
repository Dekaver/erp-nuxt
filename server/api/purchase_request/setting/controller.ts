import { NextFunction, Request, Response } from "express";

import { MyRequest } from "../../../middleware/authMiddleware";
import { insertPurchaseRequestSettingSchema, updatePurchaseRequestSettingSchema } from "./schema";
import { createPurchaseRequestSetting, getPurchaseRequestSettings, updatePurchaseRequestSetting } from "./service";
import { io } from "../../../app";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPurchaseRequestSettings();
        res.status(200).json({
            message: "Success Get Permintaan Pembelian Settings",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const validate = insertPurchaseRequestSettingSchema.parse({
            ...rest,
            created_by: req.user?.id,
            updated_by: req.user?.id,
        });
        const data = await createPurchaseRequestSetting(validate);

        io.emit("update-settings");

        res.status(200).json({
            message: "Success Create Permintaan Pembelian Setting",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { ...rest } = req.body;
        const validate = updatePurchaseRequestSettingSchema.parse({
            ...rest,
            updated_by: req.user?.id,
        });

        const data = await updatePurchaseRequestSetting(id, validate);
        io.emit("update-settings");

        res.status(200).json({
            message: "Success Update Permintaan Pembelian Setting",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
