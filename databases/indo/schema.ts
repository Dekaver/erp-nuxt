import { integer, serial, varchar } from "drizzle-orm/pg-core";
import { statis } from "../schema";

export const provinces = statis.table("provinces", {
    prov_id: serial("prov_id").primaryKey().notNull(),
    prov_name: varchar("prov_name"),
    locationid: integer("locationid"),
    status: integer("status").default(1),
});

export const cities = statis.table("cities", {
    city_id: serial("city_id").primaryKey().notNull(),
    city_name: varchar("city_name"),
    prov_id: integer("prov_id"),
});

export const postalcode = statis.table("postalcode", {
    postal_id: serial("postal_id").primaryKey().notNull(),
    subdis_id: integer("subdis_id"),
    dis_id: integer("dis_id"),
    city_id: integer("city_id"),
    prov_id: integer("prov_id"),
    postal_code: integer("postal_code"),
});

export const districts = statis.table("districts", {
    dis_id: serial("dis_id").primaryKey().notNull(),
    dis_name: varchar("dis_name"),
    city_id: integer("city_id"),
});

export const subdistricts = statis.table("subdistricts", {
    subdis_id: serial("subdis_id").primaryKey().notNull(),
    subdis_name: varchar("subdis_name"),
    dis_id: integer("dis_id"),
});
