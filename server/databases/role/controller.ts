import { NextFunction, Request, Response } from "express";
import { insertRoleSchema } from "./schema";
import { getRole, getRoleById, createRole, updateRole, deleteRole } from "./service";
import { getRolePermissionById } from "./permission/service";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getRole();
        res.status(200).json({
            message: "Success Get Role",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getRoleById(parseInt(req.params.id));
        const dataPermission = await getRolePermissionById(data.id);
        res.status(200).json({
            message: "Success Get Role By Id",
            data: { ...data, permissions: dataPermission },
        });
    } catch (error) {
        next(error);
    }
};
export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertRoleSchema.parse(req.body);
        const data = await createRole(validate);
        res.status(200).json({
            message: "Success Create Role",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertRoleSchema.parse(req.body);
        const data = await updateRole(parseInt(req.params.id), validate);
        res.status(200).json({
            message: "Success Update Role",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteRole(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Delete Role",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
