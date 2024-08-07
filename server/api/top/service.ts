import { eq, sql } from "drizzle-orm";
import { type NewTop, type Top, top, TopColumns, UpdateTop } from "@/databases/top/schema";

export const getTop = async (tx = db) => {
    return await tx.select().from(top).orderBy(top.keterangan);
};

export const getTopById = async (id: Top["id"], tx = db) => {
  const [data] = await tx.select().from(top).where(eq(top.id, id));
  return data;
};

export const createTop = async (id: NewTop, tx = db) => {
  const [data] = await tx.insert(top).values(id).returning();
  return data;
};

export const updateTop = async (id: Top["id"], form: UpdateTop, tx = db) => {
   const [data] = await tx
       .update(top)
       .set({ ...form, updated_at: sql`NOW()` })
       .where(eq(top.id, id))
       .returning();
    return data;
};

export const deleteTop = async (id: Top["id"], tx = db) => {
     try {
        const [data] = await tx.delete(top).where(eq(top.id, id)).returning();
        return data;
    } catch (error) {
        throw ValidationError("Data tidak dapat dihapus karena sedang digunakan");
    }
 };
