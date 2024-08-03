import { and, eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import * as dayjs from 'dayjs'

import { formatDate, ToString } from "../../libs/formater";
import { nomorPenerimaanBarang } from "../../libs/nomor";
import { MyRequest } from "../../middleware/authMiddleware";
import { barang_satuan } from "../barang/schema";
import { checkSisaDetail } from "../purchase_order/service";
import { insertPenerimaanBarangDetailSchema, NewPenerimaanBarangDetail } from "./detail/schema";
import { createPenerimaanBarangDetail, deletePenerimaanBarangDetail, getPenerimaanBarangDetailById } from "./detail/service";
import { deletePenerimaanBarangPersetujuan, getPenerimaanBarangPersetujuan } from "./persetujuan/service";
import { insertPenerimaanBarangSchema, updatePenerimaanBarangSchema } from "./schema";
import {
    checkIfPenerimaanBarangIsComplete,
    closingPenerimaanBarang,
    createPenerimaanBarang,
    createPenerimaanBarangPersetujuanBySetting,
    deletePenerimaanBarang,
    getPenerimaanBarang,
    getPenerimaanBarangById,
    getPenerimaanBarangOption,
    updatePenerimaanBarang,
} from "./service";
import { io } from "../../app";

export const index = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const type = req.query.type;
        const module = req.query.module;

        if (type == "option") {
            const data = await getPenerimaanBarangOption(module as string);
            res.status(200).json({
                message: "Success Get Penerimaan Barang",
                data: data,
            });
            return;
        }
        const data = await getPenerimaanBarang();
        res.status(200).json({
            message: "Success Get Penerimaan Barang",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await db.transaction(async (tx) => {
            const data = await getPenerimaanBarangById(id, tx);
            const dataDetail = await getPenerimaanBarangDetailById(id, tx);
            const dataPersetujuan = await getPenerimaanBarangPersetujuan(id, tx);
            return { ...data, detail: dataDetail, persetujuan: dataPersetujuan };
        });
        res.status(200).json({
            message: "Success Get Penerimaan Barang By Id",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (tx) => {
            // Pisahkan id, created_date, modified_date, detail dari req.body
            const { id, detail, ...rest } = req.body;

            // Buat nomor penerimaan barang
            const nomorFix = await nomorPenerimaanBarang(rest.tanggal, tx);

            // Validasi inputan penerimaan barang
            const validate = insertPenerimaanBarangSchema.parse({
                ...rest,
                nomor: nomorFix,
                tanggal: formatDate(rest.tanggal),
                tanggal_referensi: formatDate(rest.tanggal_referensi),
                created_by: req.user?.id,
                updated_by: req.user?.id,
            });

            const today = dayjs();
            if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today) || dayjs(validate.tanggal_referensi, "YYYY-MM-DD").isAfter(today)) {
                throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
            }

            // validasi jumlah barang
            const isQtyGreaterThanZero: boolean = validate.status != "D" ? detail.some((obj: NewPenerimaanBarangDetail) => parseFloat(obj.diambil as string) > 0) : true;
            if (!isQtyGreaterThanZero) {
                throw ValidationError("Error, jumlah barang yang diambil harus lebih dari 0");
            }

            //validasi barang & gudang
            const checkTrackingStok = async () => {
                const results = await Promise.all(
                    detail.map(async (obj: NewPenerimaanBarangDetail) => {
                        let [dataBarangSatuan] = await tx
                            .select({ konversi: barang_satuan.konversi })
                            .from(barang_satuan)
                            .where(and(eq(barang_satuan.id_barang, obj.id_barang as number), eq(barang_satuan.id_satuan, obj.id_satuan)));
                        let konversi = dataBarangSatuan ? parseFloat(dataBarangSatuan.konversi) : 1;

                        return await checkSisaDetail(obj.id_po, obj.urut_po, (parseFloat(obj.diambil as string) / konversi) as number as unknown as string, tx);
                    }),
                );
                return !results.some((result) => !result);
            };
            const isTrackingStok = await checkTrackingStok();
            if (!isTrackingStok) {
                throw ValidationError("Error, PO Detail tidak boleh lebih kecil dari diambil!");
            }

            // Buat penerimaan barang
            const data = await createPenerimaanBarang(validate, tx);
            // Validasi inputan detail penerimaan barang
            const validateDetail = detail.map((item: NewPenerimaanBarangDetail, index: number) =>
                insertPenerimaanBarangDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    id_po: item.id_po,
                    urut_po: item.urut_po,
                    id_barang: item.id_barang,
                    diambil: ToString(item.diambil),
                    diorder: ToString(item.diorder),
                    sisa: ToString(item.sisa),
                }),
            );

            // persetujuan
            if (validate.status == "S") {
                const dataDetail = await createPenerimaanBarangDetail(
                    validateDetail.filter((val: NewPenerimaanBarangDetail) => parseInt(val.diambil as string) > 0),
                    tx,
                );
                const lPersetujuan = await createPenerimaanBarangPersetujuanBySetting(data.id, req.user!.id, tx);

                io.emit("update-persetujuan-penerimaan-barang");

                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status === "C") {
                // simpan detail yang diambil saja
                const dataDetail = await createPenerimaanBarangDetail(
                    validateDetail.filter((val: NewPenerimaanBarangDetail) => parseInt(val.diambil as string) > 0),
                    tx,
                );

                // closing penerimaan barang
                await closingPenerimaanBarang(data, dataDetail, tx);
                return { ...data, detail: dataDetail, persetujuan: [] };
            }
            const dataDetail = await createPenerimaanBarangDetail(validateDetail, tx);
            return { ...data, detail: dataDetail, persetujuan: [] };
        });
        res.status(200).json({
            message: "Success Operation",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const { detail, ...rest } = req.body;
        const data = await db.transaction(async (tx) => {
            // check purchase_request
            const [dataPersetujuan] = await getPenerimaanBarangPersetujuan(id, tx);
            if (dataPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("Penerimaan Barang Sudah ada Persetujuan");
            }

            // Cek apakah data sudah permanen
            const check = await checkIfPenerimaanBarangIsComplete(id, tx);
            if (check && check.status === "C") {
                throw ValidationError("Data sudah permanen, tidak boleh diubah");
            }

            const today = dayjs();
            if (dayjs(rest.tanggal, "YYYY-MM-DD").isAfter(today) || dayjs(rest.tanggal_referensi, "YYYY-MM-DD").isAfter(today)) {
                throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
            }

            if (detail.length === 0) {
                throw ValidationError("Detail tidak boleh kosong");
            }

            //validasi barang & gudang
            const checkTrackingStok = async () => {
                const results = await Promise.all(
                    detail.map(async (obj: NewPenerimaanBarangDetail) => {
                        let [dataBarangSatuan] = await tx
                            .select({ konversi: barang_satuan.konversi })
                            .from(barang_satuan)
                            .where(and(eq(barang_satuan.id_barang, obj.id_barang as number), eq(barang_satuan.id_satuan, obj.id_satuan)));
                        let konversi = dataBarangSatuan ? parseFloat(dataBarangSatuan.konversi) : 1;

                        return await checkSisaDetail(obj.id_po, obj.urut_po, (parseFloat(obj.diambil as string) / konversi) as number as unknown as string, tx);
                    }),
                );
                return !results.some((result) => !result);
            };
            const isTrackingStok = await checkTrackingStok();
            if (!isTrackingStok) {
                throw ValidationError("Error, PO Detail tidak boleh lebih kecil dari diambil!");
            }

            // validasi jumlah barang
            const isQtyGreaterThanZero: boolean = rest.status != "D" ? detail.some((obj: NewPenerimaanBarangDetail) => parseFloat(obj.diambil as string) > 0) : true;
            if (!isQtyGreaterThanZero) {
                throw ValidationError("Error, jumlah barang yang diambil harus lebih dari 0");
            }

            // Validasi inputan penerimaan barang
            const validate = updatePenerimaanBarangSchema.parse({
                id,
                ...rest,
                tanggal: formatDate(rest.tanggal),
                tanggal_referensi: formatDate(rest.tanggal_referensi),
                updated_by: req.user?.id,
            });

            // Update penerimaan barang
            const data = await updatePenerimaanBarang(id, validate, tx);

            // Validasi inputan detail penerimaan barang
            const validateDetail = detail.map((item: NewPenerimaanBarangDetail, index: number) =>
                insertPenerimaanBarangDetailSchema.parse({
                    ...item,
                    id: id,
                    urut: index + 1,
                    diambil: ToString(item.diambil),
                    diorder: ToString(item.diorder),
                    sisa: ToString(item.sisa),
                }),
            );

            await deletePenerimaanBarangDetail(id, tx);

            // persetujuan
            if (validate.status == "S") {
                // simpan detail yang diambil saja
                const dataDetail = await createPenerimaanBarangDetail(
                    validateDetail.filter((val: NewPenerimaanBarangDetail) => parseInt(val.diambil as string) > 0),
                    tx,
                );

                await deletePenerimaanBarangPersetujuan(id, tx);
                const lPersetujuan = await createPenerimaanBarangPersetujuanBySetting(id, req.user!.id, tx);

                io.emit("update-persetujuan-penerimaan-barang");

                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status === "C") {
                // simpan detail yang diambil saja
                const dataDetail = await createPenerimaanBarangDetail(
                    validateDetail.filter((val: NewPenerimaanBarangDetail) => parseInt(val.diambil as string) > 0),
                    tx,
                );

                // closing penerimaan barang
                await closingPenerimaanBarang(data, dataDetail, tx);
                return { ...data, detail: dataDetail, persetujuan: [] };
            }
            const dataDetail = await createPenerimaanBarangDetail(validateDetail, tx);
            return { ...data, detail: dataDetail, persetujuan: [] };
        });
        res.status(200).json({
            message: "Success Update Penerimaan Barang",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await db.transaction(async (tx) => {
            // const check = await getPenerimaanBarangById(id, tx);

            // check purchase_request
            const [dataPersetujuan] = await getPenerimaanBarangPersetujuan(id, tx);
            if (dataPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("Penerimaan Barang Sudah ada Persetujuan");
            }

            await deletePenerimaanBarangPersetujuan(id, tx);
            await deletePenerimaanBarangDetail(id, tx);
            const data = await deletePenerimaanBarang(id, tx);

            io.emit("update-persetujuan-penerimaan-barang");

            return { ...data };
        });
        res.status(200).json({
            message: "Success Delete Penerimaan Barang",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const option = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getPenerimaanBarangOption();
        res.status(200).json({
            message: "Success Get Penerimaan Barang",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
