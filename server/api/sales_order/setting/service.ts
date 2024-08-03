import { eq, sql } from "drizzle-orm";

import { NewSalesOrderSetting, SalesOrderSetting, UpdateSalesOrderSetting, sales_order_setting } from "./schema";

export const getSalesOrderSettings = async (tx = db) => {
    const [data] = await tx.select().from(sales_order_setting);
    return data;
};

export const createSalesOrderSetting = async (form: NewSalesOrderSetting, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(sales_order_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updateSalesOrderSetting = async (params: SalesOrderSetting["id"], form: UpdateSalesOrderSetting, tx = db) => {
    const [data] = await tx
        .update(sales_order_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(sales_order_setting.id, params))
        .returning();

    return data;
};
