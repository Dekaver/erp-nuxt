// import { NextFunction, Request, Response } from "express";
// import { MyRequest } from "../../../middleware/authMiddleware";
// import { insertQuotationSettingSchema, updateQuotationSettingSchema } from "./schema";
// import { createQuotationSetting, getQuotationSettings, updateQuotationSetting } from "./service";
// import { io } from "../../../app";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getQuotationSettings();
//         res.status(200).json({
//             message: "Success Get Quotation Setting",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;

//         const validate = insertQuotationSettingSchema.parse({
//             ...rest,
//             created_by: req.user?.id,
//             updated_by: req.user?.id,
//         });
//         const data = await createQuotationSetting(validate);

//         io.emit("update-settings");

//         res.status(200).json({
//             message: "Success Create Quotation Settin",
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
//         const validate = updateQuotationSettingSchema.parse({
//             ...rest,
//             updated_by: req.user?.id,
//         });

//         const data = await updateQuotationSetting(id, validate);
        
//         io.emit("update-settings");

//         res.status(200).json({
//             message: "Success Update Quotation Settin",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };