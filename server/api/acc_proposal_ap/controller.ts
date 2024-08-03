import { NextFunction, Request, Response } from "express";
import { nomorAccProposalAp } from "../../libs/nomor";
import { insertAccProposalApSchema, AccProposalApDetail, insertAccProposalApDetailSchema } from "./schema";
import {
    getAccProposalAp,
    getAccProposalApById,
    createAccProposalAp,
    updateAccProposalAp,
    deleteAccProposalAp,
    getAccProposalApDetail,
    getAccProposalApDetailById,
    createAccProposalApDetail,
    updateAccProposalApDetail,
    deleteAccProposalApDetail,
} from "./service";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAccProposalAp();
        res.status(200).json({
            message: "Success Get Acc Proposal Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAccProposalApById(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Get Acc Proposal Ap By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, nomor, detail, ...rest } = req.body;

        const defTanggal = new Date(req.body.tanggal);
        const month = defTanggal.getMonth() + 1;
        const year = defTanggal.getFullYear();
        const nomorFix = await nomorAccProposalAp(year, month);

        const validate = insertAccProposalApSchema.parse({
            nomor: nomorFix,
            ...rest,
        });

        if (detail.length === 0 || !detail) {
            throw ValidationError("Detail tidak boleh kosong");
        }

        const formDetail = detail.map((item: AccProposalApDetail, index: number) => {
            return {
                ...item,
                nomor_ap: nomorFix,
                urut: index + 1,
            };
        });

        const validateDetail = formDetail.map((item: AccProposalApDetail, index: number) => {
            return insertAccProposalApDetailSchema.parse(item);
        });

        const data = await createAccProposalAp(validate, validateDetail);
        res.status(200).json({
            message: "Success Create Acc Proposal Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nomor, detail, ...rest } = req.body;

        const validate = insertAccProposalApSchema.parse({
            nomor,
            ...rest,
        });

        const formDetail = detail.map((item: AccProposalApDetail, index: number) => {
            return {
                ...item,
                urut: index + 1,
            };
        });

        const validateDetail = formDetail.map((item: any) => {
            return insertAccProposalApDetailSchema.parse(item);
        });

        const data = await updateAccProposalAp(parseInt(req.params.id), validate, validateDetail);
        res.status(200).json({
            message: "Success Update Acc Proposal Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteAccProposalAp(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Delete Acc Proposal Ap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAccProposalApDetail({ id_kontak: parseInt(req.params.id) });
        res.status(200).json({
            message: "Success Get Proposal Ap Detail",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const showDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAccProposalApDetailById(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Get Proposal Ap Detail By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const storeDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertAccProposalApDetailSchema.parse(req.body);
        const data = await createAccProposalApDetail(validate);
        res.status(200).json({
            message: "Success Create Proposal Ap Detail",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertAccProposalApDetailSchema.parse(req.body);
        const data = await updateAccProposalApDetail(parseInt(req.params.id), validate);
        res.status(200).json({
            message: "Success Update Proposal Ap Detail",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroyDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteAccProposalApDetail(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Delete Proposal Ap Detail",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
