import { NextFunction, Request, Response } from "express";

import { ToString } from "../../../libs/formater";
import { MyRequest } from "../../../middleware/authMiddleware";
import { insertCutiJabatanSchema, insertCutiSchema, insertCutiSubSchema } from "./schema";
import {
    approveCuti,
    create,
    createCutiJabatan,
    createCutiMaster,
    createSubCuti,
    deleteCuti,
    deleteCutiJabatan,
    deleteSubCuti,
    deleteSubCutiById,
    get,
    getApproval,
    getById,
    getCutiJabatan,
    getKebijakanCuti,
    getKebijakanCutiById,
    getMaster,
    getSub,
    updateCutiSub,
    updateKebijakanCuti,
} from "./service";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await get(req.user!.id, req.query.status);
        return res.status(200).json({
            message: "Success Get Cuti Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getCutiApproval = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getApproval(req.query.status);
        return res.status(200).json({
            message: "Success Get Approval Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getCutiById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get Cuti By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getCutiMaster = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getMaster();
        return res.status(200).json({
            message: "Success Get Cuti Master",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getCutiSub = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getSub(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get Cuti Master",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const createCuti = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await create(req, req.file?.path);
        return res.status(200).json({
            message: "Success Create Cuti Master",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCutiStatus = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await approveCuti(req);
        return res.status(200).json({
            message: "Success Update Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getJabatan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getCutiJabatan();
        return res.status(200).json({
            message: "Success Get Jabatan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getCutiKebijakan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getKebijakanCuti();
        return res.status(200).json({
            message: "Success Get Kebijakan Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const createMasterCuti = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { jabatan, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate = insertCutiSchema.parse({ ...rest, saldo: ToString(rest.saldo) });

            const data = await createCutiMaster(validate, tx);

            if (jabatan.length !== 0) {
                const validateCutiJabatan = jabatan.map((item: any, _: number) => {
                    return insertCutiJabatanSchema.parse({
                        id_cuti: data.id,
                        id_jabatan: item.id,
                    });
                });

                const dataJabatan = await createCutiJabatan(validateCutiJabatan, tx);

                return { ...data, ...dataJabatan };
            } else {
                return { ...data };
            }
        });

        res.status(200).json({
            message: "Success Create Kebijakan Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const createCutiSub = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate = insertCutiSubSchema.parse({ ...rest });

            const data = await createSubCuti(validate, tx);

            return { ...data };
        });

        res.status(200).json({
            message: "Success Create Sub Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroyKebijakan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const data = await db.transaction(async (tx) => {
            const data = await deleteCuti(id, tx);
            await deleteSubCuti(id, tx);
            await deleteCutiJabatan(id, tx);

            return data;
        });

        res.status(200).json({
            message: "Success Delete Kebijakan Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getKebijakanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const data = await getKebijakanCutiById(id);

        return res.status(200).json({
            message: "Success Get Kebijakan Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroySubCuti = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const data = await deleteSubCutiById(id);

        return res.status(200).json({
            message: "Success Delete Sub Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateSubCutiById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { ...rest } = req.body;

        const data = await updateCutiSub(id, rest);

        return res.status(200).json({
            message: "Success Update Sub Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMasterCuti = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { jabatan, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate = insertCutiSchema.parse({ ...rest, saldo: ToString(rest.saldo) });

            const data = await updateKebijakanCuti(id, validate, tx);

            if (jabatan.length !== 0) {
                await deleteCutiJabatan(id, tx);
                const validateCutiJabatan = jabatan.map((item: any, _: number) => {
                    return insertCutiJabatanSchema.parse({
                        id_cuti: data.id,
                        id_jabatan: item.id,
                    });
                });

                const dataJabatan = await createCutiJabatan(validateCutiJabatan, tx);

                return { ...data, ...dataJabatan };
            } else {
                return { ...data };
            }
        });

        res.status(200).json({
            message: "Success Edit Kebijakan Cuti",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
