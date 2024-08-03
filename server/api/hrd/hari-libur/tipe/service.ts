import { eq, sql } from "drizzle-orm";
import { type NewHariLiburTipe, type HariLiburTipe, hari_libur_tipe } from "./schema";
import db from "../../../../libs/db";
import { ValidationError } from "../../../../libs/errors";

export const getHariLiburTipe = async (tx = db) => {
    const data = await tx.select().from(hari_libur_tipe);
    return data;
};

export const getHariLiburTipeByName = async (params: HariLiburTipe["tipe"], tx = db) => {
    const [data] = await tx.select().from(hari_libur_tipe).where(eq(hari_libur_tipe.tipe, params));
    return data;
};

export const createHariLiburTipe = async (form: NewHariLiburTipe, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const check = await getHariLiburTipeByName(form.tipe, trx);
        if (check) {
            throw ValidationError("HariLiburTipe already exists");
        }
        const [data] = await trx.insert(hari_libur_tipe).values(form).returning();
        return data;
    });
    return data;
};

export const updateHariLiburTipe = async (params: HariLiburTipe["id"], form: NewHariLiburTipe, tx = db) => {
    const check = await getHariLiburTipeByName(form.tipe);
    if (check && check.id !== params) {
        throw ValidationError("HariLiburTipe already exists");
    }
    const [data] = await tx.update(hari_libur_tipe).set({
        ...form,
        updated_at: sql`now()`,
    }).where(eq(hari_libur_tipe.id, params)).returning();
    return data;
};

export const deleteHariLiburTipe = async (id: HariLiburTipe["id"], tx = db) => {
    const [data] = await tx.delete(hari_libur_tipe).where(eq(hari_libur_tipe.id, id)).returning();
    return data;
};
