import { and, desc, eq, notExists, sql } from "drizzle-orm";
import { ToString, formatDate } from "../../libs/formater";
import { barang_satuan } from "../barang/schema";
import { kontak } from "../kontak/schema";
import { Pegawai, pegawai } from "../pegawai/schema";
import { penerimaan_barang, PenerimaanBarang, NewPenerimaanBarang, penerimaanBarangColumns, UpdatePenerimaanBarang } from "./schema";
import { getHppFromPurchaseOrderDetail, updateSisaPurchaseOrderDetail, updateStatusDariPODetail } from "../purchase_order/detail/service";
import { purchase_order } from "../purchase_order/schema";
import { PenerimaanBarangDetail } from "./detail/schema";
import { ap_detail } from "../ap/detail/schema";
import { gudang } from "../gudang/schema";
import { insertStokBarangSchema, NewStokBarang } from "../gudang/stok_barang/schema";
import { tambahStokBarang } from "../gudang/stok_barang/service";
import { PenerimaanBarangPersetujuan } from "./persetujuan/schema";
import { getPenerimaanBarangSettings } from "./setting/service";
import { jabatanPersetujuanStrings, persetujuanStrings } from "../schema";
import { getPegawaiById, getPegawaiByIdJabatan, getPegawaiHeadDepartemen } from "../pegawai/service";
import { createPenerimaanBarangPersetujuan, getPenerimaanBarangPersetujuanByPegawai } from "./persetujuan/service";

export const getPenerimaanBarang = async (tx = db) => {
    const data = await tx
        .select({
            ...penerimaanBarangColumns,
            nomor_po: purchase_order.nomor,
            tanggal_po: purchase_order.tanggal,
            supplier: kontak.kontak,
            nama_pegawai: pegawai.nama,
        })
        .from(penerimaan_barang)
        .leftJoin(purchase_order, eq(penerimaan_barang.id_po, purchase_order.id))
        .leftJoin(kontak, eq(penerimaan_barang.id_supplier, kontak.id))
        .leftJoin(pegawai, eq(penerimaan_barang.created_by, pegawai.id))
        .orderBy(desc(penerimaan_barang.id), desc(penerimaan_barang.tanggal));

    return data;
};

export const getPenerimaanBarangOption = async (module?: string, tx = db) => {
    switch (module) {
        case "ap":
            return await tx
                .select({
                    ...penerimaanBarangColumns,
                    nomor_po: purchase_order.nomor,
                    supplier: kontak.kontak,
                    gudang: gudang.gudang,
                })
                .from(penerimaan_barang)
                .innerJoin(purchase_order, eq(purchase_order.id, penerimaan_barang.id_po))
                .innerJoin(kontak, eq(kontak.id, penerimaan_barang.id_supplier))
                .innerJoin(gudang, eq(gudang.id, penerimaan_barang.id_gudang))
                .where(and(eq(penerimaan_barang.status, "C"), notExists(tx.select().from(ap_detail).where(eq(ap_detail.id_pb, penerimaan_barang.id)))));

        default:
            break;
    }
    const data = await db.execute(sql`
        SELECT 'PB' as jenis, a.*, b.nomor as nomor_po 
        FROM penerimaan_barang a 
        INNER JOIN purchase_order b ON a.id_po=b.id 
        WHERE a.id 
        NOT IN (SELECT aa.id_penerimaan_barang FROM penerimaan_ap aa WHERE aa.id_penerimaan_barang=a.id )
    `);

    const dataPurchaseOrder = await db.execute(sql`SELECT 'P' as jenis, a.id as id_po, a.*
        FROM purchase_order a
        LEFT JOIN purchase_order_detail b ON a.id = b.id
        LEFT JOIN barang c ON c.id = b.id_barang
        WHERE a.id NOT IN (SELECT aa.id_po FROM penerimaan_barang aa WHERE aa.id_po=a.id) and a.id NOT IN (SELECT bb.id_po FROM ap bb WHERE bb.id_po=a.id) AND a.status = 'A'
        GROUP BY a.id `);

    const mergedData = data.concat(dataPurchaseOrder);
    return mergedData;
};

export const getPenerimaanBarangById = async (params: PenerimaanBarang["id"], tx = db) => {
    const [data] = await tx
        .select({
            ...penerimaanBarangColumns,
            nomor_po: purchase_order.nomor,
            tanggal_po: purchase_order.tanggal,
            supplier: kontak.kontak,
            nama_pegawai: pegawai.nama,
            top: purchase_order.top,
            gudang: gudang.gudang,
        })
        .from(penerimaan_barang)
        .leftJoin(purchase_order, eq(penerimaan_barang.id_po, purchase_order.id))
        .leftJoin(kontak, eq(penerimaan_barang.id_supplier, kontak.id))
        .leftJoin(pegawai, eq(penerimaan_barang.created_by, pegawai.id))
        .innerJoin(gudang, eq(gudang.id, penerimaan_barang.id_gudang))        
        .where(eq(penerimaan_barang.id, params));
    return data;
};

export const createPenerimaanBarang = async (form: NewPenerimaanBarang, tx = db) => {
    const [data] = await tx.insert(penerimaan_barang).values(form).returning();
    return data;
};

export const updatePenerimaanBarang = async (params: PenerimaanBarang["id"], form: UpdatePenerimaanBarang, tx = db) => {
    const [data] = await tx
        .update(penerimaan_barang)
        .set({ ...form, updated_at: sql`NOW()` })
        .where(eq(penerimaan_barang.id, params))
        .returning();
    return data;
};

export const updatePenerimaanBarangStatus = async (id: PenerimaanBarang["id"], status: PenerimaanBarang["status"], tx = db) => {
    return await tx.update(penerimaan_barang).set({ status: status }).where(eq(penerimaan_barang.id, id)).returning();
};

export const deletePenerimaanBarang = async (id: PenerimaanBarang["id"], tx = db) => {
    const data = await tx.delete(penerimaan_barang).where(eq(penerimaan_barang.id, id)).returning();
    return data[0];
};

export const checkIfPenerimaanBarangIsComplete = async (id: PenerimaanBarang["id"], tx = db) => {
    const [data] = await tx
        .select({ status: penerimaan_barang.status })
        .from(penerimaan_barang)
        .where(and(eq(penerimaan_barang.id, id), eq(penerimaan_barang.status, "C")));
    return data;
};

export const createPenerimaanBarangPersetujuanBySetting = async (id: PenerimaanBarang['id'], id_pegawai: Pegawai['id'],tx = db) => {
    const lPersetujuan: PenerimaanBarangPersetujuan[] = [];
    const settingPersetujuan = await getPenerimaanBarangSettings(tx);
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
                    dataPersetujuan = await createPenerimaanBarangPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
                    lPersetujuan.push(dataPersetujuan);
                    break;

                case "2": // head departemen
                    const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
                    if (pegawai2) {
                        const check = await getPenerimaanBarangPersetujuanByPegawai(id, pegawai2.id, tx);
                        if (pegawai2.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createPenerimaanBarangPersetujuan(id, pegawai2.id as number, index + 1, tx);
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
                        const check = await getPenerimaanBarangPersetujuanByPegawai(id, pegawai3.id, tx);
                        if (pegawai3.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createPenerimaanBarangPersetujuan(id, pegawai3.id as number, index + 1, tx);
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



export const closingPenerimaanBarang = async (PB: PenerimaanBarang, PBDetail: PenerimaanBarangDetail[], tx = db) => {
    try {
        return await tx.transaction(async (trx) => {
            let validateStokBarang = (await Promise.all(
                PBDetail.map(async (item: PenerimaanBarangDetail) => {
                    const hpp = await getHppFromPurchaseOrderDetail(item.id_po, item.urut_po, trx);

                    // Konversi jumlah barang berdasarkan satuan utama
                    let [dataBarangSatuan] = await trx
                        .select({ konversi: barang_satuan.konversi })
                        .from(barang_satuan)
                        .where(and(eq(barang_satuan.id_barang, item.id_barang as number), eq(barang_satuan.id_satuan, item.id_satuan)));
                    const konversi = dataBarangSatuan ? parseFloat(dataBarangSatuan.konversi) : 1;

                    // Update sisa dan diambil di PO Detail
                    await updateSisaPurchaseOrderDetail(PB.id_po, item.urut_po, ToString(parseFloat(item.diambil) / konversi) as string, trx);

                    if (item.id_barang) {
                        return insertStokBarangSchema.parse({
                            id_gudang: PB.id_gudang,
                            id_barang: item.id_barang,
                            stok: ToString(parseFloat(item.diambil) / konversi) as string,
                            tanggal: formatDate(new Date(PB.tanggal)),
                            reff: "PB",
                            id_reff: PB.id,
                            hpp: hpp,
                            stok_awal: ToString(parseFloat(item.diambil) / konversi) as string,
                            created_by: PB.updated_by,
                            updated_by: PB.updated_by,
                        });
                    }
                    return;
                }),
            )) as NewStokBarang[];

            validateStokBarang = validateStokBarang.filter((item) => item !== undefined);
            if (validateStokBarang.length > 0) {
                await tambahStokBarang(validateStokBarang, trx);
            }
            await updateStatusDariPODetail(PB.id_po, trx);
        });
    } catch (error) {
        console.log(error);
        throw ValidationError("Gagal memproses penerimaan barang.");
    }
};
