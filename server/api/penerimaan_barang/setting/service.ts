import { eq, sql } from "drizzle-orm";


import { NewPenerimaanBarangSetting, penerimaan_barang_setting, PenerimaanBarangSetting, UpdatePenerimaanBarangSetting } from "./schema";

export const getPenerimaanBarangSettings = async (tx = db) => {
    const [data] = await tx.select().from(penerimaan_barang_setting);
    return data;
};

export const createPenerimaanBarangSetting = async (form: NewPenerimaanBarangSetting, tx = db) => {
    const data = await tx.transaction(async (tx) => {
        const [data] = await tx.insert(penerimaan_barang_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updatePenerimaanBarangSetting = async (params: PenerimaanBarangSetting["id"], form: UpdatePenerimaanBarangSetting, tx = db) => {
    const [data] = await tx
        .update(penerimaan_barang_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(penerimaan_barang_setting.id, params))
        .returning();

    return data;
};
