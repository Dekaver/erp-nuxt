import { and, desc, eq, notInArray, SQL, sql } from "drizzle-orm";

import { barang } from "../barang/schema";
import { jabatan } from "../jabatan/schema";
import { Pegawai, pegawai } from "../pegawai/schema";
import { NewPurchaseRequest, PurchaseRequest, prColumns, purchase_request, UpdatePurchaseRequest } from "./schema";
import { moduleNumberGenerator } from "../../libs/nomor";
import { jabatanPersetujuanStrings, persetujuanStrings } from "../schema";
import { PurchaseRequestPersetujuan } from "./persetujuan/schema";
import { getPurchaseRequestSettings } from "./setting/service";
import { getPegawaiById, getPegawaiByIdJabatan, getPegawaiHeadDepartemen } from "../pegawai/service";
import { createPurchaseRequestPersetujuan, getPurchaseRequestPersetujuanByPegawai } from "./persetujuan/service";

export const nomorPurchaseRequest = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("purchase_request", "nomor", "tanggal", "PR", tanggal, tx);
};

export const getPurchaseRequest = async (id_pegawai: number, tx = db) => {
    const data = await tx.execute(
        sql.raw(`SELECT a.*, b.nama as pegawai, 
        array_to_string(
            array(
                SELECT 
                    CASE 
                        WHEN aa.status IS TRUE THEN 'Telah Disetujui oleh ' || bb.nama
                        WHEN aa.status IS FALSE AND aa.tanggal_persetujuan IS NOT NULL THEN 'Ditolak oleh ' || bb.nama
                        ELSE 'Menunggu Persetujuan ' || bb.nama
                    END
                FROM 
                    purchase_request_persetujuan aa 
                    INNER JOIN hr.pegawai bb ON bb.id = aa.id_pegawai
                WHERE 
                    aa.id = a.id
            ),
            ', '
        ) AS status_keterangan
    FROM 
        purchase_request a 
        INNER JOIN hr.pegawai b ON a.created_by = b.id
        ORDER BY a.tanggal DESC, a.id DESC
    `),
    );
    return data;
};

export const getOptionPurchaseRequest = async (module: string, tx = db) => {
    const whereConditioal: SQL[] = [];
    if (module === "po") {
        whereConditioal.push(notInArray(purchase_request.id, sql`(select id_pr from purchase_order_detail)`));
    }
    const data = await tx
        .select({
            id: purchase_request.id,
            nomor: purchase_request.nomor,
            tanggal: purchase_request.tanggal,
            keterangan: purchase_request.keterangan,
            status: purchase_request.status,
            dpp: purchase_request.dpp,
            total: purchase_request.total,
            total_discount: purchase_request.total_discount,
            persendiskon: purchase_request.persendiskon,
            pajak: purchase_request.pajak,
            grandtotal: purchase_request.grandtotal,
            tgl_dibutuhkan: purchase_request.tgl_dibutuhkan,
            diminta_oleh: pegawai.nama,
            status_keterangan: sql`array_to_string(
                array(
                    SELECT 
                        CASE 
                            WHEN aa.status IS TRUE THEN 'Telah Disetujui oleh ' || bb.nama
                            WHEN aa.status IS FALSE AND aa.tanggal_persetujuan IS NOT NULL THEN 'Ditolak oleh ' || bb.nama
                            ELSE 'Menunggu Persetujuan ' || bb.nama
                        END
                    FROM 
                        purchase_request_persetujuan aa 
                        INNER JOIN hr.pegawai bb ON bb.id = aa.id_pegawai
                    WHERE 
                        aa.id = purchase_request.id
                ),
                ', '
            )`.as("status_keterangan"),
        })
        .from(purchase_request)
        .innerJoin(pegawai, eq(pegawai.id, purchase_request.created_by))
        .where(and(...whereConditioal, eq(purchase_request.status, "O")))
        .orderBy(desc(purchase_request.tanggal));
    return data;
};

export const getPurchaseRequestById = async (params: PurchaseRequest["id"], tx = db) => {
    const [data] = await tx
        .select({
            ...prColumns,
            created_name: pegawai.nama,
            created_jabatan: jabatan.jabatan,
        })
        .from(purchase_request)
        .leftJoin(pegawai, eq(pegawai.id, purchase_request.created_by))
        .leftJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .where(eq(purchase_request.id, params));
    return data;
};

export const createPurchaseRequest = async (form: NewPurchaseRequest, tx = db) => {
    const [data] = await tx.insert(purchase_request).values(form).returning();
    return data;
};

export const updatePurchaseRequest = async (params: PurchaseRequest["id"], form: UpdatePurchaseRequest, tx = db) => {
    const [data] = await tx
        .update(purchase_request)
        .set({ ...form, updated_at: sql`NOW()` })
        .where(eq(purchase_request.id, params))
        .returning();
    return data;
};

export const deletePurchaseRequest = async (id: PurchaseRequest["id"], tx = db) => {
    const [data] = await tx.delete(purchase_request).where(eq(purchase_request.id, id)).returning();
    return data;
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

export const getDataAutoComplete = async (tx = db) => {
    const data = await tx.execute(sql`SELECT a.id, a.nomor, a.status as status_po, a.total, a.tanggal, c.nama as created_name
    FROM purchase_request a  
    LEFT JOIN hr.pegawai c ON a.created_by = c.id
                WHERE a.id NOT IN (SELECT aa.id_pr FROM purchase_order aa WHERE aa.id_pr=a.id) AND a.status='O'
                ORDER BY nomor`);
    return data;
};

export const createPurchaseRequestPersetujuanBySetting = async (id: PurchaseRequest["id"], id_pegawai: Pegawai["id"], tx = db) => {
    const lPersetujuan: PurchaseRequestPersetujuan[] = [];
    const settingPersetujuan = await getPurchaseRequestSettings(tx);
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
                    dataPersetujuan = await createPurchaseRequestPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
                    lPersetujuan.push(dataPersetujuan);
                    break;

                case "2": // head departemen
                    const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
                    if (pegawai2) {
                        const check = await getPurchaseRequestPersetujuanByPegawai(id, pegawai2.id, tx);
                        if (pegawai2.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createPurchaseRequestPersetujuan(id, pegawai2.id as number, index + 1, tx);
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
                        const check = await getPurchaseRequestPersetujuanByPegawai(id, pegawai3.id, tx);
                        if (pegawai3.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createPurchaseRequestPersetujuan(id, pegawai3.id as number, index + 1, tx);
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
