// import { NextFunction, Request, Response } from "express";
// import { createHariLiburTipe, deleteHariLiburTipe, getHariLiburTipe, getHariLiburTipeByName, updateHariLiburTipe } from "./service";
// import { insertHariLiburTipeSchema } from "./schema";
// import { MyRequest } from "../../../../middleware/authMiddleware";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getHariLiburTipe();
//         res.status(200).json({
//             message: "Success Get Hari Libur Tipe",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getHariLiburTipeByName(req.params.nama);
//         res.status(200).json({
//             message: "Success Get HariLiburTipe By Id",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;

//         const validate = insertHariLiburTipeSchema.parse({
//             ...rest,
//             created_by: req.user?.id,
//             updated_by: req.user?.id,
//         });
//         const data = await createHariLiburTipe(validate);
//         res.status(200).json({
//             message: "Success Create Hari Libur Tipe",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;
//         const id = parseInt(req.params.id);
//         const validate = insertHariLiburTipeSchema.parse({
//             ...rest,
//             updated_by: req.user?.id,
//         });
//         const data = await updateHariLiburTipe(id, validate);
//         res.status(200).json({
//             message: "Success Create Hari Libur Tipe",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await deleteHariLiburTipe(id);
//         res.status(200).json({
//             message: "Success Delete Hari Libur Tipe",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
