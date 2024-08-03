import { NextFunction, Request, Response } from "express";
import { NewSetting, insertSettingSchema } from "./schema";
import { createSetting, deleteSetting, getSetting, getSettingByName, updateSetting } from "./service";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getSetting();
        res.status(200).json({
            message: "Success Get Setting",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getSettingByName(req.params.name);
        res.status(200).json({
            message: "Success Get Setting By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const validate = insertSettingSchema.parse(rest);
        const data = await createSetting(validate);
        res.status(200).json({
            message: "Success Create Setting",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;
        const form: NewSetting = {
            name: rest.name,
            value: rest.value,
        };
        const validate = insertSettingSchema.parse(form);
        const data = await updateSetting(parseInt(req.params.id), validate);
        res.status(200).json({
            message: "Success Create Setting",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteSetting(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Delete Setting",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
