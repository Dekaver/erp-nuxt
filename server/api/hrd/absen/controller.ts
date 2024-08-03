import { NextFunction, Request, Response } from "express";
import { formatDate2 } from "../../../libs/formater";
import { MyRequest } from "../../../middleware/authMiddleware";
import {
    checkCoordinate,
    clockIn,
    clockOut,
    createAbsen,
    deleteAbsen,
    get,
    getAbsenToday,
    getAktivitasAbsen,
    getRecapPerDaysKaryawan,
    getRecapPerMonthCalendar,
    getRecapPerMonthKaryawan,
    getRecapPerMonthKaryawanWebsite,
    getStatisticsEmployee,
    updateKeterangan,
} from "./service";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { month, year } = req.query;
        const data = await get(req.user!.id, parseInt(month as string), parseInt(year as string));

        if (data.length == 0) {
            return res.status(404).json({
                message: "Data Tidak Ditemukan",
            });
        }

        return res.status(200).json({
            message: "Success Get Absen Recap",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { tanggal, id, keterangan, catatan } = req.body;

        const data = await createAbsen(parseInt(id as string), formatDate2(tanggal), keterangan, catatan);
        return res.status(200).json({
            message: "Success Create Absen",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tanggal, id, keterangan, catatan} = req.body;

        const data = await updateKeterangan(parseInt(id as string), formatDate2(tanggal), keterangan, catatan);
        return res.status(200).json({
            message: "Success Edit Absen",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tanggal, id } = req.body;

        console.log(id)
        const data = await deleteAbsen(parseInt(id as string), formatDate2(tanggal));
        return res.status(200).json({
            message: "Success Delete Absen",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const absenToday = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getAbsenToday(parseInt((req.user!.id).toString()));

        return res.status(200).json({
            message: "Success Get Absen Hari ini",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getAktivitas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { month, year, id } = req.query;
        const data = await getAktivitasAbsen(parseInt(id as string), parseInt(month as string), parseInt(year as string));

        if (data.length == 0) {
            return res.status(404).json({
                message: "Data Tidak Ditemukan",
            });
        }

        return res.status(200).json({
            message: "Success Get Aktivitas Absen",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const checkAbsenCoordinate = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude } = req.query;

        const data = await checkCoordinate(parseFloat(latitude as string), parseFloat(longitude as string));

        if (data == undefined) {
            return res.status(400).json({
                message: "Jarak Anda Jauh dari Semua Tempat Absen",
            });
        }

        return res.status(200).json({
            message: "Success Get Absen Hari ini",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const recapEmployeesPerMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { month, year, id } = req.query;

        const userId = id != undefined ? parseInt(id as string) : undefined;

        const data = await getRecapPerMonthKaryawan(userId, parseInt(month as string), parseInt(year as string));
        return res.status(200).json({
            message: "Success Get Absen Recap Semua Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const recapEmployeesPerMonthWebsite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { month, year } = req.query;

        const data = await getRecapPerMonthKaryawanWebsite(parseInt(month as string), parseInt(year as string));
        return res.status(200).json({
            message: "Success Get Absen Recap Semua Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const recapStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { month, year } = req.query;
        const { id } = req.params;

        const data = await getStatisticsEmployee(parseInt(id as string), parseInt(month as string), parseInt(year as string));
        return res.status(200).json({
            message: "Success Get Absen Recap Semua Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const recapEmployeesPerDays = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, status } = req.query;

        const statusRecap = status != undefined ? parseInt(status as string) : undefined;

        const data = await getRecapPerDaysKaryawan(statusRecap, date as string);

        return res.status(200).json({
            message: "Success Get Absen Recap Semua Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const recapCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const data = await getRecapPerMonthCalendar(parseInt(id as string));

        return res.status(200).json({
            message: "Success Get Absen Recap Calendar Karyawan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const postClockIn = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude } = req.body;

        const getAbsenTempat = await checkCoordinate(parseFloat(latitude as string), parseFloat(longitude as string));
        if (getAbsenTempat === undefined) {
            return res.status(400).json({
                message: "Jarak dengan absensi sangat jauh",
            });
        }

        const data = await clockIn(req.user!.id, getAbsenTempat as number, latitude, longitude, req.file?.path);

        return res.status(200).json({
            message: "Success Absen Masuk",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const postClockOut = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude } = req.body;

        const getAbsenTempat = await checkCoordinate(parseFloat(latitude as string), parseFloat(longitude as string));
        if (getAbsenTempat === undefined) {
            return res.status(400).json({
                message: "Jarak dengan absensi sangat jauh",
            });
        }

        const data = await clockOut(req.user!.id, latitude, longitude, req.file?.path);

        return res.status(200).json({
            message: "Success Absen Masuk",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
