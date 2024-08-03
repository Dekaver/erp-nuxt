import { NextFunction, Request, Response } from "express";
import { createProyek, deleteProyek, getProyek, getProyekById, updateProyek } from "./service";
import { insertProyekSchema, updateProyekSchema } from "./schema";
import { MyRequest } from "../../middleware/authMiddleware";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getProyek();
        return res.status(200).json({
            message: "Success Get Proyek",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await getProyekById(id);
        return res.status(200).json({
            message: "Success Get Proyek",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;
        const data = await db.transaction(async(tx) => {
            const validate = insertProyekSchema.parse({
                ...rest,
                created_by: req.user?.id,
                updated_by: req.user?.id,
            });

            return await createProyek(validate, tx);
        })
        return res.status(200).json({
            message: "Success Create Proyek",
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
        const data = await db.transaction(async (tx) => {
            const validate = updateProyekSchema.parse({
                ...rest,
                updated_by: req.user?.id,
            });

            return await updateProyek(id, validate, tx);
        });
        return res.status(200).json({
            message: "Success Update Proyek",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await deleteProyek(id);
        return res.status(200).json({
            message: "Success Delete Proyek",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
