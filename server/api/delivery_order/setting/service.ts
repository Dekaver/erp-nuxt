import { eq, sql } from "drizzle-orm";

import { NewDeliveryOrderSetting, DeliveryOrderSetting, UpdateDeliveryOrderSetting, delivery_order_setting } from "./schema";

export const getDeliveryOrderSettingSettings = async (tx = db) => {
    const [data] = await tx.select().from(delivery_order_setting);
    return data;
};

export const createDeliveryOrderSettingSetting = async (form: NewDeliveryOrderSetting, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(delivery_order_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updateDeliveryOrderSettingSetting = async (params: DeliveryOrderSetting["id"], form: UpdateDeliveryOrderSetting, tx = db) => {
    const [data] = await tx
        .update(delivery_order_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(delivery_order_setting.id, params))
        .returning();

    return data;
};
