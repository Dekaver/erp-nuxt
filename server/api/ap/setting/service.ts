import { eq, sql } from "drizzle-orm";


import { ap_setting, ApSetting, NewApSetting, UpdateApSetting } from "./schema";

export const getApSettings = async (tx = db) => {
    const [data] = await tx.select().from(ap_setting);
    return data;
};

export const createApSetting = async (form: NewApSetting, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(ap_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updateApSetting = async (params: ApSetting["id"], form: UpdateApSetting, tx = db) => {
    const [data] = await tx
        .update(ap_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(ap_setting.id, params))
        .returning();

    return data;
};
