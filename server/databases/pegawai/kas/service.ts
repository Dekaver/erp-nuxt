import { and, eq } from "drizzle-orm";
import { type NewPegawaiKas, type UpdatePegawaiKas, type PegawaiKas, pegawaiKas } from "./schema";
import db from "../../../../libs/db";

export const getPegawaiKas = async (id_pegawai: any, tx = db) => {
    const data = await tx.select().from(pegawaiKas);
    return data;
};

export const getPegawaiKasById = async (id_pegawai: PegawaiKas["id_pegawai"], id_account: PegawaiKas["id_account"], tx = db) => {
    const data = await tx
        .select()
        .from(pegawaiKas)
        .where(and(eq(pegawaiKas.id_pegawai, id_pegawai), eq(pegawaiKas.id_account, id_account)));
    return data;
};

export const createPegawaiKas = async (form: NewPegawaiKas, tx = db) => {
    const data = await tx.insert(pegawaiKas).values(form).returning();
    return data;
};

export const updatePegawaiKas = async (id_pegawai: PegawaiKas["id_pegawai"], id_account: PegawaiKas["id_account"], form: NewPegawaiKas, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        await deletePegawaiKas(id_pegawai, id_account, trx);
        return await createPegawaiKas(form, trx);
    });
    return data;
};

export const deletePegawaiKas = async (id_pegawai: PegawaiKas["id_pegawai"], id_account: PegawaiKas["id_account"], tx = db) => {
    const data = await tx
        .delete(pegawaiKas)
        .where(and(eq(pegawaiKas.id_pegawai, id_pegawai), eq(pegawaiKas.id_account, id_account)))
        .returning();
    return data;
};
