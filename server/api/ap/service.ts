import { and, asc, desc, eq, getTableColumns, gt, like, ne, sql } from "drizzle-orm";

import { formatDate, ToString } from "../../libs/formater";
import { moduleNumberGenerator, nomorGlTrans } from "../../libs/nomor";
import { insertAccGlDetailSchema } from "../accounting/acc_gl_trans/acc_gl_detail/schema";
import { insertAccGlTransSchema } from "../accounting/acc_gl_trans/schema";
import { createAccGlTrans } from "../accounting/acc_gl_trans/service";
import { barang } from "../barang/schema";
import { insertStokBarangSchema, NewStokBarang } from "../gudang/stok_barang/schema";
import { deleteStokBarangByReff, tambahStokBarang } from "../gudang/stok_barang/service";
import { kontak } from "../kontak/schema";
import { purchase_order_detail } from "../purchase_order/detail/schema";
import { getHppFromPurchaseOrderDetail, updateSisaPurchaseOrderDetail, updateStatusDariPODetail } from "../purchase_order/detail/service";
import { purchase_order } from "../purchase_order/schema";
import { satuan } from "../satuan/schema";
import { ap_detail, ApDetail, apDetailColumns } from "./detail/schema";
import { acc_ap_faktur, AccApFaktur, ap, Ap, apColumns, NewAccApFaktur, NewAp, UpdateAp } from "./schema";
import { Pegawai } from "../pegawai/schema";
import { ApPersetujuan } from "./persetujuan/schema";
import { getApSettings } from "./setting/service";
import { jabatanPersetujuanStrings, persetujuanStrings } from "../schema";
import { getPegawaiById, getPegawaiByIdJabatan, getPegawaiHeadDepartemen } from "../pegawai/service";
import { createApPersetujuan, getApPersetujuanByPegawai } from "./persetujuan/service";
import { deleteApDetail } from "./detail/service";

export const nomorAp = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("ap", "nomor", "tanggal", "AP", tanggal, tx);
};

export const getAp = async ({ id_kontak, status }: { id_kontak?: number; status?: string }, tx = db) => {
    const query = tx
        .select({
            ...apColumns,
            supplier: kontak.kontak,
            nomor_po: purchase_order.nomor,
        })
        .from(ap)
        .leftJoin(kontak, eq(kontak.id, ap.id_supplier))
        .leftJoin(purchase_order, eq(purchase_order.id, ap.id_po));

    if (id_kontak && status) {
        query.where(and(eq(ap.id_supplier, id_kontak), eq(ap.status, status)));
    } else {
        if (id_kontak) {
            query.where(eq(ap.id_supplier, id_kontak));
        }
        if (status) {
            query.where(eq(ap.status, status));
        }
    }

    const data = await query.orderBy(desc(ap.tanggal), desc(ap.id));
    return data;
};

export const getApById = async (params: Ap["id"], tx = db) => {
    const [data] = await tx
        .select({
            ...apColumns,
            supplier: kontak.kontak,
            akun_hutang: kontak.akun_hutang,
            nomor_po: purchase_order.nomor,
        })
        .from(ap)
        .innerJoin(kontak, eq(kontak.id, ap.id_supplier))
        .leftJoin(purchase_order, eq(purchase_order.id, ap.id_po))
        .where(eq(ap.id, params));
    return data;
};

export const createAp = async (form: NewAp, tx = db) => {
    const [data] = await tx.insert(ap).values(form).returning();
    return data;
};

export const updateAp = async (params: Ap["id"], form: UpdateAp, tx = db) => {
    const [data] = await tx
        .update(ap)
        .set({ ...form, updated_at: sql`NOW()` })
        .where(eq(ap.id, params))
        .returning();
    return data;
};

export const deleteAp = async (id: Ap["id"], tx = db) => {
    try {
        const dataDetail = await deleteApDetail(id, tx);
        const [data] = await tx.delete(ap).where(eq(ap.id, id)).returning();

        const bulan = formatDate(data.tanggal, "M");
        const tahun = formatDate(data.tanggal, "YYYY");
        if (data.id_po != null) {
            for (const detail of dataDetail) {
                if (data.status == "O" && detail.id_pb == null) {
                    await tx
                        .update(purchase_order_detail)
                        .set({
                            invoice: sql`invoice - ${detail.qty}`,
                        })
                        .where(and(eq(purchase_order_detail.id, data.id_po), eq(purchase_order_detail.urut, detail.urut_po as number)));
                    // delete stok abrang by reff ap
                    const dataStok = await deleteStokBarangByReff(data.id, "AP", tx);
                    if (dataStok) {
                        await tx.execute(
                            sql.raw(`UPDATE stok_value set db${bulan}=db${bulan} - ${dataStok.stok} WHERE id_gudang=${dataStok.id_gudang} AND id_barang=${dataStok.id_barang} AND tahun=${tahun}`),
                        );
                    }
                }
            }
        }
        return data;
    } catch (error) {
        console.log(error);
        throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
    }
};

export const createApPersetujuanBySetting = async (id: Ap["id"], id_pegawai: Pegawai["id"], tx = db) => {
    const lPersetujuan: ApPersetujuan[] = [];
    const settingPersetujuan = await getApSettings(tx);
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
                    dataPersetujuan = await createApPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
                    lPersetujuan.push(dataPersetujuan);
                    break;

                case "2": // head departemen
                    const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
                    if (pegawai2) {
                        const check = await getApPersetujuanByPegawai(id, pegawai2.id, tx);
                        if (pegawai2.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createApPersetujuan(id, pegawai2.id as number, index + 1, tx);
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
                        const check = await getApPersetujuanByPegawai(id, pegawai3.id, tx);
                        if (pegawai3.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createApPersetujuan(id, pegawai3.id as number, index + 1, tx);
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
    return lPersetujuan;
};

export const updateStatusApOpen = async (AP: Ap, APDetail: ApDetail[], tx = db) => {
    const data = await tx.transaction(async (tx) => {
        const bulan = formatDate(AP.tanggal, "M");
        const tahun = formatDate(AP.tanggal, "YYYY");
        // Update PO Detail
        if (AP.id_po) {
            for (const detail of APDetail) {
                if (AP.status == "D") {
                    await tx
                        .update(purchase_order_detail)
                        .set({
                            invoice: sql`invoice + ${detail.qty}`,
                        })
                        .where(and(eq(purchase_order_detail.id, AP.id_po), eq(purchase_order_detail.urut, detail.urut_po as number)));
                } else {
                    await tx
                        .update(purchase_order_detail)
                        .set({
                            invoice: sql`invoice + ${detail.qty} - qty`,
                        })
                        .where(and(eq(purchase_order_detail.id, AP.id_po), eq(purchase_order_detail.urut, detail.urut_po as number)));
                }
            }
        }
        // delete stok abrang by reff ap
        const dataStok = await deleteStokBarangByReff(AP.id, "AP", tx);
        if (dataStok) {
            await tx.execute(sql.raw(`UPDATE stok_value set db${bulan}=db${bulan} - ${dataStok.stok} WHERE id_gudang=${dataStok.id_gudang} AND id_barang=${dataStok.id_barang} AND tahun=${tahun}`));
        }

        // Updata Stok Dari AP
        let validateStokBarang = (await Promise.all(
            APDetail.map(async (item: ApDetail) => {
                let hpp;
                // Update status PO jika ap langsung dari PO
                if (item.id_po != null && item.urut_po) {
                    hpp = await getHppFromPurchaseOrderDetail(item.id_po, item.urut_po, tx);
                    // Update sisa dan diambil di PO Detail
                    await updateSisaPurchaseOrderDetail(item.id_po, item.urut_po, item.qty, tx);
                    await updateStatusDariPODetail(item.id_po, tx);
                } else {
                    hpp = item.harga;
                }

                // Konversi jumlah barang berdasarkan satuan utama
                let [dataBarangSatuan] = await tx
                    .select({ konversi: barang_konversi.konversi })
                    .from(barang_konversi)
                    .where(and(eq(barang_konversi.id_barang, item.id_barang as number), eq(barang_konversi.id_satuan, item.id_satuan)));
                let konversi = dataBarangSatuan ? parseFloat(dataBarangSatuan.konversi) : 1;

                if (item.id_barang) {
                    return insertStokBarangSchema.parse({
                        id_gudang: AP.id_gudang,
                        id_barang: item.id_barang,
                        stok: ToString(parseFloat(item.qty) / konversi) as string,
                        stok_awal: ToString(parseFloat(item.qty) / konversi) as string,
                        tanggal: formatDate(new Date(AP.tanggal)),
                        reff: "AP",
                        id_reff: AP.id,
                        hpp: hpp,
                        created_by: AP.updated_by,
                        updated_by: AP.updated_by,
                    });
                }
                return;
            }),
        )) as NewStokBarang[];

        validateStokBarang = validateStokBarang.filter((item) => item !== undefined);
        if (validateStokBarang.length > 0) {
            await tambahStokBarang(validateStokBarang, tx);
        }
        return { ...AP, detail: APDetail };
    });

    return data;
};

export const updateApStatusByNomor = async (nomor: Ap["nomor"], status: Ap["status"], tx = db) => {
    return await tx.update(ap).set({ status: status }).where(eq(ap.nomor, nomor)).returning();
};

export const getApDetailBySupplier = async (params: ApDetail["id"], tx = db) => {
    const data = await tx
        .select({
            ...apDetailColumns,
            nama_barang: barang.nama_barang,
            kode_barang: barang.kode_barang,
            satuan: satuan.satuan,
        })
        .from(ap)
        .leftJoin(ap_detail, eq(ap_detail.id, ap.id))
        .leftJoin(barang, eq(barang.id, ap_detail.id_barang))
        .leftJoin(satuan, eq(satuan.id, ap_detail.id_satuan))
        .where(eq(ap_detail.id, params));
    return data;
};

export const checkIfApPosting = async (id: Ap["id"], tx = db) => {
    try {
        const [data] = await tx
            .select({
                status: ap.status,
            })
            .from(ap)
            .where(and(eq(ap.id, id), eq(ap.status, "C")));
        return data;
    } catch (error) {
        throw ValidationError("Not Found");
    }
};

export const createJurnal = async (data: Ap, jurnal: any, tx = db) => {
    return await tx.transaction(async (tx) => {
        //Tambah ke dalam ACC GL Trans;
        const numberGL = await nomorGlTrans(dayjs(data.tanggal).format("YYYY-MM-DD"), tx);

        const validate = insertAccGlTransSchema.parse({
            journal_code: "JAP",
            gl_number: numberGL,
            gl_date: formatDate(data.tanggal),
            note: data.keterangan,
            is_posting: true,
            reference: data.nomor,
        });

        // Tambah Detailnya
        const validateDetail = jurnal.map((item: any, index: number) => {
            return insertAccGlDetailSchema.parse({
                ...item,
                gl_number: numberGL,
                line: index + 1,
                amount: ToString(item.amount),
                description: data.keterangan,
            });
        });

        await createAccGlTrans(validate, validateDetail, tx);
    });
};

export const getAccApFaktur = async ({ id_kontak }: { id_kontak?: number }, tx = db) => {
    const Columns = getTableColumns(acc_ap_faktur);
    const query = tx
        .select({
            ...column,
            supplier: kontak.kontak,
            sisa: sql<number>`acc_ap_faktur.amount - acc_ap_faktur.pay`,
            umur_overdue: sql<number>`CURRENT_DATE - acc_ap_faktur.due_date`,
        })
        .from(acc_ap_faktur)
        .leftJoin(kontak, eq(kontak.id, acc_ap_faktur.id_supplier));

    if (id_kontak) {
        query.where(and(eq(acc_ap_faktur.id_supplier, id_kontak), gt(sql`amount - discount - pay`, 0)));
    }

    const data = await query;
    return data;
};

export const getAccApFakturByNomor = async (params: AccApFaktur["ap_number"], tx = db) => {
    const [data] = await tx.select().from(acc_ap_faktur).where(eq(acc_ap_faktur.ap_number, params));
    return data;
};

export const getAccApFakturByDate = async (params: AccApFaktur["date"], tx = db) => {
    // format date: yyyy-mm-dd
    const [day, month, year] = params.split("-").map(Number);

    const Columns = getTableColumns(acc_ap_faktur);
    const data = await tx
        .select({ ...column, kontak: kontak.kontak })
        .from(acc_ap_faktur)
        .leftJoin(kontak, eq(kontak.id, acc_ap_faktur.id_supplier))
        .where(
            and(
                sql`amount - pay > 0`,
                sql`date < ${new Date(year, month - 1, day)}`, // TODO: fix this
            ),
        );
    return data;
};

export const getAccApFakturBySupplier = async (params: AccApFaktur["id_supplier"], tx = db) => {
    const data = await tx.select().from(acc_ap_faktur).where(eq(acc_ap_faktur.id_supplier, params));
    return data;
};

export const getAccApFakturSaldoAwal = async (tx = db) => {
    const Columns = getTableColumns(acc_ap_faktur);
    const data = await tx
        .select({
            ...column,
            kontak: kontak.kontak,
        })
        .from(acc_ap_faktur)
        .innerJoin(kontak, eq(kontak.id, acc_ap_faktur.id_supplier))
        .where(like(acc_ap_faktur.ap_number, "API%"));
    return data;
};

export const isCanEdit = async (ap_number: NewAccApFaktur["ap_number"], tx = db) => {
    const [data] = await tx.select({ pay: acc_ap_faktur.pay }).from(acc_ap_faktur).where(eq(acc_ap_faktur.ap_number, ap_number));
    return (data.pay as string) == "0";
};

export const createAccApFaktur = async (form: NewAccApFaktur, tx = db) => {
    try {
        const [data] = await tx.insert(acc_ap_faktur).values(form).returning();
        return data;
    } catch (error) {
        console.error(error);
        throw ValidationError("Gagal membuat acc ap faktur");
    }
};

export const updateAccApFaktur = async (params: AccApFaktur["ap_number"], form: NewAccApFaktur, tx = db) => {
    const [data] = await tx
        .update(acc_ap_faktur)
        .set({
            amount: form.amount,
            ap_number: form.ap_number,
            date: form.date,
            due_date: form.due_date,
            id_supplier: form.id_supplier,
            invoice_date: form.invoice_date,
            invoice_number: form.invoice_number,
            top: form.top,
        })
        .where(eq(acc_ap_faktur.ap_number, params))
        .returning();
    return data;
};

export const updateAmountAccApFaktur = async (ap_number: string, form: { pay: string; discount: string }, tx = db) => {
    await tx
        .update(acc_ap_faktur)
        .set({
            pay: sql`acc_ap_faktur.pay + ${form.pay}`,
            discount: sql`acc_ap_faktur.discount + ${form.discount}`,
        })
        .where(eq(acc_ap_faktur.ap_number, ap_number))
        .returning();
};

export const deleteAccApFaktur = async (id: AccApFaktur["ap_number"], tx = db) => {
    const [data] = await tx.delete(acc_ap_faktur).where(eq(acc_ap_faktur.ap_number, id)).returning();
    return data;
};

export const getLaporanAp = async (tx = db) => {
    return await tx.transaction(async (tx) => {
        const accApFakturColumns = getTableColumns(acc_ap_faktur);
        const data = await tx
            .selectDistinct({
                id_supplier: acc_ap_faktur.id_supplier,
                kode_supplier: kontak.kode,
                supplier: kontak.kontak,
            })
            .from(acc_ap_faktur)
            .leftJoin(kontak, eq(acc_ap_faktur.id_supplier, kontak.id))
            .where(gt(sql<number>`acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount`, 0));

        const detail = await tx
            .select({
                ...accApFakturColumn,
                // po_number: purchase_order.nomor,
                keterangan: ap.keterangan,
                customer: kontak.kontak,
                code_customer: kontak.kode,
                sisa: sql<string>`acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount`,
                umur_overdue: sql<number>`CURRENT_DATE - acc_ap_faktur.due_date`,
            })
            .from(acc_ap_faktur)
            .leftJoin(kontak, eq(acc_ap_faktur.id_supplier, kontak.id))
            .leftJoin(ap, eq(acc_ap_faktur.ap_number, ap.nomor))
            // .leftJoin(purchase_order, eq(ap.id_po, purchase_order.id))
            .where(gt(sql<number>`acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount`, 0))
            .orderBy(asc(kontak.kontak), asc(acc_ap_faktur.date));
        return data.map((item: any) => {
            const children = detail
                .filter((detail: any) => detail.id_supplier === item.id_supplier)
                .map((detail, index) => {
                    return {
                        key: `${item.id_supplier}-${index}`,
                        data: {
                            ...detail,
                            style: "font-normal",
                            sisa: parseFloat(detail.sisa),
                            amount: parseFloat(detail.amount),
                        },
                    };
                });

            // Calculate the total for the last child node
            if (children.length > 0) {
                // const lastChildIndex = children.length - 1;
                // const lastChild = children[lastChildIndex];
                const amount = children.reduce((sum, child) => {
                    return sum + (child.data.amount || 0);
                }, 0);
                const sisa = children.reduce((sum, child) => {
                    return sum + (child.data.sisa || 0);
                }, 0);

                // lastChild.data.amount = amount.toString();
                // lastChild.data.sisa = sisa;
                children.push({
                    key: `${item.id_supplier}-total`,
                    data: {
                        style: "font-bold",
                        due_date: "Total",
                        amount: amount,
                        sisa: sisa,
                    },
                } as any);
            }

            return {
                key: item.id_supplier,
                data: {
                    style: "font-bold",
                    ap_number: item.kode_supplier,
                    date: item.supplier,
                },
                children,
            };
        });
    });
};

export const getUmurInvoiceAp = async (tx = db) => {
    const data = await tx
        .select({
            customer_code: kontak.kode,
            customer_name: kontak.kontak,
            total_pembayaran: sql`SUM(acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount)`,
            days1: sql`SUM(CASE WHEN CURRENT_DATE - acc_ap_faktur.invoice_date BETWEEN 0 AND 30 THEN acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount ELSE 0 END)`,
            days2: sql`SUM(CASE WHEN CURRENT_DATE - acc_ap_faktur.invoice_date BETWEEN 31 AND 60 THEN acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount ELSE 0 END)`,
            days3: sql`SUM(CASE WHEN CURRENT_DATE - acc_ap_faktur.invoice_date BETWEEN 61 AND 90 THEN acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount ELSE 0 END)`,
            days4: sql`SUM(CASE WHEN CURRENT_DATE - acc_ap_faktur.invoice_date BETWEEN 91 AND 120 THEN acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount ELSE 0 END)`,
            days5: sql`SUM(CASE WHEN CURRENT_DATE - acc_ap_faktur.invoice_date > 120 THEN acc_ap_faktur.amount - acc_ap_faktur.pay - acc_ap_faktur.discount ELSE 0 END)`,
        })
        .from(acc_ap_faktur)
        .innerJoin(kontak, eq(kontak.id, acc_ap_faktur.id_supplier))
        .where(ne(sql<number>`amount - pay - discount`, 0))
        .groupBy(acc_ap_faktur.id_supplier, kontak.kontak, kontak.kode)
        .orderBy(kontak.kontak);
    return data;
};
