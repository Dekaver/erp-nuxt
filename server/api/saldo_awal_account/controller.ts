// import { NextFunction, Request, Response } from "express";

// import { insertAccValueSchema } from "../accounting/schema";
// import { NewInitialAccount, UpdateInitialAccount, insertInitialAccountSchema, updateInitialAccountSchema } from "./schema";
// import { getInitialAccount, getInitialAccountById, createInitialAccount, updateInitialAccount, deleteInitialAccount } from "./service";
// import { MyRequest } from "../../middleware/authMiddleware";
// import { getSettingAkuntansi } from "../setting_akuntansi/service";
// import { updateAccAkhir } from "../accounting/service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const settingYears = await getSettingAkuntansi();
//         if (!settingYears.year) {
//             throw ValidationError('Setting akuntansi year is not defined')
//         }
//         const data = await getInitialAccount(settingYears.year);
//         res.status(200).json({
//             message: "Success Get Initial Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getInitialAccountById(parseInt(req.params.id));
//         res.status(200).json({
//             message: "Success Get Initial Account By Id",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { category, ...rest } = req.body;
//         const form: NewInitialAccount = {
//             id_account: rest.id_account,
//             amount: ToString(category > 1 ? rest.kredit : rest.debit) as string,
//             created_by: req.user!.id,
//             updated_by: req.user!.id,
//         };
//         const settingYears = await getSettingAkuntansi();
//         if (!settingYears.year) {
//             throw ValidationError('Setting akuntansi year is not defined')
//         }
//         const validate = insertInitialAccountSchema.parse(form);
//         // TODO: validate acc_value
//         const formAccValue = {
//             years: settingYears.year,
//             id_account: validate.id_account,
//             db0: ToString(rest.debit) as string,
//             cr0: ToString(rest.kredit) as string,
//         };
//         const validateAccValue = insertAccValueSchema.parse(formAccValue);
//         const data = await createInitialAccount(validate, validateAccValue);
//         res.status(200).json({
//             message: "Success Create Initial Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id = parseInt(req.params.id);
//         const { category, ...rest } = req.body;
//         const form: UpdateInitialAccount = {
//             id_account: rest.id_account,
//             amount: ToString(category > 1 ? rest.kredit : rest.debit) as string,
//             updated_by: req.user!.id,
//         };
//         const settingYears = await getSettingAkuntansi();
//         if (!settingYears.year) {
//             throw ValidationError('Setting akuntansi year is not defined')
//         }
//         const validate = updateInitialAccountSchema.parse(form);
//         // TODO: validate acc_value
//         const formAccValue = {
//             years: settingYears.year,
//             id_account: validate.id_account,
//             db0: ToString(rest.debit) as string,
//             cr0: ToString(rest.kredit) as string,
//         };
//         const validateAccValue = insertAccValueSchema.parse(formAccValue);
//         const data = await updateInitialAccount(id, validate, validateAccValue);

//         res.status(200).json({
//             message: "Success Create Initial Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteInitialAccount(parseInt(req.params.id));
//         res.status(200).json({
//             message: "Success Delete Initial Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
