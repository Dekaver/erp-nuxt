import { asc, desc, eq, isNull, sql } from "drizzle-orm";

import { jabatan } from "../../jabatan/schema";
import { pegawai } from "../../pegawai/schema";
import {
    LemburColumns,
    NewLemburPersetujuan,
    lembur,
    lemburKaryawan,
    lemburPersetujuan,
    type Lembur,
    NewLembur,
    lemburMaster,
    NewLemburMaster,
    LemburKaryawan,
    NewLemburKaryawan,
    NewLemburMultiplier,
    lemburMultiplier,
    LemburMaster,
} from "./schema";

export const getLemburKaryawan = async (status?: string, tx = db) => {
    const query = tx
        .select({
            ...LemburColumns,
            status_lembur: lemburPersetujuan.status,
            nama_pegawai: pegawai.nama,
            email_pegawai: pegawai.email,
            jabatan: jabatan.jabatan,
        })
        .from(lembur)
        .innerJoin(lemburPersetujuan, eq(lembur.id, lemburPersetujuan.id_lembur_karyawan))
        .innerJoin(pegawai, eq(pegawai.id, lembur.id_pegawai))
        .leftJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan));

    if (status) {
        if (status == "P") {
            query.where(isNull(lemburPersetujuan.status));
        } else if (status === "A") {
            query.where(eq(lemburPersetujuan.status, true));
        } else if (status === "R") {
            query.where(eq(lemburPersetujuan.status, false));
        }
    }

    const data = await query.orderBy(desc(lembur.tanggal));
    return data;
};

export const getLemburKaryawanById = async (params: Lembur["id"], tx = db) => {
    const [data] = await tx
        .select({
            ...LemburColumns,
            status_lembur: lemburPersetujuan.status,
            nama_pegawai: pegawai.nama,
            email_pegawai: pegawai.email,
            jabatan: jabatan.jabatan,
        })
        .from(lembur)
        .innerJoin(lemburPersetujuan, eq(lembur.id, lemburPersetujuan.id_lembur_karyawan))
        .innerJoin(pegawai, eq(pegawai.id, lembur.id_pegawai))
        .leftJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .where(eq(lembur.id, params));
    return data;
};

export const createLembur = async (params: NewLembur, tx = db) => {
    const [data] = await tx.insert(lembur).values(params).returning();
    return data;
};

export const createLemburApproval = async (params: NewLemburPersetujuan, tx = db) => {
    const [data] = await tx.insert(lemburPersetujuan).values(params).returning();
    return data;
};

export const updateLembur = async (params: NewLemburMaster, tx = db) => {
    const [data] = await tx
        .update(lemburMaster)
        .set(params)
        .where(eq(lembur.id, params.id as number))
        .returning();
    return data;
};

export const deleteLemburKaryawan = async (params: LemburKaryawan["id_lembur"], tx = db) => {
    const [data] = await tx.delete(lemburKaryawan).where(eq(lemburKaryawan.id_lembur, params)).returning();
    return data;
};

// GET PEGAWAI THAT DOES NOT APPEAR IN hr.lembur_karyawan
export const getPegawaiLembur = async (tx = db) => {
    const data = await tx
        .select({
            id_pegawai: pegawai.id,
            nama: pegawai.nama,
            jabatan: jabatan.jabatan,
        })
        .from(pegawai)
        .leftJoin(lemburKaryawan, eq(lemburKaryawan.id_pegawai, pegawai.id))
        .innerJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id))
        .where(isNull(lemburKaryawan.id_lembur))
        .orderBy(asc(pegawai.nama));

    return data;
};

export const createLemburMaster = async (form: NewLemburMaster, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(lemburMaster).values(form).returning();

        return data;
    });
    return data;
};

export const createLemburKaryawan = async (form: NewLemburKaryawan[], tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(lemburKaryawan).values(form).returning();
        return data;
    });
    return data;
};

export const createLemburMultiplier = async (form: NewLemburMultiplier[], tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(lemburMultiplier).values(form).returning();
        return data;
    });
    return data;
};

export const getLemburMaster = async (tx = db) => {
    const data = await tx.execute(
        sql.raw(`SELECT 
        lm.id,
        lm.nama,
        lm.kebijakan,
        lm.biaya,
        CASE lm.persetujuan1
                WHEN '1' THEN 'Atasan Langsung'
                WHEN '2' THEN 'Head Departemen'
                WHEN '3' THEN 'Jabatan Tertentu'
                WHEN '4' THEN 'Tidak Perlu Persetujuan'
            ELSE NULL
        END AS persetujuan_1,
        CASE lm.persetujuan2
                WHEN '1' THEN 'Cuti Dapat Diambil'
                WHEN '2' THEN 'Atasan Langsung 2'
                WHEN '3' THEN 'Head Departemen'
                WHEN '4' THEN 'Jabatan Tertentu'
            ELSE NULL
        END AS persetujuan_2,
        CASE lm.persetujuan3
                WHEN '1' THEN 'Head Departemen'
                WHEN '2' THEN 'Jabatan Tertentu'
                WHEN '3' THEN 'Cuti Dapat Diambil'
            ELSE NULL
        END AS persetujuan_3,
        CASE lm.persetujuan4
                WHEN '1' THEN 'Jabatan Tertentu'
                WHEN '2' THEN 'Cuti Dapat Diambil'
            ELSE NULL
        END AS persetujuan_4,
        (SELECT name FROM hr.jabatan WHERE id=lm.jabatan_persetujuan1) as jabatan1,
        (SELECT name FROM hr.jabatan WHERE id=lm.jabatan_persetujuan2) as jabatan2,
        (SELECT name FROM hr.jabatan WHERE id=lm.jabatan_persetujuan3) as jabatan3,
        (SELECT name FROM hr.jabatan WHERE id=lm.jabatan_persetujuan4) as jabatan4 
    FROM 
        hr.lembur_master lm;`),
    );

    return data;
};

export const deleteLemburMultiplier = async (id: LemburMaster["id"], tx = db) => {
    const [data] = await tx.delete(lemburMultiplier).where(eq(lemburMultiplier.id_lembur, id)).returning();
    return data;
};

export const deleteLemburMaster = async (id: LemburMaster["id"], tx = db) => {
    const [data] = await tx.delete(lemburMaster).where(eq(lemburMaster.id, id)).returning();
    return data;
};

export const getKebijakanLemburById = async (id: number, tx = db) => {
    const [data] = await tx.select().from(lemburMaster).where(eq(lemburMaster.id, id));
    const dataMultiplier = await tx.select().from(lemburMultiplier).where(eq(lemburMultiplier.id_lembur, data.id));

    const dataLemburPegawai = await tx
        .select({
            id_pegawai: pegawai.id,
            nama: pegawai.nama,
            jabatan: jabatan.jabatan,
        })
        .from(pegawai)
        .leftJoin(lemburKaryawan, eq(lemburKaryawan.id_pegawai, pegawai.id))
        .innerJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id))
        .where(eq(lemburKaryawan.id_lembur, id))
        .orderBy(asc(pegawai.nama));

    return {
        ...data,
        multiplier: [...dataMultiplier],
        pegawai: [...dataLemburPegawai],
    };
};

export const updateKebijakanLembur = async (params: LemburMaster["id"], form: NewLemburMaster, tx = db) => {
    const [data] = await tx.update(lemburMaster).set(form).where(eq(lemburMaster.id, params)).returning();
    return data;
};
