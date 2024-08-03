// import { NextFunction, Request, Response } from "express";
// import { createStokAwalBarang, deleteStokAwalBarang, getStokAwalBarang, getStokAwalBarangById, updateStokAwalBarang } from "./service";
// import { insertStokAwalBarangSchema } from "./schema";

// import { MyRequest } from "../../middleware/authMiddleware";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getStokAwalBarang();
//         res.status(200).json({
//             message: "Success Get StokAwalBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getStokAwalBarangById(parseInt(req.params.id));
//         res.status(200).json({
//             message: "Success Get StokAwalBarang By Id",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { id, ...rest } = req.body;
//         const validate = insertStokAwalBarangSchema.parse({
//             ...rest,
//             qty: ToString(rest.qty),
//             hpp: ToString(rest.hpp),
//             created_by: req.user!.id,
//             updated_by: req.user!.id,
//         });
//         const data = await createStokAwalBarang(validate);
//         res.status(200).json({
//             message: "Success Create StokAwalBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;
//         const validate = insertStokAwalBarangSchema.parse({
//             ...rest,
//             qty: ToString(rest.qty),
//             hpp: ToString(rest.hpp),
//             created_by: req.user!.id,
//         });
//         const data = await updateStokAwalBarang(parseInt(req.params.id), validate);
//         res.status(200).json({
//             message: "Success Update StokAwalBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await db.transaction(async (tx) => {
//             return await deleteStokAwalBarang(id, tx);
//         });
//         res.status(200).json({
//             message: "Success Delete StokAwalBarang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
