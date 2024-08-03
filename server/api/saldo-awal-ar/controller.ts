// import { NextFunction, Request, Response } from "express";

// import { MyRequest } from "../../middleware/authMiddleware";
// import { insertAccArFakturSchema } from "../ar/schema";
// import { getAccArFakturSaldoAwal, getAccArFakturById, isAvailableNomor, createAccArFaktur, updateAccArFaktur, deleteAccArFaktur, isCanEdit } from "../ar/service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getAccArFakturSaldoAwal();
//         res.status(200).json({
//             message: "Success get Saldo Awal",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const invoice = req.params.invoice;
//         const data = await getAccArFakturById(invoice);
//         res.status(200).json({
//             message: "Success get saldo awal",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const { amount, invoice, ...rest } = req.body;
//         const isAvailable = await isAvailableNomor(invoice);

//         if (!isAvailable) {
//             throw ValidationError("invoice sudah terpakai");
//         }
//         const validate = insertAccArFakturSchema.parse({
//             ...rest,
//             invoice: invoice,
//             amount: ToString(amount),
//         });

//         const data = await createAccArFaktur(validate);
//         res.status(200).json({
//             message: "Success crate Saldo Awal",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { amount, ...rest } = req.body;

//         const invoice = req.params.id;

//         const isCan = await isCanEdit(invoice);

//         if (!isCan) {
//             throw ValidationError("Sudah Ada Pembayaran, Tidak Dapat Di Edit");
//         }

//         const validate = insertAccArFakturSchema.parse({
//             ...rest,
//             amount: ToString(amount),
//         });

//         const data = await updateAccArFaktur(invoice, validate);
//         res.status(200).json({
//             message: "Success crate Saldo Awal",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const invoice = req.params.id;
//         const isCan = await isCanEdit(invoice);

//         if (!isCan) {
//             throw ValidationError("Sudah Ada Pembayaran, Tidak Dapat Di Edit");
//         }
//         const data = await deleteAccArFaktur(invoice);
//         res.status(200).json({
//             message: "Success Delete Saldo Awal",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
