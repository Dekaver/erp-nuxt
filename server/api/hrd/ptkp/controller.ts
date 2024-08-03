import { NextFunction, Response } from "express";
import { MyRequest } from "../../../middleware/authMiddleware";
import { ToString } from "../../../libs/formater";
import { ValidationError } from "../../../libs/errors";

import { NewPtkp, insertPtkpSchema } from "./schema";
import { getPtkp, getOptionPtkp, getPtkpById, createPtkp, updatePtkp, deletePtkp } from "./service";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getPtkp();
        return res.status(200).json({
            message: "Success Get PTKP",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getOptionPtkp();
        return res.status(200).json({
            message: "Success Get PTKP",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getPtkpById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get PTKP",
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
            const validatePtkp: NewPtkp = insertPtkpSchema.parse({
                ...rest,
                nominal: ToString(rest.nominal) || "0",
                updated_by: req.user?.id,
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
            });
            const data = await createPtkp(validatePtkp, tx);

            return { ...data };
        });

        return res.status(200).json({
            message: "Success Create PTKP",
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
            const validatePtkp = insertPtkpSchema.parse({
                ...rest,
                nominal: ToString(rest.nominal)|| "0",
                modified_by: req.user?.id,
                modified_date: new Date().toISOString(),
            });

            const data = await updatePtkp(id, validatePtkp, tx);
            return { ...data };
        });

        return res.status(200).json({
            message: "Success Update PTKP",
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
        const data = await deletePtkp(parseInt(id));
        return res.status(200).json({
            message: "Success Delete PTKP",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
