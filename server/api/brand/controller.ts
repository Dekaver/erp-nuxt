import { NextFunction, Request, Response } from "express";
import { createBrand, deleteBrand, getBrand, getBrandById, updateBrand } from "../brand/service";
import { insertBrandSchema } from "../brand/schema";
import { MyRequest } from "src/middleware/authMiddleware";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getBrand();
        return res.status(200).json({
            message: "Success Get Brand",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getBrandById(req.user!.id);
        return res.status(200).json({
            message: "Success Get Brand",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertBrandSchema.parse(req.body);

        const data = await createBrand(validate);
        return res.status(200).json({
            message: "Success Create Brand",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertBrandSchema.parse(req.body);

        const data = await updateBrand(validate);
        return res.status(200).json({
            message: "Success Update Brand",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteBrand(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Delete Brand",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
