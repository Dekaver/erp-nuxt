// import { NextFunction, Request, Response } from "express";
// import { MyRequest } from "../../../middleware/authMiddleware";
// import { insertPaymentArSettingSchema, updatePaymentArSettingSchema } from "./schema";
// import { createPaymentArSetting, getPaymentArSettings, updatePaymentArSetting } from "./service";
// import { io } from "../../../app";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getPaymentArSettings();
//         res.status(200).json({
//             message: "Success Get Payment Ar Settings",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;

//         const validate = insertPaymentArSettingSchema.parse({
//             ...rest,
//             created_by: req.user?.id,
//             updated_by: req.user?.id,
//         });
//         const data = await createPaymentArSetting(validate);
//         io.emit("update-settings");
//         res.status(200).json({
//             message: "Success Create Payment Ar Setting",
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
//         const validate = updatePaymentArSettingSchema.parse({
//             ...rest,
//             updated_by: req.user?.id,
//         });

//         const data = await updatePaymentArSetting(id, validate);
//         io.emit("update-settings")

//         res.status(200).json({
//             message: "Success Update Payment Ar Setting",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
