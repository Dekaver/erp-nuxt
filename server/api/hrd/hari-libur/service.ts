import { and, eq, or, SQL, sql } from "drizzle-orm";
import { type NewHariLibur, type HariLibur, hari_libur, hariLiburColumns, UpdateHariLibur } from "@/databases/hrd/hari-libur/schema";
import { hari_libur_tipe } from "~/databases/hrd/hari-libur/tipe/schema";

export const getHariLibur = async (year: number, tx = db) => {
    const conditions: SQL[] = [];
    const search: SQL [] = [];
    const query = tx.select({
        ...hariLiburColumns,
        tipe : hari_libur_tipe.tipe
    })
    .from(hari_libur)
    .innerJoin(hari_libur_tipe, eq(hari_libur_tipe.id, hari_libur.hari_libur_tipe_id));
    conditions.push(eq(sql`EXTRACT(YEAR FROM ${hari_libur.tanggal})`, year))

    return await query.where(and(...conditions, or(...search)));

    const data = await tx.execute(
        sql.raw(`SELECT 
                    hl.*, 
                    ht.tipe AS tipe 
                FROM 
                    hari_libur hl 
                INNER JOIN 
                    hari_libur_tipe ht 
                ON 
                    ht.id = hl.hari_libur_tipe_id 
                WHERE 
                    EXTRACT(YEAR FROM hl.tanggal) = ${year};
      `),
    );
};

export const getHariLiburByName = async (params: HariLibur["nama"], tx = db) => {
    const [data] = await tx.select().from(hari_libur).where(eq(hari_libur.nama, params));
    return data;
};

export const getHariLiburById = async (params: HariLibur["id"], tx = db) => {
    const [data] = await tx.select().from(hari_libur).where(eq(hari_libur.id, params));
    return data;
};

export const createHariLibur = async (form: NewHariLibur, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const check = await getHariLiburByName(form.nama, trx);
        if (check) {
            throw ValidationError("HariLibur already exists");
        }
        const [data] = await trx.insert(hari_libur).values(form).returning();
        return data;
    });
    return data;
};

export const updateHariLibur = async (params: HariLibur["id"], form: UpdateHariLibur, tx = db) => {
    const check = await getHariLiburByName(form.nama);
    if (check && check.id !== params) {
        throw ValidationError("HariLibur already exists");
    }
    const [data] = await tx.update(hari_libur).set(form).where(eq(hari_libur.id, params)).returning();
    return data;
};

export const deleteHariLibur = async (id: HariLibur["id"], tx = db) => {
    const [data] = await tx.delete(hari_libur).where(eq(hari_libur.id, id)).returning();
    return data;
};
