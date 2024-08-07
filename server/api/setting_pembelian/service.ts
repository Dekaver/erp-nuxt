import { sql } from "drizzle-orm";
import { NewSettingPembelian, settingPembelian } from "@/databases/setting_pembelian/schema";

export const getSettingPembelian = async (tx = db) => {
    const [data] = await tx.select().from(settingPembelian);
    return data;
};

export const createSettingPembelian = async (form: NewSettingPembelian, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(settingPembelian).values(form).returning();
        return data;
    });
    return data;
};

export const updateSettingPembelian = async (form: NewSettingPembelian, tx = db) => {
    const [data] = await tx
        .update(settingPembelian)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .returning();

    return data;
};

export const deleteSettingPembelian = async (tx = db) => {
    const [data] = await tx.delete(settingPembelian).returning();
    return data;
};
