import { and, desc, eq, gt, inArray, notExists, sql } from "drizzle-orm";
import { NotFoundError, ValidationError } from "../../libs/errors";
import { quotation } from "../quotation/schema";
import { updateStatusQuotation } from "../quotation/service";
import { alias } from "drizzle-orm/pg-core";
import { delivery_order } from "../delivery_order/schema";
import { gudang } from "../gudang/schema";
import { invoice } from "../invoice/schema";
import { kontak } from "../kontak/schema";
import { Pegawai, pegawai } from "../pegawai/schema";
import { barang } from "../barang/schema";
import { satuan } from "../satuan/schema";
import { sales_order_detail } from "./detail/schema";
import { SalesOrder, salesOrderColumns, sales_order, NewSalesOrder, UpdateSalesOrder } from "./schema";
import { moduleNumberGenerator } from "../../libs/nomor";
import { SalesOrderPersetujuan } from "./persetujuan/schema";
import { getSalesOrderSettings } from "./setting/service";
import { jabatanPersetujuanStrings, persetujuanStrings } from "../schema";
import { getPegawaiById, getPegawaiHeadDepartemen, getPegawaiByIdJabatan } from "../pegawai/service";
import { createSalesOrderPersetujuan, getSalesOrderPersetujuanByPegawai } from "./persetujuan/service";

export const nomorSalesOrder = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("sales_order", "nomor", "tanggal", "SO", tanggal, tx);
};

export const getSalesOrder = async (params: any) => {
    let status = params.status;
    let query = `SELECT a.*, b.nama as created_name, i.nama as salesman, c.nama as modified_name, d.name as created_jabatan, e.name as modified_jabatan, f.kontak as customer, g.gudang, h.nomor as no_quotation
                  FROM sales_order a
                    LEFT JOIN hr.pegawai b ON b.id=a.created_by 
                    LEFT JOIN hr.pegawai c ON c.id=a.updated_by 
                    LEFT JOIN hr.jabatan d ON d.id=b.id_jabatan 
                    LEFT JOIN hr.jabatan e ON e.id=c.id_jabatan 
                    LEFT JOIN kontak f ON f.id=a.id_customer
                    LEFT JOIN gudang g ON g.id=a.id_gudang
                    LEFT JOIN quotation h ON h.id=a.id_quotation
                    LEFT JOIN hr.pegawai i ON i.id=a.id_salesman
                      WHERE true `;
    if (status !== null && status !== undefined) {
        if (typeof status === "string") {
            query += ` AND a.status='${status}' `;
        } else if (Array.isArray(status)) {
            const statusValues = status.map((s) => `'${s}'`).join(", ");
            query += ` AND a.status IN (${statusValues}) `;
        }
    }
    query += ` ORDER BY a.tanggal DESC`;
    const data = await db.execute(sql.raw(query));
    return data;
};

export const getOptionSalesOrder = async (module: string, tx = db) => {
    switch (module) {
        case "invoice":
            return await tx
                .select({
                    id: sales_order.id,
                    nomor: sales_order.nomor,
                    tanggal: sales_order.tanggal,
                    customer: kontak.kontak,
                    referensi: sales_order.referensi,
                    no_quotation: quotation.nomor,
                    gudang: gudang.gudang,
                    grandtotal: sales_order.grandtotal,
                })
                .from(sales_order)
                .innerJoin(kontak, eq(kontak.id, sales_order.id_customer))
                .innerJoin(gudang, eq(gudang.id, sales_order.id_gudang))
                .leftJoin(quotation, eq(quotation.id, sales_order.id_quotation))
                .where(
                    and(
                        inArray(sales_order.status, ["O"]),
                        notExists(tx.select().from(delivery_order).where(eq(delivery_order.id_so, sales_order.id))),
                        notExists(tx.select().from(invoice).where(eq(invoice.id_so, sales_order.id))),
                    ),
                );

        case "do":
            return await tx
                .select({
                    id: sales_order.id,
                    nomor: sales_order.nomor,
                    tanggal: sales_order.tanggal,
                    referensi: sales_order.referensi,
                    tanggal_referensi: sales_order.tanggal_referensi,
                    customer: kontak.kontak,
                    gudang: gudang.gudang,
                    no_quotation: quotation.nomor,
                })
                .from(sales_order)
                .innerJoin(kontak, eq(kontak.id, sales_order.id_customer))
                .innerJoin(gudang, eq(gudang.id, sales_order.id_gudang))
                .leftJoin(quotation, eq(quotation.id, sales_order.id_quotation))
                .where(
                    and(
                        inArray(sales_order.status, ["O", "P"]),
                        notExists(
                            tx
                                .select({id: delivery_order.id})
                                .from(delivery_order)
                                .where(and(eq(sales_order.id, delivery_order.id_so), inArray(delivery_order.status, ['D', 'S']))),
                        ),
                        notExists(
                            tx.select({id: invoice.id})
                                .from(invoice)
                                .where(and(eq(sales_order.id, invoice.id_so))),
                        ),
                    ),
                );

        default:
            return await tx
                .select({
                    id: sales_order.id,
                    nomor: sales_order.nomor,
                    tanggal: sales_order.tanggal,
                    referensi: sales_order.referensi,
                    tanggal_referensi: sales_order.tanggal_referensi,
                    customer: kontak.kontak,
                    gudang: gudang.gudang,
                    no_quotation: quotation.nomor,
                })
                .from(sales_order)
                .innerJoin(kontak, eq(kontak.id, sales_order.id_customer))
                .innerJoin(gudang, eq(gudang.id, sales_order.id_gudang))
                .leftJoin(quotation, eq(quotation.id, sales_order.id_quotation))
                .orderBy(sales_order.tanggal);
    }
};

export const getSalesOrderById = async (id: SalesOrder["id"], tx = db) => {
    const salesMan = alias(pegawai, "salesman");
    const [data] = await tx
        .select({
            ...salesOrderColumns,
            customer: kontak.kontak,
            salesman: salesMan.nama,
            gudang: gudang.gudang,
            created_name: pegawai.nama,
        })
        .from(sales_order)
        .leftJoin(kontak, eq(kontak.id, sales_order.id_customer))
        .leftJoin(pegawai, eq(pegawai.id, sales_order.created_by))
        .leftJoin(salesMan, eq(salesMan.id, sales_order.id_salesman))
        .leftJoin(gudang, eq(gudang.id, sales_order.id_gudang))
        .where(eq(sales_order.id, id));
    return data;
};

export const createSalesOrder = async (form: NewSalesOrder, tx = db) => {
    const [data] = await tx.insert(sales_order).values(form).returning();
    return data;
};

export const updateSalesOrder = async (id: SalesOrder["id"], form: UpdateSalesOrder, tx = db) => {
    const [data] = await tx.update(sales_order).set(form).where(eq(sales_order.id, id)).returning();
    return data;
};

export const deleteSalesOrder = async (id: SalesOrder["id"], tx = db) => {
    const [data] = await tx.delete(sales_order).where(eq(sales_order.id, id)).returning();
    return data;
};


export const createSalesOrderPersetujuanBySetting = async (id: SalesOrder['id'], id_pegawai: Pegawai['id'],tx = db) => {
    const lPersetujuan: SalesOrderPersetujuan[] = [];
    const settingPersetujuan = await getSalesOrderSettings(tx);
    for (let index = 0; index < persetujuanStrings.length; index++) {
        const persetujuan = persetujuanStrings[index];
        const jabatan = jabatanPersetujuanStrings[index];
        if (settingPersetujuan[persetujuan]) {
            let dataPersetujuan;
            // ulang setiap level persetujuan
            switch (settingPersetujuan[persetujuan]) {
                case "1": // atasan langsung
                    const pegawai1 = await getPegawaiById(id_pegawai, tx);
                    if (pegawai1.atasan_langsung && pegawai1.atasan_langsung == id_pegawai) {
                        break;
                    }
                    // Persetujuan 1
                    dataPersetujuan = await createSalesOrderPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
                    lPersetujuan.push(dataPersetujuan);
                    break;

                case "2": // head departemen
                    const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
                    if (pegawai2) {
                        const check = await getSalesOrderPersetujuanByPegawai(id, pegawai2.id, tx);
                        if (pegawai2.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createSalesOrderPersetujuan(id, pegawai2.id as number, index + 1, tx);
                        lPersetujuan.push(persetujuan);
                    } else {
                        throw ValidationError("Tidak Ada pegawai pada jabatan yang dipilih");
                    }
                    break;

                case "3": // jabatan tertentu
                    const lPegawai = await getPegawaiByIdJabatan(settingPersetujuan[jabatan], tx);
                    if (lPegawai.length > 1) {
                        throw ValidationError(`Pegawai Pada Jabatan ${lPegawai[0].jabatan} lebih dari 1`);
                    }
                    const [pegawai3] = lPegawai;
                    if (pegawai3) {
                        const check = await getSalesOrderPersetujuanByPegawai(id, pegawai3.id, tx);
                        if (pegawai3.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createSalesOrderPersetujuan(id, pegawai3.id as number, index + 1, tx);
                        lPersetujuan.push(persetujuan);
                    } else {
                        throw ValidationError("Tidak Ada pegawai pada jabatan yang dipilih");
                    }
                    break;

                default:
                    break;
            }
            continue;
        }
        // jika persetujuan false hentikan loop level
        break;
    }
    return lPersetujuan
};

export const updateStatusSalesOrder = async (id: SalesOrder["id"], status: SalesOrder["status"], tx = db) => {
    try {
        const returning = await tx.transaction(async (tx) => {
            const [data] = await tx.update(sales_order).set({ status: status }).where(eq(sales_order.id, id)).returning();

            const [dataquotation] = await tx
                .select({ id: quotation.id })
                .from(quotation)
                .where(and(eq(quotation.id, data.id_quotation as number), eq(quotation.status, "O")));

            console.log(dataquotation);

            if ((status == "P" || status == "C") && dataquotation != undefined) {
                await updateStatusQuotation(dataquotation.id, "C", tx);
            }
            return data;
        });
        return returning;
    } catch (error) {
        throw NotFoundError("error");
    }
};

export const checkSisaDetail = async (id: SalesOrder["id"], tx = db) => {
    try {
        const [data] = await tx
            .select({ sisa: sql<number>`sum(sisa)` })
            .from(sales_order)
            .innerJoin(sales_order_detail, eq(sales_order_detail.id, sales_order.id))
            .where(eq(sales_order.id, id));
        if (!data) {
            throw NotFoundError("tidak ada detail sales_order");
        }

        return data.sisa;
    } catch (error) {
        throw NotFoundError("error");
    }
};

//report

export const getLaporanMonitoringSalesOrder = async (tx = db) => {
    const salesman = alias(pegawai, "salesman");
    const data = await tx
        .select({
            nomor: sales_order.nomor,
            tanggal: sales_order.tanggal,
            customer: kontak.kontak,
            referensi: sales_order.referensi,
            gudang: gudang.gudang,
            total: sales_order.grandtotal,
            created_name: pegawai.nama,
            no_penawaran: quotation.nomor,
            salesman: salesman.nama,
            delivery_order_nomor: sql<string>`STRING_AGG(delivery_order.nomor, ',')`,
            delivery_order_return_date: sql<string>`STRING_AGG(CAST(delivery_order.return_date AS TEXT), ',')`,
            invoice: invoice.nomor,
        })
        .from(sales_order)
        .innerJoin(kontak, eq(kontak.id, sales_order.id_customer))
        .innerJoin(pegawai, eq(pegawai.id, sales_order.created_by))
        .innerJoin(salesman, eq(salesman.id, sales_order.id_salesman))
        .innerJoin(gudang, eq(gudang.id, sales_order.id_gudang))
        .leftJoin(quotation, eq(quotation.id, sales_order.id_quotation))
        .leftJoin(delivery_order, eq(delivery_order.id_so, sales_order.id))
        .leftJoin(invoice, eq(invoice.referensi, sales_order.nomor))
        .groupBy(sales_order.nomor, sales_order.tanggal, kontak.kontak, sales_order.referensi, gudang.gudang, sales_order.grandtotal, pegawai.nama, quotation.nomor, salesman.nama, invoice.nomor)
        .orderBy(desc(sales_order.nomor), desc(sales_order.tanggal));
    return data;
};

export const getOutstandingSalesOrder = async (tx = db) => {
    return await tx.transaction(async (trx) => {
        return await trx
            .select({
                diorder: sales_order_detail.qty,
                dikirim: sql<string>`sales_order_detail.qty-sales_order_detail.sisa`,
                sisa: sales_order_detail.sisa,
                nomor: sales_order.nomor,
                nomor_po: sales_order.referensi,
                tanggal_po: sales_order.tanggal_referensi,
                nomor_penawaran: quotation.nomor,
                tanggal: sales_order.tanggal,
                customer: kontak.kontak,
                id_kontak: kontak.id,
                // gudang: gudang.gudang,
                // id_gudang: gudang.id,
                barang: sales_order_detail.nama_barang,
                kode_barang: barang.kode_barang,
                satuan: satuan.satuan,
            })
            .from(sales_order_detail)
            .leftJoin(sales_order, eq(sales_order.id, sales_order_detail.id))
            .leftJoin(quotation, eq(quotation.id, sales_order.id_quotation))
            .leftJoin(barang, eq(barang.id, sales_order_detail.id_barang))
            .leftJoin(satuan, eq(satuan.id, sales_order_detail.id_satuan))
            .leftJoin(kontak, eq(kontak.id, sales_order.id_customer))
            // .leftJoin(gudang, eq(gudang.id, sales_order.id_gudang))
            .where(gt(sql<number>`sales_order_detail.sisa`, 0));
    });
};
