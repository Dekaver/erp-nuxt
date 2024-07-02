import { NextFunction, Request, Response } from "express";
import { insertRolePermissionSchema, role_permission } from "./schema";
import { createRolePermission, deleteRolePermission, getRolePermission, getRolePermissionById } from "./service";
import db from "../../../../libs/db";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getRolePermission();
        res.status(200).json({
            message: "Success Get Role Permission",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getRolePermissionById(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Get Role Permission By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const id_permission = req.body.id_permission;

        const data = await db.transaction(async (tx) => {
            const validate = id_permission.map((item: number) => {
                return insertRolePermissionSchema.parse({
                    id_role: id,
                    id_permission: item,
                });
            });
            await deleteRolePermission(id, tx);
            if (validate.length > 0) {
                await createRolePermission(validate, tx);
            }
        });

        res.status(200).json({
            message: "Success Create Role Permission",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
