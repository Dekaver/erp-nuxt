import { NextFunction, Response } from "express";
import { MyRequest } from "../../../middleware/authMiddleware";
import { ValidationError } from "../../../libs/errors";
import { getPersetujuanPurchaseRequest, updatePersetujuanPurchaseRequest } from "./service";

export const getPersetujuan = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id_pegawai = req.user!.id;

        const data = await getPersetujuanPurchaseRequest(id_pegawai);
        res.status(200).json({
            message: "Success Get Purchase Request",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePersetujuan = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        if (req.body.status == false && !req.body.keterangan) {
            throw ValidationError("Error, Keterangan Wajib Diisi");
        }
        const data = await updatePersetujuanPurchaseRequest(parseInt(req.body.id), req.user?.id as number, req.body.status, req.body.keterangan);
        res.status(200).json({
            message: "Success Update Persetujuan Purchase Request",
            data,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
