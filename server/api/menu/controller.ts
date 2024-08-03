// import { NextFunction, Request, Response } from "express";
// import { createMenu, deleteMenu, getMenu, getMenuById, getMenuByOutcome, getMenuChildByParent, getMenuChildByParents, getMenuOption, updateMenu } from "../menu/service";
// import { insertMenuSchema } from "../menu/schema";
// 
// import { MyRequest } from "../../middleware/authMiddleware";

// export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const type = req.query.type;
//         const options = req.query.options;
//         if (type == "option") {
//             const data = await getMenuOption(options, req.user?.id);
//             return res.status(200).json({
//                 message: "Success Get Menu",
//                 data: data,
//             });
//         }
//         const data = await getMenu();
//         return res.status(200).json({
//             message: "Success Get Menu",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getMenuById(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get Menu",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const getMenuByName = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await db.transaction(async (tx) => {
//             const menu = await getMenuByOutcome(req.params.name, tx);
//             const data = await getMenuChildByParent(menu.id, req.user?.id,tx);
//             if (data.length == 0) {
//                 return data;
//             }
//             const dataChild = await getMenuChildByParents(data.map((child) => child.id), tx);
//             return [...data, ...dataChild];
//         });
//         return res.status(200).json({
//             message: "Success Get Menu",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;
//         const validate = insertMenuSchema.parse({
//             ...rest,
//         });

//         const data = await createMenu(validate);
//         return res.status(200).json({
//             message: "Success Create Menu",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id)
//         const validate = insertMenuSchema.parse(req.body);

//         const data = await updateMenu(id, validate);
//         return res.status(200).json({
//             message: "Success Update Menu",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteMenu(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Menu",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
