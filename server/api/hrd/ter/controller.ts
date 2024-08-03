import { NextFunction, Response } from "express";
import { MyRequest } from "../../../middleware/authMiddleware";
import { ToString } from "../../../libs/formater";
import { ValidationError } from "../../../libs/errors";

import { NewTer, insertTerSchema } from "./schema";
import { getTer, getOptionTer, getTerById, createTer, updateTer, deleteTer } from "./service";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getTer();
        return res.status(200).json({
            message: "Success Get TER",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getOptionTer();
        return res.status(200).json({
            message: "Success Get TER",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getTerById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get TER",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validateTer: NewTer = insertTerSchema.parse({
                ...rest,
                nominal: parseFloat(rest.nominal)|| 0,
                updated_by: req.user?.id,
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
            });
            const data = await createTer(validateTer, tx);

            return { ...data };
        });

        return res.status(200).json({
            message: "Success Create TER",
            data: data,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        // Bedah data
        const { nomor, tanggal, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validateTer = insertTerSchema.parse({
                ...rest,
                nominal: parseFloat(rest.nominal)|| 0,
                updated_by: req.user?.id,
                modified_date: new Date().toISOString(),
            });

            const data = await updateTer(id, validateTer, tx);
            return { ...data };
        });

        return res.status(200).json({
            message: "Success Update TER",
            data: data,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const data = await deleteTer(parseInt(id));
        return res.status(200).json({
            message: "Success Delete TER",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
