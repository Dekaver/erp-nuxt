import { pgTable, serial, varchar, date, integer, numeric, text, char, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { gudang } from "../gudang/schema";
import { sales_order } from "../sales_order/schema";
import { timestamps } from "../schema";

export const delivery_order = pgTable("delivery_order", {
    id: serial("id").primaryKey().notNull(),
    nomor: varchar("nomor", { length: 30 }).notNull(),
    tanggal: date("tanggal").notNull(),
    id_customer: integer("id_customer").notNull(),
    kepada: varchar("kepada", { length: 150 }),
    keterangan: text("keterangan"),
    id_salesman: integer("id_salesman").notNull(),
    alamat: text("alamat"),
    id_gudang: integer("id_gudang")
        .notNull()
        .references(() => gudang.id),
    id_so: integer("id_so")
        .notNull()
        .references(() => sales_order.id),
    telepon: varchar("telepon", { length: 100 }),
    hp: varchar("hp", { length: 20 }),
    email: varchar("email", { length: 30 }),
    tgl_keluar: date("tgl_keluar"),
    tgl_transporter: date("tgl_transporter"),
    driver: varchar("driver", { length: 30 }),
    driver_hp: varchar("driver_hp", { length: 30 }),
    status: char("status", { length: 1 }),
    sipb: varchar("sipb", { length: 100 }),
    lic_plate: varchar("lic_plate"),
    transporter_time: varchar("transporter_time", { length: 25 }),
    shipping_costs: numeric("shipping_costs").default("0"),
    transporter: varchar("transporter"),

    return_date: date("return_date"),
    leadtime: integer("leadtime"),
    is_transporter: boolean("is_transporter"),
    id_transporter: integer("id_transporter"),
    arrived_date: date("arrived_date"),
    origin: varchar("origin"),
    destination: varchar("destination"),

    received_date: date("received_date"),
    received_name: varchar("received_name", { length: 30 }),
    received_date_posting: timestamp("received_date_posting", { mode: "string" }),
    received_posting: varchar("received_posting", { length: 10 }),
    bast: varchar("bast"),
    ...timestamps,
});

export const insertDeliveryOrderSchema = createInsertSchema(delivery_order);
export const updateDeliveryOrderSchema = createInsertSchema(delivery_order).omit({
    id: true,
    created_by: true,
    updated_by: true,
    received_date: true,
    received_name: true,
    received_posting: true,
    received_date_posting: true,
    return_date: true,
});

export type DeliveryOrder = InferSelectModel<typeof delivery_order>;
export type NewDeliveryOrder = z.infer<typeof insertDeliveryOrderSchema>;
export type UpdateDeliveryOrder = z.infer<typeof updateDeliveryOrderSchema>;

export const DeliveryOrderColumns = getTableColumns(delivery_order);
