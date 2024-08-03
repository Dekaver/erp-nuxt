import { NextFunction, Request, Response } from "express";
import { createKantor, deleteKantor, getKantor, getKantorById, updateKantor } from "../kantor/service";
import { insertKantorSchema } from "../kantor/schema";
import { MyRequest } from "../../../middleware/authMiddleware";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getKantor();
        return res.status(200).json({
            message: "Success Get Kantor",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getKantorById(req.user!.id);
        return res.status(200).json({
            message: "Success Get Kantor",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertKantorSchema.parse(req.body);

        const data = await createKantor(validate);
        return res.status(200).json({
            message: "Success Create Kantor",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertKantorSchema.parse(req.body);

        const data = await updateKantor(parseInt(req.params.id), validate);
        return res.status(200).json({
            message: "Success Update Kantor",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteKantor(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Delete Kantor",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
