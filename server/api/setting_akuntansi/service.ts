import db from "../../libs/db";
import { NewSettingAkuntansi, settingAkuntansi } from "./schema";

export const getSettingAkuntansi = async (tx = db) => {
    const [data] = await tx
        .select()
        .from(settingAkuntansi);
    return data;
};

export const createSettingAkuntansi = async (form: NewSettingAkuntansi, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(settingAkuntansi).values(form).returning();
        return data;
    });
    return data;
};

export const updateSettingAkuntansi = async (form: NewSettingAkuntansi, tx = db) => {
    const [data] = await tx
        .update(settingAkuntansi)
        .set(form)
        .returning();
    return data;
};

export const deleteSettingAkuntansi = async (tx = db) => {
    const [data] = await tx.delete(settingAkuntansi);
    return data;
};
