import { NextFunction, Request, Response } from "express";

import { ToString, formatDate } from "../../../libs/formater";
import { MyRequest } from "../../../middleware/authMiddleware";
import { NewLembur, NewLemburPersetujuan, insertLemburKaryawanSchema, insertLemburMasterSchema, insertLemburMultiplierSchema, insertLemburPersetujuanSchema, insertLemburSchema } from "./schema";
import {
    createLembur,
    createLemburApproval,
    createLemburKaryawan,
    createLemburMaster,
    createLemburMultiplier,
    deleteLemburKaryawan,
    deleteLemburMaster,
    deleteLemburMultiplier,
    getKebijakanLemburById,
    getLemburKaryawan,
    getLemburKaryawanById,
    getLemburMaster,
    getPegawaiLembur,
    updateKebijakanLembur,
    updateLembur as updateLemburMaster,
} from "./service";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getLemburKaryawan(req.query.status as string);
        return res.status(200).json({
            message: "Success Get Lembur Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getLemburKaryawanById(parseInt(req.params.id_lembur_karyawan));
        return res.status(200).json({
            message: "Success Get Lembur Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const rest = req.body;

        const validate: NewLembur = insertLemburSchema.parse({
            tanggal: formatDate(rest.tanggal),
            id_pegawai: rest.id_pegawai,
            hour_before: rest.hour_before,
            hour_after: rest.hour_after,
            minutes_after: rest.minutes_after,
            keterangan: rest.keterangan,
            status: rest.status,
            keterangan_status: rest.keterangan_status,
            id_lembur: rest.id_lembur,
            create_by: req.user!.id,
            nomor: rest.nomor,
            revisi: rest.revisi,
        });

        const data = await createLembur(validate);
        const lemburApproval: NewLemburPersetujuan = insertLemburPersetujuanSchema.parse({
            id_lembur_karyawan: data.id,
            id_pegawai: req.user?.id,
            revisi: 0,
        });
        await createLemburApproval(lemburApproval);
        return res.status(200).json({
            message: "Success Create Lembur Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertLemburMasterSchema.parse(req.body);

        const data = await updateLemburMaster(validate);
        return res.status(200).json({
            message: "Success Update Lembur Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteLemburKaryawan(parseInt(req.params.id_lembur_karyawan));
        return res.status(200).json({
            message: "Success Delete Lembur Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getKaryawanLembur = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPegawaiLembur();

        return res.status(200).json({
            message: "Success Get Lembur Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getKebijakanLembur = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getLemburMaster();

        return res.status(200).json({
            message: "Success Get Lembur Master",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const createMasterLembur = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { pegawai, multiplier, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate = insertLemburMasterSchema.parse({
                ...rest,
                biaya: rest.biaya === null ? "0" : ToString(rest.biaya),
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
                updated_by: req.user?.id,
            });

            const data = await createLemburMaster(validate, tx);

            if (pegawai.length !== 0) {
                const validateLemburJabatan = pegawai.map((item: any, _: number) => {
                    return insertLemburKaryawanSchema.parse({
                        id_lembur: data.id,
                        id_pegawai: item.id_pegawai,
                    });
                });

                const dataKaryawan = await createLemburKaryawan(validateLemburJabatan, tx);

                const validateLemburMultiplier = multiplier.map((item: any, _: number) => {
                    return insertLemburMultiplierSchema.parse({
                        ...item,
                        id_lembur: data.id,
                        urut: parseFloat(item.urut),
                        mulai: parseFloat(item.mulai),
                        selesai: parseFloat(item.selesai),
                    });
                });

                const dataMultiplier = await createLemburMultiplier(validateLemburMultiplier, tx);

                return { ...data, ...dataKaryawan, ...dataMultiplier };
            } else {
                const validateLemburMultiplier = multiplier.map((item: any, _: number) => {
                    return insertLemburMultiplierSchema.parse({
                        ...item,
                        id_lembur: data.id,
                        urut: parseFloat(item.urut),
                        mulai: parseFloat(item.mulai),
                        selesai: parseFloat(item.selesai),
                    });
                });

                const dataMultiplier = await createLemburMultiplier(validateLemburMultiplier, tx);

                return { ...data, ...dataMultiplier };
            }
        });

        res.status(200).json({
            message: "Success Create Kebijakan Lembur",
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
            const data = await deleteLemburMaster(id, tx);
            await deleteLemburKaryawan(id, tx);
            await deleteLemburMultiplier(id, tx);

            return data;
        });

        res.status(200).json({
            message: "Success Delete Kebijakan Lembur",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMasterLembur = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { pegawai, multiplier, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate = insertLemburMasterSchema.parse({
                ...rest,
                biaya: rest.biaya === null ? "0" : ToString(rest.biaya),
                updated_at: new Date().toISOString(),
                updated_by: req.user?.id,
            });

            const data = await updateKebijakanLembur(id, validate, tx);

            if (pegawai.length !== 0) {
                await deleteLemburKaryawan(data.id, tx);
                const validateLemburJabatan = pegawai.map((item: any, _: number) => {
                    return insertLemburKaryawanSchema.parse({
                        id_lembur: data.id,
                        id_pegawai: item.id_pegawai,
                    });
                });

                const dataKaryawan = await createLemburKaryawan(validateLemburJabatan, tx);

                await deleteLemburMultiplier(data.id, tx);
                const validateLemburMultiplier = multiplier.map((item: any, _: number) => {
                    return insertLemburMultiplierSchema.parse({
                        ...item,
                        id_lembur: data.id,
                        urut: parseFloat(item.urut),
                        mulai: parseFloat(item.mulai),
                        selesai: parseFloat(item.selesai),
                    });
                });

                const dataMultiplier = await createLemburMultiplier(validateLemburMultiplier, tx);

                return { ...data, ...dataKaryawan, ...dataMultiplier };
            } else {
                await deleteLemburKaryawan(data.id, tx);
                await deleteLemburMultiplier(data.id, tx);
                const validateLemburMultiplier = multiplier.map((item: any, _: number) => {
                    return insertLemburMultiplierSchema.parse({
                        ...item,
                        id_lembur: data.id,
                        urut: parseFloat(item.urut),
                        mulai: parseFloat(item.mulai),
                        selesai: parseFloat(item.selesai),
                    });
                });

                const dataMultiplier = await createLemburMultiplier(validateLemburMultiplier, tx);

                return { ...data, ...dataMultiplier };
            }
        });

        res.status(200).json({
            message: "Success Edit Kebijakan Lembur",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getKebijakanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const data = await getKebijakanLemburById(id);

        return res.status(200).json({
            message: "Success Get Kebijakan Lembur",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
