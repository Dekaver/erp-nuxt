import { NextFunction, Request, Response } from "express";
import { createNotification, deleteNotification, getNotification, getNotificationById, getNotificationByIdPegawai, updateNotification } from "./service";
import { insertNotificationSchema, updateNotificationSchema } from "./schema";
import { MyRequest } from "../../middleware/authMiddleware";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const type =  req.query.type
        const id_pegawai = req.user?.id as number;
        const data = await getNotificationByIdPegawai(id_pegawai);
        return res.status(200).json({
            message: "Success Get Notification",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getNotificationById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get Notification",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertNotificationSchema.parse(req.body);

        const data = await createNotification(validate);
        return res.status(200).json({
            message: "Success Create Notification",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { ...rest } = req.body;
        const validate = updateNotificationSchema.parse(rest);

        const data = await updateNotification(id, validate);
        return res.status(200).json({
            message: "Success Update Notification",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteNotification(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Delete Notification",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
