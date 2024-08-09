// import { NextFunction, Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { provinces, cities, districts, subdistricts, postalcode } from "@/databases/indo/schema";

export const indexProvinsi = async () => {
    try {
        return await db.select().from(provinces);
    } catch (error) {
        return error
    }
};

export const indexKota = async () => {
    try {
        return await db.select().from(cities);
        
    } catch (error) {
        return (error);
    }
};

export const indexKecamatan = async () => {
    try {
        return await db.select().from(districts);
    } catch (error) {
        return (error);
    }
};

export const indexKelurahan = async () => {
    try {
        return await db.select().from(subdistricts);
    } catch (error) {
        return (error);
    }
};
export const indexKodePos = async () => {
    try {
        return await db.select().from(postalcode);
    } catch (error) {
        return (error);
    }
};

export const indexKotaByProvinsi = async (id: string) => {
    try {
        return await db
            .select()
            .from(cities)
            .where(eq(cities.prov_id, parseInt(id)));
    } catch (error) {
        return (error);
    }
};

export const indexKecamatanByKota = async (id: string) => {
    try {
        return await db
            .select()
            .from(districts)
            .where(eq(districts.city_id, parseInt(id)));
    } catch (error) {
        return (error);
    }
};

export const indexKelurahanByKecamatan = async (id: string) => {
    try {
        return await db
            .select()
            .from(subdistricts)
            .where(eq(subdistricts.dis_id, parseInt(id)));
    } catch (error) {
        return (error);
    }
};

export const indexKodePosByKecamatan = async (id: string) => {
    try {
        return await db
            .select()
            .from(postalcode)
            .where(eq(postalcode.dis_id, parseInt(id)));
        
    } catch (error) {
        return (error);
    }
};

interface CompleteAddress {
    id_provinsi: string;
    id_kabupaten: string;
    id_kecamatan: string;
}
export const showCompleteAddress = async (params: CompleteAddress) => {
    try {
        const { id_provinsi, id_kabupaten, id_kecamatan } = params;
        const [data] = await db
            .select()
            .from(provinces)
            .leftJoin(cities, eq(provinces.prov_id, cities.prov_id))
            .leftJoin(districts, eq(cities.city_id, districts.city_id))
            .where(and(eq(provinces.prov_id, parseInt(id_provinsi)), eq(cities.city_id, parseInt(id_kabupaten)), eq(districts.dis_id, parseInt(id_kecamatan))));
    } catch (error) {
        return (error);
    }
};
