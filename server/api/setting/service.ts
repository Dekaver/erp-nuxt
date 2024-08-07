import { eq } from "drizzle-orm";
import { setting, type NewSetting, type Setting } from "@/databases/setting/schema";

export const getSetting = async (tx = db) => {
    const data = await tx.select().from(setting);
    return data;
};

export const getSettingByName = async (params: Setting["name"], tx = db) => {
    const [data] = await tx.select().from(setting).where(eq(setting.name, params));
    return data;
};

export const createSetting = async (form: NewSetting, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const check = await getSettingByName(form.name, trx);
        if (check) {
            throw ValidationError("Setting already exists");
        }
        const [data] = await trx.insert(setting).values(form).returning();
        return data;
    });
    return data;
};

export const updateSetting = async (params: Setting["id"], form: NewSetting, tx = db) => {
    const check = await getSettingByName(form.name);
    if (check && check.id !== params) {
        throw ValidationError("Setting already exists");
    }
    const [data] = await tx.update(setting).set(form).where(eq(setting.id, params)).returning();
    return data;
};

export const deleteSetting = async (id: Setting["id"], tx = db) => {
    const [data] = await tx.delete(setting).where(eq(setting.id, id)).returning();
    return data;
};
