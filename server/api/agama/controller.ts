// import { NextFunction, Request, Response } from "express";
// import { createAgama, deleteAgama, getAgama, getAgamaById, updateAgama } from "../agama/service";
// import { insertAgamaSchema } from "../agama/schema";
// import { MyRequest } from "src/middleware/authMiddleware";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAgama();
//         return res.status(200).json({
//             message: "Success Get Agama",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAgamaById(req.user!.id);
//         return res.status(200).json({
//             message: "Success Get Agama",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertAgamaSchema.parse(req.body);

//         const data = await createAgama(validate);
//         return res.status(200).json({
//             message: "Success Create Agama",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertAgamaSchema.parse(req.body);

//         const data = await updateAgama(parseInt(req.params.id), validate);
//         return res.status(200).json({
//             message: "Success Update Agama",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteAgama(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Agama",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
