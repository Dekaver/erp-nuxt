import { eq, sql } from "drizzle-orm";


import { NewPurchaseRequestSetting, purchase_request_setting, PurchaseRequestSetting, UpdatePurchaseRequestSetting } from "./schema";

export const getPurchaseRequestSettings = async (tx = db) => {
    const [data] = await tx.select().from(purchase_request_setting);
    return data;
};

export const createPurchaseRequestSetting = async (form: NewPurchaseRequestSetting, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(purchase_request_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updatePurchaseRequestSetting = async (params: PurchaseRequestSetting["id"], form: UpdatePurchaseRequestSetting, tx = db) => {
    const [data] = await tx
        .update(purchase_request_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(purchase_request_setting.id, params))
        .returning();

    return data;
};
