// import { NextFunction, Request, Response } from "express";
// 
// import { nomorKasKeluar, nomorKasMasuk } from "../../libs/nomor";
// import { NewAccKas, insertAccKasSchema, AccKasDetail, insertAccKasDetailSchema } from "./schema";
// import { getAccKas, getAccKasById, createAccKas, updateAccKas, deleteAccKas } from "./service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { type } = req.query;
//         if (type && typeof type !== "string") {
//             throw ValidationError("type must be string");
//         } else if (type && type !== "I" && type !== "O") {
//             throw ValidationError("type must be I or O");
//         }
//         const data = await getAccKas(type as string);
//         res.status(200).json({
//             message: `Success Get Acc Kas${type ? (type === "I" ? " Masuk" : " Keluar") : ""}`,
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const data = await getAccKasById(parseInt(id));
//         res.status(200).json({
//             message: `Success Get Acc Kas ${data.type === "I" ? "Masuk" : "Keluar"} By Id`,
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id, reference, detail, ...rest } = req.body;

//         // rest.date = formatDate(rest.date);
//         const nomorFix = rest.type == "I" ? await nomorKasMasuk(rest.date) : await nomorKasKeluar(rest.date);
//         const form = {
//             ...rest,
//             reference: nomorFix,
//             total: ToString(rest.total),
//             date: formatDate(rest.date),
//         } as NewAccKas;
//         const validate = insertAccKasSchema.parse(form);

//         const formDetail = detail.map((item: AccKasDetail, index: number) => {
//             return {
//                 ...item,
//                 id: index, // Hanya untuk keperluan validasi
//                 line: index + 1,
//                 amount: ToString(item.amount),
//             };
//         });
//         const validateDetail = formDetail.map((item: AccKasDetail) => insertAccKasDetailSchema.parse(item));
//         const data = await createAccKas(validate, validateDetail);
//         res.status(200).json({
//             message: "Success Create Acc Kas",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const { ...rest } = req.body;
//         const form = {
//             ...rest,
//             total: ToString(rest.total),
//             date: formatDate(rest.date),
//         };
//         const validate = insertAccKasSchema.parse(form);

//         const formDetail = rest.detail.map((item: AccKasDetail, index: number) => {
//             return {
//                 ...item,
//                 id: index,
//                 line: index + 1,
//                 amount: ToString(item.amount),
//             };
//         });
//         const validateDetail = formDetail.map((item: AccKasDetail) => insertAccKasDetailSchema.parse(item));
//         const data = await updateAccKas(parseInt(id), validate, validateDetail);
//         res.status(200).json({
//             message: "Success Update Acc Kas",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const data = await deleteAccKas(parseInt(id));
//         res.status(200).json({
//             message: "Success Delete Acc Kas",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
