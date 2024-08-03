import { NextFunction, Request, Response } from "express";
import { MyRequest } from "../../../middleware/authMiddleware";
import { insertPurchaseOrderSettingSchema, updatePurchaseOrderSettingSchema } from "./schema";
import { createPurchaseOrderSetting, getPurchaseOrderSettings, updatePurchaseOrderSetting } from "./service";
import { io } from "../../../app";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPurchaseOrderSettings();
        res.status(200).json({
            message: "Success Get Purchase Order Settings",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const validate = insertPurchaseOrderSettingSchema.parse({
            ...rest,
            created_by: req.user?.id,
            updated_by: req.user?.id,
        });
        const data = await createPurchaseOrderSetting(validate);

        io.emit("update-settings");

        res.status(200).json({
            message: "Success Create Purchase Order Setting",
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
        const validate = updatePurchaseOrderSettingSchema.parse({
            ...rest,
            updated_by: req.user?.id,
        });

        const data = await updatePurchaseOrderSetting(id, validate);

        io.emit("update-settings");

        res.status(200).json({
            message: "Success Update Purchase Order Setting",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};