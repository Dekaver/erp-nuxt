import { eq, sql } from "drizzle-orm";

import { NewInvoice, Invoice, UpdateInvoice, invoice_setting } from "./schema";

export const getInvoiceSettings = async (tx = db) => {
    const [data] = await tx.select().from(invoice_setting);
    return data;
};

export const createInvoiceSetting = async (form: NewInvoice, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [data] = await trx.insert(invoice_setting).values(form).returning();
        return data;
    });
    return data;
};

export const updateInvoiceSetting = async (params: Invoice["id"], form: UpdateInvoice, tx = db) => {
    const [data] = await tx
        .update(invoice_setting)
        .set({
            ...form,
            updated_at: sql`now()`,
        })
        .where(eq(invoice_setting.id, params))
        .returning();

    return data;
};
