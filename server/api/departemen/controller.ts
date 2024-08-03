// import { NextFunction, Request, Response } from "express";
// import { createDepartemen, deleteDepartemen, getDepartemen, getDepartemenById, updateDepartemen } from "./service";
// import { insertDepartemenSchema } from "./schema";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getDepartemen();
//         return res.status(200).json({
//             message: "Success Get Departemen",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getDepartemenById(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get Departemen",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertDepartemenSchema.parse(req.body);

//         const data = await createDepartemen(validate);
//         return res.status(200).json({
//             message: "Success Create Departemen",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertDepartemenSchema.parse(req.body);

//         const data = await updateDepartemen(validate);
//         return res.status(200).json({
//             message: "Success Update Departemen",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteDepartemen(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Departemen",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
