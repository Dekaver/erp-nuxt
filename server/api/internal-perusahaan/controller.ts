// import { NextFunction, Request, Response } from "express";
// import { createInternalPerusahaan, deleteInternalPerusahaan, getInternalPerusahaan, getInternalPerusahaanById, updateInternalPerusahaan } from "./service";
// import { insertInternalPerusahaanSchema } from "./schema";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getInternalPerusahaan();
//         res.status(200).json({
//             message: "Success Get Internal Perusahaan",
//             data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getInternalPerusahaanById(parseInt(req.params.id));
//         res.status(200).json({
//             message: "Success Get Internal Perusahaan By Id",
//             data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const form = req.body;
//         const validate = insertInternalPerusahaanSchema.parse(form);
//         const data = await createInternalPerusahaan(validate);
//         res.status(200).json({
//             message: "Success Create Internal Perusahaan",
//             data: data,
//         });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const form = req.body;
//         const validate = insertInternalPerusahaanSchema.parse(form);
//         const data = await updateInternalPerusahaan(parseInt(req.params.id), validate);
//         res.status(200).json({
//             message: "Success Update Internal Perusahaan",
//             data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteInternalPerusahaan(parseInt(req.params.id));
//         res.status(200).json({
//             message: "Success Delete Internal Perusahaan",
//             data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
