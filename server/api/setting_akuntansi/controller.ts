// import { NextFunction, Request, Response } from "express";
// import { insertSettingAkuntansiSchema } from "./schema";
// import { createSettingAkuntansi, deleteSettingAkuntansi, getSettingAkuntansi, updateSettingAkuntansi } from "./service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getSettingAkuntansi();
//         res.status(200).json({
//             message: "Success Get Setting Akuntansi",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
        
//         const { ...rest } = req.body;
        
//         const validate = insertSettingAkuntansiSchema.parse({...rest, year: rest.year.toString() });
//         const data = await createSettingAkuntansi(validate);
//         res.status(200).json({
//             message: "Success Create Setting Akuntansi",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { ...rest } = req.body;

//         const validate = insertSettingAkuntansiSchema.parse(rest);
//         const data = await updateSettingAkuntansi(validate);
//         res.status(200).json({
//             message: "Success Update Setting Akuntansi",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteSettingAkuntansi();
//         res.status(200).json({
//             message: "Success Delete Setting Akuntansi",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
