// import { NextFunction, Request, Response } from "express";
// import {
//     createAccount,
//     deleteAccount,
//     generateAccountCode,
//     getAccount,
//     getAccountByCategory,
//     getAccountById,
//     getAccountByOption,
//     getAccountCashAble,
//     getAccountTransaction,
//     updateAccount,
//     getAccountByLevel,
//     getAccountOption,
// } from "./service";
// import { insertAccountSchema } from "./schema";
// import { updateAccValue } from "../accounting/service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { type, ...rest } = req.query;

//         if (type === "option") {
//             const data = await getAccountOption(rest);
//             return res.status(200).json({
//                 message: "Success Get Account",
//                 data: data,
//             });
//         }
//         const data = await getAccount();
//         return res.status(200).json({
//             message: "Success Get Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexCashAble = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAccountCashAble();
//         return res.status(200).json({
//             message: "Success Get Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexTransaction = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAccountTransaction();
//         return res.status(200).json({
//             message: "Success Get Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAccountById(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Get Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id, code, ...rest } = req.body;

//         if (!rest.level) {
//             rest.level = 3;
//         }

//         const codeFix = await generateAccountCode(rest.parent as number, rest.parent_level as number, rest.grandparent as number);

//         const form = {
//             ...rest,
//             code: codeFix,
//         };

//         const validate = insertAccountSchema.parse(form);

//         const data = await createAccount(validate);
//         return res.status(200).json({
//             message: "Success Create Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertAccountSchema.parse(req.body);

//         const data = await updateAccount(parseInt(req.params.id), validate);
//         return res.status(200).json({
//             message: "Success Update Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteAccount(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const category = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { category } = req.query;
//         if (!category) {
//             throw ValidationError("Harus ada category");
//         }
//         const arr = category.toString().split(",").map(Number);
//         const data = await getAccountByCategory(arr);
//         return res.status(200).json({
//             message: "Success Get Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexByOption = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { option, id } = req.query;
//         const data = await getAccountByOption(option, id);
//         res.status(200).json({
//             message: "Success Get Account By Option",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const indexByLevel = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const level = req.params.id;
//         const data = await getAccountByLevel(parseInt(level));
//         return res.status(200).json({
//             message: "Success Get Account",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const postingBulanan = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const bulan = req.body.bulan;
//         const tahun = req.body.tahun;
//         const date = `${tahun}-${bulan}-1`;
//         await updateAccValue(date);
//         res.status(200).json({
//             message: "Success Get Account By Option",
//             data: 1,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
