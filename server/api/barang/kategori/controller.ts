// import { NextFunction, Request, Response } from "express";
// import { createKategoriBarang, deleteKategoriBarang, getKategoriBarang, getKategoriBarangById, updateKategoriBarang } from "./service";
// import { insertKategoriBarangSchema } from "./schema";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getKategoriBarang();
//         return res.status(200).json({
//             message: "Success Get KategoriBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getKategoriBarangById(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get KategoriBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertKategoriBarangSchema.parse(req.body);

//         const data = await createKategoriBarang(validate);
//         return res.status(200).json({
//             message: "Success Create KategoriBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertKategoriBarangSchema.parse(req.body);

//         const data = await updateKategoriBarang(parseInt(req.params.id), validate);
//         return res.status(200).json({
//             message: "Success Update KategoriBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteKategoriBarang(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete KategoriBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
