import { eq } from "drizzle-orm";

import { ValidationError } from "../../../libs/errors";
import { deliveryOrderColumns, delivery_order } from "../../delivery_order/schema";
import { gudang } from "../../gudang/schema";
import { jabatan } from "../../jabatan/schema";
import { kontak } from "../../kontak/schema";
import { pegawai } from "../../pegawai/schema";
import { sales_order } from "../../sales_order/schema";
import { NewInvoiceDeliveryOrder, invoice_delivery_order } from "./schema";

export const getInvoiceDeliveryOrder = async (id: NewInvoiceDeliveryOrder["id_invoice"], tx = db) => {
    try {
        return await tx
            .select()
            
            .from(invoice_delivery_order)
            .where(eq(invoice_delivery_order.id_invoice, id));
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};

export const createInvoiceDeliveryOrder = async (form: NewInvoiceDeliveryOrder[], tx = db) => {
    try {
        return await tx.insert(invoice_delivery_order).values(form).returning();
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};

export const deleteInvoiceDeliveryOrder = async (id: NewInvoiceDeliveryOrder["id_invoice"], tx = db) => {
    try {
        return await tx.delete(invoice_delivery_order).where(eq(invoice_delivery_order.id_invoice, id)).returning();
    } catch (error) {
        console.error(error);
        throw ValidationError("error");
    }
};
