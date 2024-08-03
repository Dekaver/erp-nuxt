import { NextFunction, Request, Response } from "express";
import db from "../../../libs/db";
import { insertPenggunaPermissionSchema } from "./schema";
import { createPenggunaPermission, deletePenggunaPermission, getPenggunaPermission, getPenggunaPermissionById } from "./service";
import { io } from "../../../app";

export const index = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await getPenggunaPermission();
		res.status(200).json({
			message: "Success Get Pengguna Permission",
			data: data,
		});
	} catch (error) {
		next(error);
	}
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await getPenggunaPermissionById(parseInt(req.params.id));
		res.status(200).json({
			message: "Success Get Pengguna Permission By Id",
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
				return insertPenggunaPermissionSchema.parse({
					id: id,
					id_permission: item,
				});
			});
			await deletePenggunaPermission(id, tx);
			if (validate.length > 0) {
				await createPenggunaPermission(validate, tx);
			}
		});

		io.emit("menu");

		res.status(200).json({
			message: "Success Create Pengguna Permission",
			data: data,
		});
	} catch (error) {
		next(error);
	}
};
