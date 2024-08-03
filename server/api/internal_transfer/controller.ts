import { NextFunction, Request, Response } from "express";
import { MyRequest } from "../../middleware/authMiddleware";
import { nomorInternalTransfer } from "../../libs/nomor";
import { ToString } from "../../libs/formater";
import { getSettingByName } from "../setting/service";
import { NewInternalTransfer, insertInternalTransferSchema, NewInternalTransferDetail, insertInternalTransferDetailSchema } from "./schema";
import {
    getInternalTransfer,
    getInternalReceive,
    getOptionInternalTransfer,
    getOptionInternalTransferForInvoice,
    getInternalTransferById,
    createInternalTransfer,
    createInternalTransferDetail,
    updateStatusInternalOrderSend,
    updateReceiveInternalTransfer,
    updateStatusInternalTransfer,
    updateInternalTransfer,
    deleteInternalTransferDetail,
    checkIfInternalTransferPosting,
    deleteInternalTransfer,
    checkIfInternalTransferReceived,
} from "./service";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { status } = req.query;
        const data = await getInternalTransfer(status);
        return res.status(200).json({
            message: "Success Get InternalTransfer",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexReceive = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { status } = req.query;
        const data = await getInternalReceive(status);
        return res.status(200).json({
            message: "Success Get InternalTransfer",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { status } = req.query;
        const data = await getOptionInternalTransfer(status);
        return res.status(200).json({
            message: "Success Get InternalTransfer",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOptionForInvoice = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getOptionInternalTransferForInvoice();
        return res.status(200).json({
            message: "Success Get InternalTransfer",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getInternalTransferById(parseInt(req.params.id));
        return res.status(200).json({
            message: "Success Get InternalTransfer",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { id, tanggal, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const nomor = await nomorInternalTransfer(tanggal, tx);

            const validate: NewInternalTransfer = insertInternalTransferSchema.parse({
                ...rest,
                nomor: nomor,
                tanggal: dayjs(tanggal, "DD-MM-YYYY").tz("Asia/Makassar").format("YYYY-MM-DD"),
                tanggal_kirim: dayjs(rest.tanggal_kirim, "DD-MM-YYYY").tz("Asia/Makassar").format("YYYY-MM-DD"),
                id_pengirim: req.user?.id,
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
            });

            const data = await createInternalTransfer(validate, tx);

            const validateDetail: NewInternalTransferDetail[] = detail.map((item: NewInternalTransferDetail, i: number) => {
                return insertInternalTransferDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: i + 1,
                    qty: ToString(item.qty),
                    diterima: ToString(item.diterima),
                });
            });

            if (data.status == "S") {
                const dataDetail = await createInternalTransferDetail(
                    validateDetail.filter((detail) => parseFloat(detail.qty as string) != 0),
                    tx,
                );
                await updateStatusInternalOrderSend(data, dataDetail, tx);
                // cek apakah internal receive digunakan
                const is_internal_receive = getSettingByName("internal_receive");
                if (!is_internal_receive) {
                    await updateReceiveInternalTransfer(
                        {
                            ...validate,
                            id_penerima: validate.id_pengirim,
                            status_terima: "A",
                        },
                        tx,
                    );
                    await updateStatusInternalTransfer(
                        data,
                        dataDetail
                            .filter((d) => parseFloat(d.qty) != 0)
                            .map((item) => {
                                return {
                                    ...item,
                                    diterima: item.qty,
                                };
                            }),
                        tx,
                    );
                }
                return { ...data, detail: dataDetail };
            }

            const dataDetail = await createInternalTransferDetail(validateDetail, tx);
            return { ...data, detail: dataDetail };
        });

        return res.status(200).json({
            message: "Success Create InternalTransfer",
            data: data,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { nomor, tanggal, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate: NewInternalTransfer = insertInternalTransferSchema.parse({
                ...rest,
                nomor: nomor,
                tanggal: tanggal,
                id_pengirim: req.user?.id,
                modified_by: req.user?.id,
                modified_date: new Date().toISOString(),
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
            });

            const data = await updateInternalTransfer(parseInt(id), validate, tx);

            const validateDetail: NewInternalTransferDetail[] = detail.map((item: NewInternalTransferDetail, i: number) => {
                return insertInternalTransferDetailSchema.parse({
                    ...item,
                    id: parseInt(id),
                    urut: i + 1,
                    qty: ToString(item.qty),
                    diterima: ToString(item.diterima),
                });
            });

            const deleteDetail = await deleteInternalTransferDetail(parseInt(id), tx);

            const statusDO = await checkIfInternalTransferPosting(parseInt(id), tx);

            if (statusDO.is_closed) {
                throw ValidationError("Status Internal Transfer Has Posting");
            }

            if (data.status == "S") {
                const dataDetail = await createInternalTransferDetail(
                    validateDetail.filter((detail) => parseFloat(detail.qty as string) != 0),
                    tx,
                );
                await updateStatusInternalOrderSend(
                    data,
                    dataDetail.filter((d) => parseFloat(d.qty) != 0),
                    tx,
                );
                //cek apakah internal receive digunakan
                const is_internal_receive = getSettingByName("internal_receive");
                if (!is_internal_receive) {
                    await updateReceiveInternalTransfer(
                        {
                            ...validate,
                            id_penerima: validate.id_pengirim,
                            status_terima: "A",
                        },
                        tx,
                    );
                    await updateStatusInternalTransfer(
                        data,
                        dataDetail
                            .filter((d) => parseFloat(d.qty) != 0)
                            .map((item) => {
                                return {
                                    ...item,
                                    diterima: item.qty,
                                };
                            }),
                        tx,
                    );
                }
                return { ...data, detail: dataDetail };
            }
            const dataDetail = await createInternalTransferDetail(validateDetail, tx);
            return { ...data, detail: dataDetail };
        });

        return res.status(200).json({
            message: "Success Update Internal Transfer",
            data: data,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const data = await deleteInternalTransfer(parseInt(id));
        return res.status(200).json({
            message: "Success Delete InternalTransfer",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const updateReceive = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { nomor, tanggal, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const validate: NewInternalTransfer = insertInternalTransferSchema.parse({
                ...rest,
                nomor: nomor,
                tanggal: tanggal,
                tanggal_terima: dayjs(rest.tanggal_terima, "DD-MM-YYYY").format("YYYY-MM-DD"),
                modified_by: req.user?.id,
                modified_date: new Date().toISOString(),
                created_by: req.user?.id,
                created_date: new Date().toISOString(),
            });
            const statusDO = await checkIfInternalTransferReceived(parseInt(id), tx);

            if (statusDO.is_closed) {
                throw ValidationError("Status Internal Transfer Has Received");
            }

            const data = await updateReceiveInternalTransfer(validate, tx);

            const validateDetail: NewInternalTransferDetail[] = detail.map((item: NewInternalTransferDetail, i: number) => {
                return insertInternalTransferDetailSchema.parse({
                    ...item,
                    id: parseInt(id),
                    urut: i + 1,
                    qty: ToString(item.qty),
                    diterima: ToString(item.diterima),
                });
            });

            const deleteDetail = await deleteInternalTransferDetail(parseInt(id), tx);

            if (data.status_terima == "A") {
                const dataDetail = await createInternalTransferDetail(
                    validateDetail.filter((detail) => parseFloat(detail.qty as string) != 0),
                    tx,
                );
                await updateStatusInternalTransfer(
                    data,
                    dataDetail.filter((d) => parseFloat(d.qty) != 0),
                    tx,
                );
                return { ...data, detail: dataDetail };
            }
            const dataDetail = await createInternalTransferDetail(validateDetail, tx);
            return { ...data, detail: dataDetail };
        });

        return res.status(200).json({
            message: "Success Update Internal Transfer",
            data: data,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
