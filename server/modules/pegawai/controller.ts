import { NextFunction, Request, Response } from "express";
import {
    createPegawai,
    deletePegawai,
    getPegawai,
    getOptionPegawai,
    getPegawaiById,
    updatePegawai,
    getAvailablePegawai,
    updateFotoPegawai,
    getFotoPegawai,
    updateTTDPegawai,
    getTTDPegawai,
} from "../pegawai/service";
import { NewPegawai, insertPegawaiSchema } from "./schema";
import { ToString } from "../../../libs/formater";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPegawai(req.query);
        return res.status(200).json({
            message: "Success Get Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOption = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getOptionPegawai();
        return res.status(200).json({
            message: "Success Get Option Barang",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOptionAvailablePegawai = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAvailablePegawai();
        res.status(200).json({
            message: "Success Get Available Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPegawaiById(parseInt(req.params.id_pegawai));
        return res.status(200).json({
            message: "Success Get Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertPegawaiSchema.parse({
            ...req.body,
            tinggi_badan: ToString(req.body.tinggi_badan),
            berat_badan: ToString(req.body.berat_badan),
            anak_ke: ToString(req.body.anak_ke),
        });
        if (validate.alamat_sama) {
            validate.alamat_domisili = validate.alamat_ktp;
            validate.provinsi_domisili = validate.provinsi_ktp;
            validate.kabupaten_domisili = validate.kabupaten_ktp;
            validate.kecamatan_domisili = validate.kecamatan_ktp;
            // validate.kelurahan_domisili = validate.kelurahan_ktp;
            validate.kodepos_domisili = validate.kodepos_ktp;
        }
        validate.id_level = 1;
        const data = await createPegawai(validate);
        return res.status(200).json({
            message: "Success Create Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertPegawaiSchema.parse({
            ...req.body,
            tinggi_badan: ToString(req.body.tinggi_badan),
            berat_badan: ToString(req.body.berat_badan),
            anak_ke: ToString(req.body.anak_ke),
        });

        const data = await updatePegawai(parseInt(req.params.id_pegawai), validate);
        return res.status(200).json({
            message: "Success Update Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deletePegawai(parseInt(req.params.id_pegawai));
        return res.status(200).json({
            message: "Success Delete Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateFoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await updateFotoPegawai(req.body.fotonya, parseInt(req.params.id_pegawai));
        res.status(200).json({
            message: "Success Update Foto Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getFoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getFotoPegawai(parseInt(req.params.id_pegawai));
        res.status(200).json({
            message: "Success Get Foto Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTTD = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await updateTTDPegawai(req.body.ttd, parseInt(req.params.id_pegawai));
        res.status(200).json({
            message: "Success Update TTD Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getTTD = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getTTDPegawai(parseInt(req.params.id_pegawai));
        res.status(200).json({
            message: "Success Get TTD Pegawai",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
