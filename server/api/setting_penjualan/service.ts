import { sql } from "drizzle-orm";
import { NewSettingPenjualan, settingPenjualan } from "./schema";

export const getSettingPenjualan = async (tx = db) => {
    const [data] = await tx.select().from(settingPenjualan);
    return data;
};

export const createSettingPenjualan = async (form: NewSettingPenjualan, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(settingPenjualan).values(form).returning();
        return data;
    });
    return data;
};

export const updateSettingPenjualan = async (form: NewSettingPenjualan, tx = db) => {
    const [data] = await tx
        .update(settingPenjualan)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .returning();

    return data;
};

export const deleteSettingPenjualan = async (tx = db) => {
    const [data] = await tx.delete(settingPenjualan).returning();
    return data;
};
