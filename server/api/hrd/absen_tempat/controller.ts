// import { NextFunction, Request, Response } from "express";
// import { MyRequest } from "../../../middleware/authMiddleware";
// import { NewAbsenTempat, insertAbsenTempatSchema } from "./schema";
// import { create, deleteAbsenTempat, get, getById, update } from "./service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await get();
//         return res.status(200).json({
//             message: "Success Get Absen Tempat",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getById(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get Absen Tempat",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const validate: NewAbsenTempat = insertAbsenTempatSchema.parse(req.body);

//         const data = await create(validate);
//         return res.status(200).json({
//             message: "Success Create Absen Tempat",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const updateAbsenTempat = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertAbsenTempatSchema.parse(req.body);

//         const data = await update(validate);
//         return res.status(200).json({
//             message: "Success Update Absen Tempat",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteAbsenTempat(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Absen Tempat",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
