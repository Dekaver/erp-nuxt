// import { NextFunction, Request, Response } from "express";
// import { createJabatan, deleteJabatan, getJabatan, getJabatanByAtasan, getJabatanById, getJabatanAtasan, updateJabatan } from "../jabatan/service";
// import { insertJabatanSchema } from "../jabatan/schema";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getJabatan();
//         return res.status(200).json({
//             message: "Success Get Jabatan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getJabatanById(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get Jabatan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertJabatanSchema.parse(req.body);

//         const data = await createJabatan(validate);
//         return res.status(200).json({
//             message: "Success Create Jabatan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;
//         const form = {
//             ...rest,
//         };
//         const validate = insertJabatanSchema.parse(form);

//         const data = await updateJabatan(parseInt(req.params.id), validate);
//         return res.status(200).json({
//             message: "Success Update Jabatan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteJabatan(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Jabatan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexAtasan = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getJabatanAtasan();
//         return res.status(200).json({
//             message: "Success Get Atasan Jabatan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const showAtasan = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getJabatanByAtasan(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get Atasan Jabatan By Id",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
