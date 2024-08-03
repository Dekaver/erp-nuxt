import { NextFunction, Request, Response } from "express";
import { createPajak, deletePajak, getPajak, getPajakById, updatePajak } from "../pajak/service";
import { NewPajak, insertPajakSchema } from "../pajak/schema";
import { ToString } from "../../libs/formater";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPajak();
        return res.status(200).json({
            message: "Success Get Pajak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await getPajakById(id);
        return res.status(200).json({
            message: "Success Get Pajak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const validate = insertPajakSchema.parse({
            ...rest,
            nilai: ToString(rest.nilai),
        });

        const data = await createPajak(validate);
        return res.status(200).json({
            message: "Success Create Pajak",
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
        const validate: NewPajak = insertPajakSchema.parse({
            ...rest,
            nilai: ToString(rest.nilai),
        });

        const data = await updatePajak(id, validate);
        return res.status(200).json({
            message: "Success Update Pajak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deletePajak(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Delete Pajak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
