import { NextFunction, Request, Response } from "express";
import { getDataReportHutangSupplier, getDataReportPembelian, getDataReportPembelianProduk, getDataReportPembelianSupplier, getDataReportPenerimaanBarang } from "./service";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import { formatNumber, formatDate } from "../../../libs/formater";
import { z } from "zod";

export const getReportPembelian = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { awal, akhir, id_supplier, status } = req.query;
        const data = await getDataReportPembelian(awal as string, akhir as string, id_supplier as string, status as string);
        res.status(200).json({
            message: "Success",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getReportHutangSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { awal, akhir, id_supplier } = req.query;
        const data = await getDataReportHutangSupplier(awal as string, akhir as string, id_supplier as string);
        res.status(200).json({
            message: "Success",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getReportPenerimaanBarang = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { awal, akhir, id_gudang, id_supplier } = req.query;
        const data = await getDataReportPenerimaanBarang(awal as string, akhir as string, id_gudang as string, id_supplier as string);
        res.status(200).json({
            message: "Success",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getReportPembelianProduk = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { awal, akhir, id_kategori } = req.query;
        const data = await getDataReportPembelianProduk(awal as string, akhir as string, id_kategori as string);
        res.status(200).json({
            message: "Success",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getReportPembelianSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { awal, akhir, id_supplier } = req.query;
        const data = await getDataReportPembelianSupplier(awal as string, akhir as string, id_supplier as string);
        res.status(200).json({
            message: "Success",
            data: data.data,
            total: data.total,
        });
    } catch (error) {
        console.log(error, 'error')
        next(error);
    }
};
