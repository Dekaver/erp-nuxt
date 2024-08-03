// import { NextFunction, Response } from "express";
// import { MyRequest } from "../../../middleware/authMiddleware";
// import { ValidationError } from "../../../libs/errors";
// import { getPersetujuanSalesOrder, updatePersetujuanSalesOrder } from "./service";

// export const getPersetujuan = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         const id_pegawai = req.user?.id as number;

//         const data = await getPersetujuanSalesOrder(id_pegawai);
//         res.status(200).json({
//             message: "Success Get Sales Order",
//             data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const updatePersetujuan = async (req: MyRequest, res: Response, next: NextFunction) => {
//     try {
//         if (req.body.status == false && !req.body.keterangan) {
//             throw ValidationError("Error, Keterangan Wajib Diisi");
//         }
//         const data = await updatePersetujuanSalesOrder(parseInt(req.body.id), req.user?.id as number, req.body.status, req.body.keterangan);
//         res.status(200).json({
//             message: "Success Update Persetujuan Sales Order",
//             data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
