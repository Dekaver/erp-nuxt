// import { NextFunction, Request, Response } from "express";
// import { createGudang, deleteGudang, getGudang, getGudangById, updateGudang } from "../gudang/service";
// import { insertGudangSchema } from "../gudang/schema";
// import { MyRequest } from "src/middleware/authMiddleware";
// import { getHistoryStok } from "./stok_barang/service";

// export const index = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getGudang();
//         return res.status(200).json({
//             message: "Success Get Gudang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const data = await getGudangById(req.user!.id);
//         return res.status(200).json({
//             message: "Success Get Gudang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const store = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertGudangSchema.parse(req.body);

//         const data = await createGudang(validate);
//         return res.status(200).json({
//             message: "Success Create Gudang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const update = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const validate = insertGudangSchema.parse(req.body);

//         const data = await updateGudang(parseInt(req.params.id), validate);
//         return res.status(200).json({
//             message: "Success Update Gudang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const destroy = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await deleteGudang(parseInt(req.params.id));
//         return res.status(200).json({
//             message: "Success Delete Gudang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const showHistoryStok = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id_barang, id_gudang, bulan, tahun } = req.params;
//         const data = await getHistoryStok(id_barang, id_gudang, bulan, tahun);
//         res.status(200).json({
//             message: "Success Get History Stok Barang",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
