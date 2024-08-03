// import { NextFunction, Request, Response } from "express";
// import { ValidationError } from "../../../libs/errors";
// import { ToString, formatDate } from "../../../libs/formater";
// import { nomorGlTrans, nomorKasKeluar, nomorKasMasuk } from "../../../libs/nomor";
// import { AccGlTrans, NewAccGlTrans, insertAccGlTransSchema } from "./schema";
// import { createAccGlTrans, deleteAccGlDetail, deleteAccGlTrans, deleteAccGlTransByGlNumber, getAccGlTrans, getAccGlTransById, getAccGlTransByJU, updateAccGlTrans } from "./service";

// import { AccGlDetail, insertAccGlDetailSchema } from "./acc_gl_detail/schema";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAccGlTransByJU();
//         res.status(200).json({
//             message: `Success Get Acc Kas`,
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { gl_number } = req.params;
//         const data = await getAccGlTransById(gl_number);
//         res.status(200).json({
//             message: `Success Get Acc Kas `,
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id, reference, detail, ...rest } = req.body;

//         const data = await db.transaction(async (tx) => {
//             const nomorGLFix = await nomorGlTrans(rest.date, tx);
//             const form = {
//                 ...rest,
//                 gl_number: nomorGLFix,
//                 total: ToString(0),
//                 gl_date: formatDate(rest.date),
//                 reference: "JU" + nomorGLFix,
//                 journal_code: "JUM",
//             } as NewAccGlTrans;
//             const validate = insertAccGlTransSchema.parse(form);

//             const formDetail = detail.map((item: any, index: number) => {
//                 return {
//                     ...item,
//                     gl_number: nomorGLFix,
//                     line: index + 1,
//                     id_account: item.id_account,
//                     is_debit: item.debit != null && item.debit > 0 ? true : false,
//                     amount: ToString(item.debit != null && item.debit > 0 ? item.debit : item.credit),
//                 };
//             });
//             const validateDetail = formDetail.map((item: AccGlDetail) => insertAccGlDetailSchema.parse(item));

//             const data = await createAccGlTrans(validate, validateDetail, tx);
//             return { ...data };
//         });
//         res.status(200).json({
//             message: "Success Create Acc Kas",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { gl_number } = req.params;
//         const { detail, ...rest } = req.body;

//         const data = await db.transaction(async (tx) => {
//             await deleteAccGlDetail(rest.gl_number, tx);

//             const form = {
//                 ...rest,
//                 total: ToString(0),
//                 gl_date: formatDate(rest.date),
//             } as NewAccGlTrans;
//             const validate = insertAccGlTransSchema.parse(form);

//             const formDetail = detail.map((item: any, index: number) => {
//                 return {
//                     ...item,
//                     gl_number: rest.gl_number,
//                     line: index + 1,
//                     id_account: item.id_account,
//                     is_debit: item.debit != null && item.debit > 0 ? true : false,
//                     amount: ToString(item.debit != null && item.debit > 0 ? item.debit : item.credit),
//                 };
//             });
//             const validateDetail = formDetail.map((item: AccGlDetail) => insertAccGlDetailSchema.parse(item));
//             await updateAccGlTrans(gl_number, validate, validateDetail, tx);
//         });

//         res.status(200).json({
//             message: "Success Update Acc Kas",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { gl_number } = req.params;
//         const data = await deleteAccGlTransByGlNumber(gl_number);
//         res.status(200).json({
//             message: "Success Delete Acc Kas",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
