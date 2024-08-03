import { eq, sql } from "drizzle-orm";

import { NewPurchaseOrderSetting, PurchaseOrderSetting, UpdatePurchaseOrderSetting, purchase_order_setting } from "./schema";

export const getPurchaseOrderSettings = async (tx = db) => {
    const [data] = await tx.select().from(purchase_order_setting);
    return data;
};

export const createPurchaseOrderSetting = async (form: NewPurchaseOrderSetting, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(purchase_order_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updatePurchaseOrderSetting = async (params: PurchaseOrderSetting["id"], form: UpdatePurchaseOrderSetting, tx = db) => {
    const [data] = await tx
        .update(purchase_order_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(purchase_order_setting.id, params))
        .returning();

    return data;
};
