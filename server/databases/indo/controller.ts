import { NextFunction, Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { provinces, cities, districts, subdistricts, postalcode } from "./schema";
import db from "../../../libs/db";

export const indexProvinsi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.select().from(provinces);
        res.status(200).json({
            message: "Success Get Provinsi",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexKota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.select().from(cities);
        res.status(200).json({
            message: "Success Get Kota",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexKecamatan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.select().from(districts);
        res.status(200).json({
            message: "Success Get Kecamatan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexKelurahan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.select().from(subdistricts);
        res.status(200).json({
            message: "Success Get Kelurahan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
export const indexKodePos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db.select().from(postalcode);
        res.status(200).json({
            message: "Success Get Kode Pos",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexKotaByProvinsi = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db
            .select()
            .from(cities)
            .where(eq(cities.prov_id, parseInt(req.params.id)));
        res.status(200).json({
            message: "Success Get Kota",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexKecamatanByKota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db
            .select()
            .from(districts)
            .where(eq(districts.city_id, parseInt(req.params.id)));
        res.status(200).json({
            message: "Success Get Kecamatan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexKelurahanByKecamatan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db
            .select()
            .from(subdistricts)
            .where(eq(subdistricts.dis_id, parseInt(req.params.id)));
        res.status(200).json({
            message: "Success Get Kelurahan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexKodePosByKecamatan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await db
            .select()
            .from(postalcode)
            .where(eq(postalcode.dis_id, parseInt(req.params.id)));
        res.status(200).json({
            message: "Success Get Kode Pos",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const showCompleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_provinsi, id_kabupaten, id_kecamatan } = req.params;
        const [data] = await db
            .select()
            .from(provinces)
            .leftJoin(cities, eq(provinces.prov_id, cities.prov_id))
            .leftJoin(districts, eq(cities.city_id, districts.city_id))
            .where(and(eq(provinces.prov_id, parseInt(id_provinsi)), eq(cities.city_id, parseInt(id_kabupaten)), eq(districts.dis_id, parseInt(id_kecamatan))));
        res.status(200).json({
            message: "Success Operation",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
