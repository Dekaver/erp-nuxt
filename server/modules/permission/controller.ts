import { NextFunction, Request, Response } from "express";
import { createPermission, deletePermission, getParent, getPermission, getPermissionById, updatePermission } from "./service";
import { insertPermissionSchema } from "./schema";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const type = req.query.type;
        if (type == "tree") {
            const data = (await getPermission(req.query)) as any[];

            const buildTree = (data: any[], parent: number | null = null, parentKey: string = ''): any[] => {
                const tree: any[] = [];

                data.forEach((node, index) => {
                    if (node.parent === parent) {
                        const key = node.id;
                        const children = buildTree(data, node.id, key);
                        const treeNode: any = {
                            key,
                            data: node,
                            children,
                          };
                        node.key = key;
                        tree.push(treeNode);
                    }
                });

                return tree;
            };

            const resultTree: any[] = buildTree(data);

            return res.status(200).json({
                message: "Success Get Permission",
                data: resultTree,
            });
        }
        const data = await getPermission(req.query);
        res.status(200).json({
            message: "Success Get Permission",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const parent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getParent();
        res.status(200).json({
            message: "Success Get Permission Parent",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPermissionById(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Get Permission By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertPermissionSchema.parse(req.body);
        const data = await createPermission(validate);
        res.status(200).json({
            message: "Success Create Permission",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertPermissionSchema.parse(req.body);
        const data = await updatePermission(parseInt(req.params.id), validate);
        res.status(200).json({
            message: "Success Update Permission",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deletePermission(parseInt(req.params.id));
        res.status(200).json({
            message: "Success Delete Permission",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
