// import { NextFunction, Request, Response } from "express";
// import { getDataReportPenjualan, getDataReportPenjualanProduk, getDataReportPenjualanCustomer } from "./service";
// import puppeteer from "puppeteer";
// import path from "path";
// import fs from "fs";
// import ejs from "ejs";
// import { formatNumber, formatDate } from "../../../libs/formater";
// import { z } from "zod";

// export const getReportPenjualan = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { awal, akhir, id_customer, status } = req.query;
//         const data = await getDataReportPenjualan(awal as string, akhir as string, id_customer as string, status as string);
//         res.status(200).json({
//             message: "Success",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getReportPenjualanProduk = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { awal, akhir, id_kategori } = req.query;
//         const data = await getDataReportPenjualanProduk(awal as string, akhir as string, id_kategori as string);
//         res.status(200).json({
//             message: "Success",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getReportPenjualanCustomer = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { awal, akhir, id_customer } = req.query;
//         const data = await getDataReportPenjualanCustomer(awal as string, akhir as string, id_customer as string);
//         res.status(200).json({
//             message: "Success",
//             data: data.data,
//             total: data.total,
//         });
//     } catch (error) {
//         console.log(error, 'error')
//         next(error);
//     }
// };
