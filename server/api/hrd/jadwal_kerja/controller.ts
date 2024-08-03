import { NextFunction, Request, Response } from "express";

import { MyRequest } from "../../../middleware/authMiddleware";
import { NewJadwalKerjaKaryawan, NewJadwalKerjaWaktu, insertJadwalKerjaKaryawanSchema, insertJadwalKerjaSchema, insertJadwalKerjaWaktuSchema } from "./schema";
import {
    createJadwalKaryawan,
    createJadwalKerja,
    createJadwalWaktu,
    deleteJadwalKaryawan,
    deleteJadwalKerja,
    deleteJadwalWaktu,
    getJadwalKerja,
    getJadwalKerjaById,
    getPegawaiJadwal,
    updateJadwalKerja,
} from "./service";
import { ToString, formatDate } from "../../../libs/formater";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getJadwalKerja();
        res.status(200).json({
            message: "Success Get Jadwal Kerja",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const pegawaiJadwal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPegawaiJadwal();
        res.status(200).json({
            message: "Success Get Pegawai Jadwal Kerja",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getJadwalKerjaById(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Get Jadwal Kerja By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { detail, pegawai, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate = insertJadwalKerjaSchema.parse({
                ...rest,
                start_date: formatDate(rest.start_date)
            });

            const data = await createJadwalKerja(validate, tx);

            const validateDetail = detail.map((item: NewJadwalKerjaWaktu, _: number) => {
                return insertJadwalKerjaWaktuSchema.parse({
                    ...item,
                    id_jadwal_kerja: data.id,
                });
            });

            const dataDetail = await createJadwalWaktu(validateDetail, tx);

            const validatePegawaiJadwal = pegawai.map((item: NewJadwalKerjaKaryawan, _: number) => {
                return insertJadwalKerjaKaryawanSchema.parse({
                    id_jadwal_kerja: data.id,
                    id_pegawai: item.id_pegawai,
                });
            });

            const dataPegawaiJadwal = await createJadwalKaryawan(validatePegawaiJadwal, tx);

            return { ...data, ...dataDetail, ...dataPegawaiJadwal };
        });

        res.status(200).json({
            message: "Success Create Jadwal Kerja",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { detail, pegawai, ...rest } = req.body;
        const id = parseInt(req.params.id);

        const data = await db.transaction(async (tx) => {
            const validate = insertJadwalKerjaSchema.parse({
                ...rest,
                start_date: formatDate(rest.start_date)
            });

            const data = await updateJadwalKerja(id, validate, tx);

            const validateDetail = detail.map((item: NewJadwalKerjaWaktu, _: number) => {               
                return insertJadwalKerjaWaktuSchema.parse({
                    ...item,
                    id_jadwal_kerja: data.id

                });
            });

            // DELETE ALL DATA FROM JADWAL WAKTU WHERE id
            await deleteJadwalWaktu(id, tx)
            const dataDetail = await createJadwalWaktu(validateDetail, tx);

            const validatePegawaiJadwal = pegawai.map((item: NewJadwalKerjaKaryawan, _: number) => {
                return insertJadwalKerjaKaryawanSchema.parse({
                    id_jadwal_kerja: data.id,
                    id_pegawai: item.id_pegawai,
                });
            });

            // DELETE ALL DATA FROM JADWAL KARYAWAN WHERE id
            await deleteJadwalKaryawan(id, tx)
            const dataPegawaiJadwal = await createJadwalKaryawan(validatePegawaiJadwal, tx);

            return { ...data, ...dataDetail, ...dataPegawaiJadwal };
        });

        res.status(200).json({
            message: "Success Edit Jadwal Kerja",
            data: data,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const data = await deleteJadwalKerja(id);
        await deleteJadwalKaryawan(id);
        await deleteJadwalWaktu(id);

        res.status(200).json({
            message: "Success Delete Jadwal Kerja",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
