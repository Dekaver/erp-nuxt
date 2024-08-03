import { NextFunction, Request, Response } from "express";
import {
    createKategoriKontak,
    createKontak,
    deleteKategoriKontak,
    deleteKontak,
    getCustomerPegawai,
    getKategoriKontak,
    getKategoriKontakById,
    getKontak,
    getKontakById,
    getKontakCustomer,
    getKontakOption,
    getKontakSupplier,
    updateKategoriKontak,
    updateKontak,
} from "./service";
import { insertKategoriKontakSchema, insertKontakSchema } from "./schema";
import { MyRequest } from "src/middleware/authMiddleware";
import { ToString } from "../../libs/formater";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, ...rest } = req.query;
        if (type === "option") {
            const data = await getKontakOption(rest);
            return res.status(200).json({
                message: "Success Get Account",
                data: data,
            });
        }
        const data = await getKontak();
        return res.status(200).json({
            message: "Success Get Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const supplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getKontakSupplier();
        return res.status(200).json({
            message: "Success Get Kontak Supplier",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const customer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getKontakCustomer();
        return res.status(200).json({
            message: "Success Get Kontak Customer",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};


export const customerPegawai = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getCustomerPegawai();
        return res.status(200).json({
            message: "Success Get Kontak Customer",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getKontakById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertKontakSchema.parse({
            ...req.body,
            batasKredit: ToString(req.body.batasKredit),
        });

        const data = await createKontak(validate);
        return res.status(200).json({
            message: "Success Create Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertKontakSchema.parse({
            ...req.body,
            batasKredit: ToString(req.body.batasKredit),
        });

        const data = await updateKontak(parseInt(req.body.id), validate);
        return res.status(200).json({
            message: "Success Update Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteKontak(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Delete Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexKategori = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getKategoriKontak();
        return res.status(200).json({
            message: "Success Get Kategori Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const showKategori = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getKategoriKontakById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get Kategori Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const storeKategori = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertKategoriKontakSchema.parse(req.body);

        const data = await createKategoriKontak(validate);
        return res.status(200).json({
            message: "Success Create Kategori Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateKategori = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = insertKategoriKontakSchema.parse(req.body);

        const data = await updateKategoriKontak(parseInt(req.params.id), validate);
        return res.status(200).json({
            message: "Success Update Kategori Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroyKategori = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await deleteKategoriKontak(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Delete Kategori Kontak",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
