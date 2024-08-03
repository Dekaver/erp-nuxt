// import { NextFunction, Request, Response } from "express";
// import { createTop, deleteTop, getTop, getTopById, updateTop } from "./service";
// import { insertTopSchema, updateTopSchema } from "./schema";
// import { MyRequest } from "../../middleware/authMiddleware";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getTop();
//         return res.status(200).json({
//             message: "Success Get Top",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await getTopById(id);
//         return res.status(200).json({
//             message: "Success Get Top",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;
//         const validate = insertTopSchema.parse({
//             ...rest,
//             created_by: req.user?.id,
//             updated_by: req.user?.id,
//         });

//         const data = await createTop(validate);
//         return res.status(200).json({
//             message: "Success Create Top",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const { ...rest } = req.body;
//         const validate = updateTopSchema.parse({
//             ...rest,
//             updated_by: req.user?.id,
//         });

//         const data = await updateTop(id, validate);
//         return res.status(200).json({
//             message: "Success Update Top",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await deleteTop(id);
//         return res.status(200).json({
//             message: "Success Delete Top",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
