import { NextFunction, Request, Response } from "express";
import { formatDate2 } from "../../../libs/formater";
import { MyRequest } from "../../../middleware/authMiddleware";
import { insertHariLiburSchema } from "./schema";
import { createHariLibur, deleteHariLibur, getHariLibur, getHariLiburByName, updateHariLibur } from "./service";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getHariLibur(parseInt(req.params.year));
        res.status(200).json({
            message: "Success Get HariLibur",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getHariLiburByName(req.params.nama);
        res.status(200).json({
            message: "Success Get HariLibur By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const validate = insertHariLiburSchema.parse({
            ...rest,
            tanggal: formatDate2(rest.tanggal),
            created_by: req.user?.id,
            updated_by: req.user?.id,
        });
        const data = await createHariLibur(validate);
        res.status(200).json({
            message: "Success Create HariLibur",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;
        const id = parseInt(req.params.id);
        const validate = insertHariLiburSchema.parse({
            nama: rest.nama,
            tanggal: formatDate2(rest.tanggal),
            hari_libur_tipe_id: rest.hari_libur_tipe_id,
            updated_by: req.user?.id,
            created_by: rest.created_by,
        });
        const data = await updateHariLibur(id, validate);
        res.status(200).json({
            message: "Success Edit HariLibur",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await deleteHariLibur(id);
        res.status(200).json({
            message: "Success Delete HariLibur",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
