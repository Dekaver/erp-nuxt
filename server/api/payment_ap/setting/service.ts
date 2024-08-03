import { eq, sql } from "drizzle-orm";


import { NewPaymentApSetting, payment_ap_setting, PaymentApSetting, UpdatePaymentApSetting } from "./schema";

export const getPaymentApSettings = async (tx = db) => {
    const [data] = await tx.select().from(payment_ap_setting);
    return data;
};

export const createPaymentApSetting = async (form: NewPaymentApSetting, tx = db) => {
    const data = await tx.transaction(async (tx) => {
        const [data] = await tx.insert(payment_ap_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updatePaymentApSetting = async (params: PaymentApSetting["id"], form: UpdatePaymentApSetting, tx = db) => {
    const [data] = await tx
        .update(payment_ap_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(payment_ap_setting.id, params))
        .returning();

    return data;
};
