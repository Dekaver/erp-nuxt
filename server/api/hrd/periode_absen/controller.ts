import { NextFunction, Request, Response } from "express";

import { NewAbsenPeriode, insertAbsenPeriodeSchema } from "./schema";
import { createAbsenPeriode, deleteAbsenPeriode, getAbsenPeriode, getAbsenPeriodeByYear } from "./service";
import { formatDate, formatDate2 } from "../../../libs/formater";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAbsenPeriode();
        return res.status(200).json({
            message: "Success Get Periode Absen",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAbsenPeriodeByYear(req.params.year);
        return res.status(200).json({
            message: "Success Get Periode Absen",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { periodeAbsen } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate = periodeAbsen.map((item: NewAbsenPeriode, _: number) => {
                return insertAbsenPeriodeSchema.parse({
                    ...item,
                    month: periodeAbsen.month,
                    start: formatDate(periodeAbsen.start),
                    end_date: formatDate(periodeAbsen.end_date),
                });
            });
            const data = await createAbsenPeriode(validate, tx);

            return data;
        });

        return res.status(200).json({
            message: "Success Update Periode Absen",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { detail } = req.body;
        const year = req.params.year;
        console.log(detail)

        const data = await db.transaction(async (tx) => {
            await deleteAbsenPeriode(year, tx);

            const formattedDetail = detail.map((item: any) => {
                return {
                    ...item,
                    start: formatDate2(item.start),
                    end_date: formatDate2(item.end_date),
                }
            })
            console.log(formattedDetail)

            const validate = formattedDetail.map((item: NewAbsenPeriode, _: number) => {
                return insertAbsenPeriodeSchema.parse({
                    ...item,
                });
            });
            const data = await createAbsenPeriode(validate, tx);

            return data;
        });

        return res.status(200).json({
            message: "Success Update Periode Absen",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteAbsenPeriode(req.params.year);
        return res.status(200).json({
            message: "Success Delete Absen Periode",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
