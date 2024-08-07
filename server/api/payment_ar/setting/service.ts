import { eq, sql } from "drizzle-orm";

import { NewPaymentArSetting, PaymentArSetting, UpdatePaymentArSetting, payment_ar_setting } from "@/databases/payment_ar/setting/schema";

export const getPaymentArSettings = async (tx = db) => {
    const [data] = await tx.select().from(payment_ar_setting);
    return data;
};

export const createPaymentArSetting = async (form: NewPaymentArSetting, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(payment_ar_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updatePaymentArSetting = async (params: PaymentArSetting["id"], form: UpdatePaymentArSetting, tx = db) => {
    const [data] = await tx
        .update(payment_ar_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(payment_ar_setting.id, params))
        .returning();

    return data;
};
