import { eq, sql } from "drizzle-orm";

import { NewQuotationSetting, QuotationSetting, UpdateQuotationSetting, quotation_setting } from "./schema";

export const getQuotationSettings = async (tx = db) => {
    const [data] = await tx.select().from(quotation_setting);
    return data;
};

export const createQuotationSetting = async (form: NewQuotationSetting, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(quotation_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updateQuotationSetting = async (params: QuotationSetting["id"], form: UpdateQuotationSetting, tx = db) => {
    const [data] = await tx
        .update(quotation_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(quotation_setting.id, params))
        .returning();

    return data;
};
