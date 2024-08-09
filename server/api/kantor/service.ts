import { sql, eq } from "drizzle-orm";
import { type NewKantor, type Kantor, kantor, KantorColumns, UpdateKantor } from "@/databases/kantor/schema";

export const getKantor = async (tx = db) => {
    const {rows} = await tx.execute(
        sql`
        SELECT a.*, b.name as akun_penjualan, c.name as akun_hutang, d.name as akun_piutang
        FROM kantor a 
        INNER JOIN account b ON b.id=a.account_penjualan
        INNER JOIN account c ON c.id=a.account_hutang
        INNER JOIN account d ON d.id=a.account_piutang`
    );
    return rows;
};

export const getKantorById = async (params: Kantor["id"], tx = db) => {
    const [data] = await tx.select().from(kantor).where(eq(kantor.id, params));
    return data;
};

export const createKantor = async (params: NewKantor, tx = db) => {
    const [data] = await tx.insert(kantor).values(params).returning();
    return data;
};

export const updateKantor = async (params: Kantor["id"], form: UpdateKantor, tx = db) => {
    const [data] = await tx.update(kantor).set(form).where(eq(kantor.id, params)).returning();
    return data;
};

export const deleteKantor = async (id: Kantor["id"], tx = db) => {
    const [data] = await tx.delete(kantor).where(eq(kantor.id, id)).returning();
    return data;
};
