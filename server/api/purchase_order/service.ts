import { and, asc, eq, gt, inArray, notExists, SQL, sql } from "drizzle-orm";

import { moduleNumberGenerator } from "../../libs/nomor";
import { ap } from "../ap/schema";
import { barang } from "../barang/schema";
import { gudang } from "../gudang/schema";
import { jabatan } from "../jabatan/schema";
import { kontak } from "../kontak/schema";
import { Pegawai, pegawai } from "../pegawai/schema";
import { getPegawaiById, getPegawaiByIdJabatan, getPegawaiHeadDepartemen } from "../pegawai/service";
import { penerimaan_barang } from "../penerimaan_barang/schema";
import { satuan } from "../satuan/schema";
import { jabatanPersetujuanStrings, persetujuanStrings } from "../schema";
import { top } from "../top/schema";
import { uang_muka } from "../uang_muka/schema";
import { purchase_order_detail } from "./detail/schema";
import { PurchaseOrderPersetujuan } from "./persetujuan/schema";
import { createPurchaseOrderPersetujuan, getPurchaseOrderPersetujuanByPegawai } from "./persetujuan/service";
import { NewPurchaseOrder, poColumns, purchase_order, PurchaseOrder, UpdatePurchaseOrder } from "./schema";
import { getPurchaseOrderSettings } from "./setting/service";

export const nomorPurchaseOrder = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("purchase_order", "nomor", "tanggal", "PO", tanggal, tx);
};

export const getPurchaseOrder = async (id_pegawai: number, tx = db) => {
    const data = await tx.execute(
        sql.raw(`SELECT a.*, b.nama as pegawai, c.kontak, CASE WHEN d.keterangan = 'Custom' THEN ('NET ' || a.top) ELSE d.keterangan END AS top_keterangan,
        array_to_string(
            array(
                SELECT 
                    CASE 
                        WHEN aa.status IS TRUE THEN 'Telah disetujui oleh ' || bb.nama
                        WHEN aa.status IS FALSE AND aa.tanggal_persetujuan IS NOT NULL THEN 'Ditolak oleh ' || bb.nama
                        ELSE 'Menunggu Persetujuan ' || bb.nama
                    END
                FROM 
                    purchase_order_persetujuan aa 
                    INNER JOIN hr.pegawai bb ON bb.id = aa.id_pegawai
                WHERE 
                    aa.id = a.id
            ),
            ', '
        ) AS status_keterangan
    FROM 
        purchase_order a 
        INNER JOIN hr.pegawai b ON a.created_by = b.id
        INNER JOIN top d ON a.id_top = d.id
		LEFT JOIN kontak c ON c.id=a.id_supplier
        ORDER BY a.tanggal DESC, a.nomor DESC
    `),
    );
    return data;
};

export const getPurchaseOrderOptionUangMuka = async (tx = db) => {
    const data = await tx.execute(
        sql.raw(`SELECT a.*, b.nama as pegawai, c.kontak
                FROM 
                    purchase_order a 
                    INNER JOIN hr.pegawai b ON a.created_by = b.id
                    LEFT JOIN kontak c ON c.id=a.id_supplier
                    WHERE a.id NOT IN (select aa.id_po FROM uang_muka aa where aa.id_po=a.id) 
                    AND a.status='O' 
                    AND a.id NOT IN (SELECT bb.id_po FROM ap bb WHERE bb.id_po=a.id)
                `),
    );
    return data;
};

export const getPurchaseOrderOption = async (module = "", tx = db) => {
    const where: SQL[] = [];
    switch (module) {
        case "pb":
            return await tx
                .select({
                    id: purchase_order.id,
                    nomor: purchase_order.nomor,
                    tanggal: purchase_order.tanggal,
                    id_supplier: purchase_order.id_supplier,
                    id_gudang: purchase_order.id_gudang,
                    supplier: kontak.kontak,
                    supplier_alamat_kirim: kontak.alamat_kirim,
                    gudang: gudang.gudang,
                    referensi: purchase_order.referensi,
                })
                .from(purchase_order)
                .innerJoin(kontak, eq(kontak.id, purchase_order.id_supplier))
                .innerJoin(gudang, eq(gudang.id, purchase_order.id_gudang))
                .where(
                    and(
                        inArray(purchase_order.status, ["O", "P"]),
                        notExists(
                            tx
                                .select()
                                .from(penerimaan_barang)
                                .where(and(eq(purchase_order.id, penerimaan_barang.id_po), eq(penerimaan_barang.status, "D"))),
                        ),
                        notExists(tx.select().from(ap).where(eq(purchase_order.id, ap.id_po))),
                    ),
                );

        case "ap":
            return await tx
                .select({
                    ...poColumns,
                    supplier: kontak.kontak,
                    gudang: gudang.gudang,
                })
                .from(purchase_order)
                .innerJoin(kontak, eq(kontak.id, purchase_order.id_supplier))
                .innerJoin(gudang, eq(gudang.id, purchase_order.id_gudang))
                .where(
                    and(
                        inArray(purchase_order.status, ["O"]),
                        notExists(tx.select().from(penerimaan_barang).where(eq(purchase_order.id, penerimaan_barang.id_po))),
                        notExists(tx.select().from(ap).where(eq(purchase_order.id, ap.id_po))),
                    ),
                );
        case "uang-muka":
            return await tx
                .select({
                    ...poColumns,
                    supplier: kontak.kontak,
                    gudang: gudang.gudang,
                })
                .from(purchase_order)
                .innerJoin(kontak, eq(kontak.id, purchase_order.id_supplier))
                .innerJoin(gudang, eq(gudang.id, purchase_order.id_gudang))
                .where(
                    and(
                        inArray(purchase_order.status, ["O"]),
                        notExists(tx.select().from(uang_muka).where(eq(purchase_order.id, uang_muka.id_po))),
                        notExists(tx.select().from(ap).where(eq(purchase_order.id, ap.id_po))),
                    ),
                );

        default:
            // if (status.length > 0) {
            // 	where.push(inArray(purchase_order.status, status));
            // }
            // data = await query.where(and(...where)).orderBy(asc(purchase_order.tanggal), asc(purchase_order.id));
            break;
    }

    // TODO: exception agak susah sih, karena harus nunggu data PB atau AP selesai load;
    // if (exception != "") {
    // 	where.push(eq(purchase_order.id, parseInt(exception)));
    // }

    return [];
};

export const getPurchaseOrderById = async (params: PurchaseOrder["id"], tx = db) => {
    const [data] = await tx
        .select({
            ...poColumns,
            created_name: pegawai.nama,
            created_jabatan: jabatan.jabatan,
            supplier: kontak.kontak,
            supplier_alamat_kirim: kontak.alamat_kirim,
            top_keterangan: sql`(CASE 
                                    WHEN top.keterangan='Custom' THEN purchase_order.top || ' Day'
                                    ELSE top.keterangan
                                END)`.as("top_keterangan"),
        })
        .from(purchase_order)
        .leftJoin(pegawai, eq(pegawai.id, purchase_order.created_by))
        .leftJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .leftJoin(kontak, eq(kontak.id, purchase_order.id_supplier))
        .innerJoin(top, eq(top.id, purchase_order.id_top))
        .where(eq(purchase_order.id, params));
    return data;
};

export const createPurchaseOrder = async (form: NewPurchaseOrder, tx = db) => {
    const [data] = await tx.insert(purchase_order).values(form).returning();
    return data;
};

export const updatePurchaseOrder = async (id: PurchaseOrder["id"], form: UpdatePurchaseOrder, tx = db) => {
    const [data] = await tx
        .update(purchase_order)
        .set({ ...form, updated_at: sql`NOW()` })
        .where(eq(purchase_order.id, id))
        .returning();
    return data;
};

export const deletePurchaseOrder = async (id: PurchaseOrder["id"], tx = db) => {
    const [data] = await tx.delete(purchase_order).where(eq(purchase_order.id, id)).returning();
    return data;
};

export const createPurchaseOrderPersetujuanBySetting = async (id: PurchaseOrder["id"], id_pegawai: Pegawai["id"], tx = db) => {
    const lPersetujuan: PurchaseOrderPersetujuan[] = [];
    const settingPersetujuan = await getPurchaseOrderSettings(tx);
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
                    dataPersetujuan = await createPurchaseOrderPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
                    lPersetujuan.push(dataPersetujuan);
                    break;

                case "2": // head departemen
                    const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
                    if (pegawai2) {
                        const check = await getPurchaseOrderPersetujuanByPegawai(id, pegawai2.id, tx);
                        if (pegawai2.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createPurchaseOrderPersetujuan(id, pegawai2.id as number, index + 1, tx);
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
                        const check = await getPurchaseOrderPersetujuanByPegawai(id, pegawai3.id, tx);
                        if (pegawai3.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createPurchaseOrderPersetujuan(id, pegawai3.id as number, index + 1, tx);
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

export const getBarangTracking = async (params: number, tx = db) => {
    const data = await tx
        .select()
        .from(barang)
        .where(and(eq(barang.id, params), eq(barang.is_stok, true)));
    if (data == undefined || data == null) {
        return true;
    }
    return false;
};

export const checkSisaDetail = async (id: number, urut: number, sisa: string, tx = db) => {
    const data = await tx
        .select()
        .from(purchase_order_detail)
        .where(and(eq(purchase_order_detail.id, id), eq(purchase_order_detail.urut, urut)));

    if (data === undefined || data === null) {
        return false;
    }

    if (parseFloat(data[0].sisa) < parseFloat(sisa)) {
        return false;
    }

    return true;
};

export const checkWithPB = async (params: PurchaseOrder["id"], tx = db) => {
    const data = await tx
        .select({
            with_pb: sql`CASE WHEN purchase_order_detail.id_barang IS NOT NULL AND barang.is_stok THEN TRUE ELSE FALSE END as with_pb`,
        })
        .from(purchase_order_detail)
        .leftJoin(barang, eq(purchase_order_detail.id_barang, barang.id))
        .where(eq(purchase_order_detail.id, params));

    const PB = data.includes({ with_pb: true });
    return PB;
};

export const getOutstandingPO = async (tx = db) => {
    return await tx.transaction(async (trx) => {
        return await trx
            .select({
                diorder: purchase_order_detail.qty,
                diambil: purchase_order_detail.diambil,
                sisa: purchase_order_detail.sisa,
                po_number: purchase_order.nomor,
                po_date: purchase_order.tanggal,
                supplier: kontak.kontak,
                id_supplier: kontak.id,
                gudang: gudang.gudang,
                id_gudang: gudang.id,
                nama_barang: purchase_order_detail.nama_barang,
                kode_barang: barang.kode_barang,
                satuan: satuan.satuan,
            })
            .from(purchase_order_detail)
            .leftJoin(purchase_order, eq(purchase_order.id, purchase_order_detail.id))
            .leftJoin(barang, eq(barang.id, purchase_order_detail.id_barang))
            .leftJoin(satuan, eq(satuan.id, purchase_order_detail.id_satuan))
            .leftJoin(kontak, eq(kontak.id, purchase_order.id_supplier))
            .leftJoin(gudang, eq(gudang.id, purchase_order.id_gudang))
            .where(gt(sql<number>`purchase_order_detail.sisa`, 0))
            .orderBy(asc(purchase_order.tanggal), asc(purchase_order.id), asc(purchase_order_detail.id), asc(purchase_order_detail.urut));
    });
};
