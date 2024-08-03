import { NextFunction, Request, Response } from "express";
import { createPengguna, deletePengguna, getMyPengguna, getPengguna, getPenggunaByUsernamenya, updatePassword, updatePengguna } from "./service";
import { insertPenggunaSchema, updatePenggunaSchema } from "../pengguna/schema";
import bcrypt from "bcrypt";
import { MyRequest } from "../../../middleware/authMiddleware";
import { getOnePegawaiKas, getPegawaiById } from "../pegawai/service";
import { getPermissionByRole } from "../permission/service";
import db from "../../../libs/db";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPengguna();
        return res.status(200).json({
            message: "Success Get Pengguna",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPenggunaByUsernamenya(req.params.usernamenya);
        return res.status(200).json({
            message: "Success Get Pengguna",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const myPengguna = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (tx) => {
            const data = await getMyPengguna(req.user!.id, tx);

            const pegawai = await getPegawaiById(req.user!.id, tx);

            const pegawaiKas = await getOnePegawaiKas(req.user!.id, tx);
            const dataPermission = await getPermissionByRole(data.id_role as number, tx);
            return { ...data, pegawai, permission: dataPermission, kas: pegawaiKas };
        });
        return res.status(200).json({
            message: "Success Get Pengguna",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertPenggunaSchema.parse(req.body);
        const hash = bcrypt.hashSync(validate.passwordnya, 10);
        validate.passwordnya = hash;
        const check = await getPenggunaByUsernamenya(validate.usernamenya);
        if (check) {
            return res.status(400).json({
                message: "Username sudah digunakan",
            });
        }
        const data = await createPengguna(validate);
        return res.status(200).json({
            message: "Success Create Pengguna",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = updatePenggunaSchema.parse(req.body);
        if (req.body.passwordnya) {
            const hash = bcrypt.hashSync(validate.passwordnya as string, 10);
            validate.passwordnya = hash;
        }
        const data = await updatePengguna(req.params.usernamenya, validate);
        return res.status(200).json({
            message: "Success Update Pengguna",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deletePengguna(req.params.usernamenya);
        return res.status(200).json({
            message: "Success Delete Pengguna",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const changePassowrd = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await updatePassword(parseInt(req.params.id), req.body.oldPassword, req.body.newPassword);
        res.status(200).json({
            message: "Success Update Password",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
