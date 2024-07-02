import { integer, pgSchema, timestamp } from "drizzle-orm/pg-core";
import { pegawai } from "./pegawai/schema";

// export const hr = pgSchema("hr");
export const statis = pgSchema("statis");

export const timestamps = {
    created_by: integer("created_by")
        .notNull()
        .references(() => pegawai.id),
    created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
    updated_by: integer("updated_by")
        .notNull()
        .references(() => pegawai.id),
    updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
};

export const persetujuanStrings: ("persetujuan1" | "persetujuan2" | "persetujuan3" | "persetujuan4")[] = ["persetujuan1", "persetujuan2", "persetujuan3", "persetujuan4"];
export const jabatanPersetujuanStrings: ("jabatan_persetujuan1" | "jabatan_persetujuan2" | "jabatan_persetujuan3" | "jabatan_persetujuan4")[] = [
    "jabatan_persetujuan1",
    "jabatan_persetujuan2",
    "jabatan_persetujuan3",
    "jabatan_persetujuan4",
];
