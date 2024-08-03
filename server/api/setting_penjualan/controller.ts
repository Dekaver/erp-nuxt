// import { NextFunction, Request, Response } from "express";
// import { MyRequest } from "../../middleware/authMiddleware";
// import { insertSettingPenjualanSchema } from "./schema";
// import { createSettingPenjualan, deleteSettingPenjualan, getSettingPenjualan, updateSettingPenjualan } from "./service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getSettingPenjualan();
//         res.status(200).json({
//             message: "Success Get Setting Penjualan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;

//         const validate = insertSettingPenjualanSchema.parse({
//             ...rest,
//             created_by: req.user?.id,
//             updated_by: req.user?.id,
//         });
//         const data = await createSettingPenjualan(validate);
//         res.status(200).json({
//             message: "Success Create Setting Penjualan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;
        
//         const validate = insertSettingPenjualanSchema.parse({
//             ...rest,
//             updated_by: req.user?.id,
//         });

//         const data = await updateSettingPenjualan(validate);

//         res.status(200).json({
//             message: "Success Update Setting Penjualan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteSettingPenjualan();

//         res.status(200).json({
//             message: "Success Delete Setting Penjualan",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
