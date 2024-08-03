import { NextFunction, Request, Response } from "express";

import { formatDate, ToString } from "../../libs/formater";
import { MyRequest } from "../../middleware/authMiddleware";
import { deleteAccGlTrans, getAccGlTransByReference } from "../accounting/acc_gl_trans/service";
import { insertAccArFakturSchema } from "../ar/schema";
import { createAccArFaktur, deleteAccArFaktur } from "../ar/service";
import { COMPANY_ID, generateHTMLContent, generatePDF, injectStylesAndScripts, sendPDFResponse, setupPuppeteer } from "../cetakan/service";
import { getDeliveryOrderDetailById, updateDiterimaDeliveryOrder } from "../delivery_order/detail/service";
import { getDeliveryOrderById } from "../delivery_order/service";
import { getGudangById } from "../gudang/service";
import { getInternalPerusahaanById } from "../internal-perusahaan/service";
import {
    createInvoice,
    createInvoicePersetujuanBySetting,
    createJurnal,
    deleteInvoice,
    getInvoice,
    getInvoiceById,
    getOptionInvoice,
    getYearlyInvoice,
    nomorInvoice,
    updateInvoice,
    updateStatusInvoiceOpen,
} from "../invoice/service";
import { getKontakById } from "../kontak/service";
import { SalesOrderDetail } from "../sales_order/detail/schema";
import { getSalesOrderDetailById } from "../sales_order/detail/service";
import { getSalesOrderById } from "../sales_order/service";
import { insertInvoiceDeliveryOrderSchema, InvoiceDeliveryOrder, NewInvoiceDeliveryOrder } from "./delivery_order/schema";
import { createInvoiceDeliveryOrder, getInvoiceDeliveryOrder } from "./delivery_order/service";
import { insertInvoiceDetailSchema, InvoiceDetail, NewInvoiceDetail } from "./detail/schema";
import { createInvoiceDetail, deleteInvoiceDetail, getInvoiceDetail } from "./detail/service";
import { insertInvoiceSchema, updateInvoiceSchema } from "./schema";
import { io } from "../../app";
import { deleteInvoicePersetujuan, getInvoicePersetujuan } from "./persetujuan/service";
import { getHPPByIdBarang } from "../gudang/stok_barang/service";

export const index = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getInvoice(req.query);
        return res.status(200).json({
            message: "Success Get Invoice",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const getOption = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getOptionInvoice(req.query);
        return res.status(200).json({
            message: "Success Get Invoice",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexYearlyInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { year } = req.query;
        if (!year) {
            year = dayjs().format("YYYY");
        }
        const data = await getYearlyInvoice(year as string);
        return res.status(200).json({
            message: "Success Get Yearly Invoice",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const show = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = await db.transaction(async (tx) => {
            const data = await getInvoiceById(id, tx);
            const dataDetail = await getInvoiceDetail(id, tx);
            const dataPersetujuan = await getInvoicePersetujuan(id, tx);

            const hasil: any = {};
            for (const item of dataDetail) {
                if (hasil[item.nama_barang]) {
                    // Jika nama barang sudah ada dalam hasil, tambahkan qty
                    hasil[item.nama_barang].qty = parseFloat(hasil[item.nama_barang].qty) + parseFloat(item.qty);
                    hasil[item.nama_barang].total = parseFloat(hasil[item.nama_barang].total) + parseFloat(item.total);
                    hasil[item.nama_barang].nomor_do += item.nomor_do ? `, ${item.nomor_do}` : "";
                } else {
                    // Jika nama barang belum ada dalam hasil, tambahkan entri baru
                    if (item.id_barang && data.id_gudang) {
                        const hpp = await getHPPByIdBarang({ id_barang: item.id_barang, id_gudang: data.id_gudang, tanggal: data.tanggal }, tx);
                        hasil[item.nama_barang] = { ...item, hpp: hpp };
                    } else {
                        hasil[item.nama_barang] = { ...item };
                    }
                }
            }

            // Mengonversi objek hasil kembali menjadi array
            const hasilArray = Object.values(hasil);

            const dataDeliveryOrder = await getInvoiceDeliveryOrder(id, tx);
            return { ...data, detail: hasilArray, delivery_order: dataDeliveryOrder, persetujuan: dataPersetujuan };
        });
        return res.status(200).json({
            message: "Success Get Invoice",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const store = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { jurnal, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const nomorFix = await nomorInvoice(rest.tanggal, tx);

            const validate = insertInvoiceSchema.parse({
                ...rest,
                nomor: nomorFix,
                tanggal: formatDate(rest.tanggal),
                tanggal_jatuh_tempo: formatDate(rest.tanggal_jatuh_tempo),
                total: ToString(rest.total),
                total_discount: ToString(rest.total_discount),
                total_pajak: ToString(rest.total_pajak),
                grandtotal: ToString(rest.grandtotal),
                diskonpersen: ToString(rest.diskonpersen),
                dpp: ToString(rest.dpp),
                biaya_lain: ToString(rest.biaya_lain),
                created_by: req.user?.id,
                updated_by: req.user?.id,
            });
            const today = dayjs();
            if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today)) {
                throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
            }
            const data = await createInvoice(validate, tx);

            const validateDetail = detail.map((item: NewInvoiceDetail, index: number) => {
                return insertInvoiceDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    qty: ToString(item.qty),
                    harga: ToString(item.harga),
                    harga_asli: ToString(item.harga_asli),
                    total: ToString(item.total),
                    diskonrp: ToString(item.diskonrp),
                    diskonpersen: ToString(item.diskonpersen),
                });
            });

            const dataDetail = await createInvoiceDetail(validateDetail, tx);

            if (validate.status == "S") {
                const dataDetail = await createInvoiceDetail(validateDetail, tx);
                // persetujuan
                await deleteInvoicePersetujuan(data.id, tx);
                const lPersetujuan = await createInvoicePersetujuanBySetting(data.id, req.user!.id, tx);
                io.emit("update-persetujuan-invoice");
                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status == "O") {
                await updateStatusInvoiceOpen(data, validateDetail, tx);
                const validateAccAr = insertAccArFakturSchema.parse({
                    invoice: data.nomor,
                    invoice_date: formatDate(data.tanggal),
                    id_customer: data.id_kontak,
                    id_top: data.id_top,
                    top: data.top,
                    amount: data.grandtotal,
                    pay: "0",
                    discount: data.total_discount,
                    due_date: formatDate(data.tanggal_jatuh_tempo as string),
                });
                await createAccArFaktur(validateAccAr, tx);
                await createJurnal(data, jurnal, tx);
            }

            return { ...data, detail: dataDetail, delivery_order: [] };
        });
        return res.status(200).json({
            message: "Success Create Invoice",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        // Bedah data
        const { jurnal, delivery_order, detail, ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            // check persetujuan purchase_request
            const [dataApPersetujuan] = await getInvoicePersetujuan(id, tx);
            if (dataApPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("AP Sudah ada Persetujuan");
            }
            const validate = updateInvoiceSchema.parse({
                ...rest,
                tanggal: formatDate(rest.tanggal),
                tanggal_jatuh_tempo: formatDate(rest.tanggal_jatuh_tempo),
                diskonpersen: ToString(rest.diskonpersen),
                total: ToString(rest.total),
                dpp: ToString(rest.dpp),
                grandtotal: ToString(rest.grandtotal),
                total_pajak: ToString(rest.total_pajak),
                total_discount: ToString(rest.total_discount),
                biaya_lain: ToString(rest.biaya_lain),
                updated_by: req.user?.id,
            });

            const data = await updateInvoice(id, validate, tx);

            let dataDetail: InvoiceDetail[] = [];
            let dataDeliveryOrder: InvoiceDeliveryOrder[] = [];

            if (delivery_order?.length) {
                const dataInvoiceDetail = await getInvoiceDetail(data.id, tx);
                const validateDetail = dataInvoiceDetail.map((item: NewInvoiceDetail) => {
                    const newData = detail.find((form: NewInvoiceDetail) => form.nama_barang == item.nama_barang);
                    return insertInvoiceDetailSchema.parse({
                        ...item,
                        harga: ToString(newData.harga),
                        total: ToString(newData.total),
                        diskonrp: ToString(newData.diskonrp),
                        diskonpersen: ToString(newData.diskonpersen),
                    });
                });
                await deleteInvoiceDetail(data.id, tx);
                dataDetail = await createInvoiceDetail(validateDetail, tx);
                // TODO: Sepertinya tidak digunakan
                // const validateDeliveryOrder: NewInvoiceDeliveryOrder[] = delivery_order.map((item: NewInvoiceDetail) => {
                //     return insertInvoiceDeliveryOrderSchema.parse({
                //         id_delivery_order: item.id,
                //         id_invoice: data.id,
                //     });
                // });

                // await deleteInvoiceDeliveryOrder(data.id, tx);
                // dataDeliveryOrder = await createInvoiceDeliveryOrder(validateDeliveryOrder, tx);
                if (data.status == "O") {
                    for (const deliveryOrder of dataDeliveryOrder) {
                        await updateDiterimaDeliveryOrder(deliveryOrder.id_delivery_order, tx);
                    }
                }
            } else {
                const validateDetail = detail.map((item: NewInvoiceDetail, index: number) => {
                    return insertInvoiceDetailSchema.parse({
                        ...item,
                        id: data.id,
                        urut: index + 1,
                        qty: ToString(item.qty),
                        harga: ToString(item.harga),
                        harga_asli: ToString(item.harga_asli),
                        total: ToString(item.total),
                        diskonrp: ToString(item.diskonrp),
                        diskonpersen: ToString(item.diskonpersen),
                    });
                });
                await deleteInvoiceDetail(data.id, tx);
                dataDetail = await createInvoiceDetail(validateDetail, tx);
                if (data.status == "O") {
                    await updateStatusInvoiceOpen(data, validateDetail, tx);
                }
            }

            if (validate.status == "S") {
                // persetujuan
                await deleteInvoicePersetujuan(data.id, tx);
                const lPersetujuan = await createInvoicePersetujuanBySetting(data.id, req.user!.id, tx);
                io.emit("update-persetujuan-invoice");

                // hapus jurnal
                await deleteAccGlTrans(data.nomor, tx);
                await createJurnal(data, jurnal, tx);

                return { ...data, detail: dataDetail, persetujuan: lPersetujuan };
            }

            if (data.status == "O") {
                const validateAccAr = insertAccArFakturSchema.parse({
                    invoice: data.nomor,
                    invoice_date: formatDate(data.tanggal),
                    id_customer: data.id_kontak,
                    id_top: data.id_top,
                    top: data.top,
                    amount: data.grandtotal,
                    pay: "0",
                    discount: data.total_discount,
                    due_date: formatDate(data.tanggal_jatuh_tempo as string),
                });

                // hapus acc_ar_faktur
                await deleteAccArFaktur(data.nomor, tx);
                await createAccArFaktur(validateAccAr, tx);

                // hapus jurnal
                await deleteAccGlTrans(data.nomor, tx);
                await createJurnal(data, jurnal, tx);
            }
            return { ...data, detail: dataDetail, delivery_order: dataDeliveryOrder };
        });
        return res.status(200).json({
            message: "Success Update Invoice",
            data: data,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const destroy = async (req: MyRequest, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
        const data = await db.transaction(async (tx) => {
            // check persetujuan purchase_request
            const [dataApPersetujuan] = await getInvoicePersetujuan(id, tx);
            if (dataApPersetujuan?.tanggal_persetujuan != null) {
                throw ValidationError("AP Sudah ada Persetujuan");
            }
            await deleteInvoicePersetujuan(id, tx);
            const data = await deleteInvoice(id, tx);
            return data;
        });
        return res.status(200).json({
            message: "Success Delete Invoice",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const journalCetak = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const dataPaymentAp = await getInvoiceById(parseInt(req.params.id));

        const data = await getAccGlTransByReference(dataPaymentAp.nomor);
        res.status(200).json({
            message: "Success get journal voucher",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const cetak = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get Data
        const id: number = parseInt(req.params.id, 10);
        const data = await getInvoiceById(id);
        const dataDetail = await getInvoiceDetail(id);

        const perusahaan = await getInternalPerusahaanById(COMPANY_ID);

        // Generate PDF
        const module = "invoice";

        const { browser, page, template } = await setupPuppeteer();

        const { templateContent, htmlContent } = generateHTMLContent({ ...data, detail: dataDetail }, perusahaan, module, template);

        await injectStylesAndScripts(page, htmlContent);

        const pdfBuffer = await generatePDF(page);

        sendPDFResponse(res, pdfBuffer);

        await browser.close();
    } catch (error) {
        next(error);
    }
};

export const storeWithSO = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const { ...rest } = req.body;

        const data = await db.transaction(async (tx) => {
            const dataSalesOrder = await getSalesOrderById(rest.id, tx);
            const dataSalesOrderDetail = await getSalesOrderDetailById(dataSalesOrder.id, tx);
            const customer = await getKontakById(dataSalesOrder.id_customer, tx);

            const tanggal = dayjs().tz("Asia/Makassar");
            const tanggal_jatuh_tempo = tanggal.clone().add(customer.top, "days");

            const nomorFix = await nomorInvoice(tanggal.format("YYYY-MM-DD"), tx);

            const dataGudang = await getGudangById(dataSalesOrder.id_gudang as number, tx);

            const validate = insertInvoiceSchema.parse({
                ...dataSalesOrder,
                id: undefined,
                id_so: dataSalesOrder.id,
                nomor: nomorFix,
                status: "D",
                tanggal: tanggal.format("YYYY-MM-DD"),
                tanggal_jatuh_tempo: tanggal_jatuh_tempo.format("YYYY-MM-DD"),
                id_kontak: customer.id,
                id_kantor: dataGudang.id_kantor,
                total: dataSalesOrder.subtotal,
                created_by: req.user?.id,
                updated_by: req.user?.id,
                created_at: undefined,
                updated_at: undefined,
                is_stok: true,
            });
            const today = dayjs();
            if (dayjs(validate.tanggal, "YYYY-MM-DD").isAfter(today)) {
                throw ValidationError("Tanggal tidak boleh lebih dari hari ini");
            }
            const data = await createInvoice(validate, tx);

            const validateDetail = dataSalesOrderDetail.map((item: SalesOrderDetail, index: number) => {
                return insertInvoiceDetailSchema.parse({
                    ...item,
                    id: data.id,
                    urut: index + 1,
                    qty: ToString(item.qty),
                    harga: ToString(item.harga),
                    keterangan: item.note,
                    total: ToString(item.total),
                    diskonrp: ToString(item.diskonrp),
                    diskonpersen: ToString(item.diskonpersen),
                });
            });

            const dataDetail = await createInvoiceDetail(validateDetail, tx);

            return { ...data, detail: dataDetail, delivery_order: [] };
        });
        return res.status(200).json({
            message: "Success Create Invoice",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const storeWithPengirimanBarang = async (req: MyRequest, res: Response, next: NextFunction) => {
    try {
        const data = await db.transaction(async (tx) => {
            // Bedah data
            const list_pengiriman_barang = req.body.list_pengiriman_barang;

            const id_customer = list_pengiriman_barang[0].id_customer;
            const customer = await getKontakById(id_customer, tx);

            const id_so = list_pengiriman_barang[0].id_so;
            const dataSalesOrder = await getSalesOrderById(id_so, tx);

            const dataGudang = await getGudangById(dataSalesOrder.id_gudang as number, tx);
            const tanggal = dayjs();
            const tanggal_jatuh_tempo = tanggal.clone().add(customer.top, "days");

            // Nomor AP
            const nomorFix = await nomorInvoice(formatDate(tanggal.toDate()), tx);

            const validate = insertInvoiceSchema.parse({
                nomor: nomorFix,
                tanggal: formatDate(tanggal.toDate()),
                id_kontak: dataSalesOrder.id_customer,
                id_gudang: dataSalesOrder.id_gudang,
                id_so: dataSalesOrder.id,
                id_top: customer.id_top,
                top: dataSalesOrder.top,
                alamat: customer.alamat_penagihan,
                tanggal_jatuh_tempo: formatDate(tanggal_jatuh_tempo.toDate()),
                status: "D",
                referensi: null,
                keterangan: `Invoice Kepada ${customer.kontak}`,
                tanggal_referensi: null,
                pajak: [],
                id_salesman: req.user?.id,
                id_kantor: dataGudang.id_kantor,
                total_discount: null,
                total_pajak: null,
                total: dataSalesOrder.subtotal,
                persendiskon: dataSalesOrder.diskonpersen,
                grandtotal: dataSalesOrder.grandtotal,
                biaya_transportasi: "0",
                biaya_asuransi: "0",
                biaya_bongkar_muat: "0",
                biaya_bongkar_muat_external: "0",
                created_by: req.user?.id,
                updated_by: req.user?.id,
            });

            // Buat AP
            const data = await createInvoice(validate, tx);
            const validateDetail: NewInvoiceDetail[] = [];
            const validateDeliveryOrder: NewInvoiceDeliveryOrder[] = [];
            let index = 0;
            const dataSalesOrderDetail = await getSalesOrderDetailById(dataSalesOrder.id, tx);

            let TotalPajak = 0;
            let SubTotal = 0;
            for (const pengiriman_barang of list_pengiriman_barang) {
                const dataPengirimanBarang = await getDeliveryOrderById(pengiriman_barang.id, tx);
                const dataPengirimanBarangDetail = await getDeliveryOrderDetailById(pengiriman_barang.id, tx);

                for (const detail of dataPengirimanBarangDetail) {
                    const detailSalesOrder = dataSalesOrderDetail.find((d) => d.nama_barang == detail.nama_barang);
                    const total = (parseFloat(detailSalesOrder?.harga as string) - parseFloat((detailSalesOrder?.diskonrp as string) || "0")) * parseFloat(detail.qty);
                    validateDetail.push(
                        insertInvoiceDetailSchema.parse({
                            ...detail,
                            id: data.id,
                            id_so: dataSalesOrder.id,
                            id_do: dataPengirimanBarang.id,
                            urut: ++index,
                            qty: ToString(detail.qty),
                            total: ToString(total),
                            diskonpersen: ToString(detailSalesOrder?.diskonpersen),
                            diskonrp: ToString(detailSalesOrder?.diskonrp),
                            keterangan: detailSalesOrder?.note,
                            harga: ToString(detailSalesOrder?.harga),
                            harga_asli: ToString(detailSalesOrder?.harga),
                            id_pajak: detailSalesOrder?.id_pajak,
                            persen_pajak: detailSalesOrder?.persen_pajak,
                        }),
                    );
                    const pajak = detailSalesOrder?.persen_pajak
                        ?.split(",")
                        .reduce(
                            (a, b) => a + (((parseFloat(detailSalesOrder?.harga as string) - parseFloat((detailSalesOrder.diskonrp as string) || "0")) * parseFloat(b)) / 100) * parseFloat(detail.qty),
                            0,
                        );
                    TotalPajak += pajak || 0;
                    SubTotal += total;
                }

                // Validasi PB Detail
                validateDeliveryOrder.push(
                    insertInvoiceDeliveryOrderSchema.parse({
                        id_invoice: data.id,
                        id_delivery_order: dataPengirimanBarang.id,
                    }),
                );
            }
            const dpp = SubTotal - (SubTotal * parseFloat((data.diskonpersen as string) || "0")) / 100;
            const updateValidate = updateInvoiceSchema.parse({
                ...data,
                tanggal: formatDate(data.tanggal),
                tanggal_jatuh_tempo: formatDate(data.tanggal_jatuh_tempo as string),
                total: ToString(SubTotal),
                dpp: ToString(dpp),
                total_pajak: ToString(TotalPajak),
                grandtotal: ToString(dpp - TotalPajak),
                updated_at: undefined,
            });

            await updateInvoice(data.id, updateValidate, tx);

            const dataDetail = await createInvoiceDetail(validateDetail, tx);
            const dataDeliveryOrder = await createInvoiceDeliveryOrder(validateDeliveryOrder, tx);

            return { ...data, detail: dataDetail, pengiriman_ap: dataDeliveryOrder };
        });

        return res.status(200).json({
            message: "Success Create Invoice",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
