import { NextFunction, Request, Response } from "express";
import { MyRequest } from "../../../middleware/authMiddleware";
import { insertPaymentApSettingSchema, updatePaymentApSettingSchema } from "./schema";
import { createPaymentApSetting, getPaymentApSettings, updatePaymentApSetting } from "./service";
import { io } from "../../../app";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPaymentApSettings();
        res.status(200).json({
            message: "Success Get Payment AP Settings",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const validate = insertPaymentApSettingSchema.parse({
            ...rest,
            created_by: req.user?.id,
            updated_by: req.user?.id,
        });
        const data = await createPaymentApSetting(validate);
        io.emit("update-settings")
        res.status(200).json({
            message: "Success Create Payment AP Setting",
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
        const validate = updatePaymentApSettingSchema.parse({
            ...rest,
            updated_by: req.user?.id,
        });

        const data = await updatePaymentApSetting(id, validate);

        io.emit("update-settings")
        res.status(200).json({
            message: "Success Update Payment AP Setting",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};