// import { NextFunction, Request, Response } from "express";
// import { MyRequest } from "../../../middleware/authMiddleware";
// import { insertPenerimaanBarangSettingSchema, updatePenerimaanBarangSettingSchema } from "./schema";
// import { createPenerimaanBarangSetting, getPenerimaanBarangSettings, updatePenerimaanBarangSetting } from "./service";
// import { io } from "../../../app";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getPenerimaanBarangSettings();
//         res.status(200).json({
//             message: "Success Get Pesanan Pembelian Settings",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;

//         const validate = insertPenerimaanBarangSettingSchema.parse({
//             ...rest,
//             created_by: req.user?.id,
//             updated_by: req.user?.id,
//         });
//         const data = await createPenerimaanBarangSetting(validate);
//         io.emit("update-settings");
//         res.status(200).json({
//             message: "Success Create Pesanan Pembelian Setting",
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
//         const validate = updatePenerimaanBarangSettingSchema.parse({
//             ...rest,
//             updated_by: req.user?.id,
//         });

//         const data = await updatePenerimaanBarangSetting(id, validate);
//         io.emit("update-settings");

//         res.status(200).json({
//             message: "Success Update Pesanan Pembelian Setting",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
