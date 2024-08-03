import { NextFunction, Response } from "express";
import { MyRequest } from "../../../middleware/authMiddleware";
import { ToString } from "../../../libs/formater";
import { ValidationError } from "../../../libs/errors";

import { NewTerTarif, insertTerTarifSchema } from "./schema";
import { getTerTarif, getOptionTerTarif, getTerTarifById, createTerTarif, updateTerTarif, deleteTerTarif } from "./service";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getTerTarif(req.params.id_ter as unknown as number);
        return res.status(200).json({
            message: "Success Get TER Tarif",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getOptionTerTarif();
        return res.status(200).json({
            message: "Success Get TER Tarif",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getTerTarifById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get TER Tarif",
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
            const validateTerTarif: NewTerTarif = insertTerTarifSchema.parse({
                ...rest,
                batas_bawah: ToString(rest.batas_bawah) || "0",
                batas_atas: ToString(rest.batas_atas) || "0",
                tarif: ToString(rest.tarif) || "0",
                updated_by: req.user?.id,
                created_by: req.user?.id,
                created_at: new Date().toISOString(),
            });
            const data = await createTerTarif(validateTerTarif, tx);

            return { ...data };
        });

        return res.status(200).json({
            message: "Success Create TER Tarif",
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
            const validateTerTarif = insertTerTarifSchema.parse({
                ...rest,
                batas_bawah: ToString(rest.batas_bawah) || "0",
                batas_atas: ToString(rest.batas_atas) || "0",
                tarif: ToString(rest.tarif) || "0",
                updated_by: req.user?.id,
                updated_at: new Date().toISOString(),
            });

            const data = await updateTerTarif(id, validateTerTarif, tx);
            return { ...data };
        });

        return res.status(200).json({
            message: "Success Update TER Tarif",
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
        const data = await deleteTerTarif(parseInt(id));
        return res.status(200).json({
            message: "Success Delete TER Tarif",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
