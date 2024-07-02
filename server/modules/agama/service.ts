import { eq } from "drizzle-orm";
import { type NewAgama, type Agama, agama } from "../agama/schema";
import db from "../../../libs/db";

export const getAgama = async () => {
    const data = await db.select().from(agama);
    return data;
};

export const getAgamaById = async (params: Agama["id"]) => {
    const [data] = await db.select().from(agama).where(eq(agama.id, params));
    return data;
};

export const createAgama = async (params: NewAgama) => {
    const [data] = await db.insert(agama).values(params).returning();
    return data;
};

export const updateAgama = async (params: Agama["id"], form: NewAgama) => {
    const [data] = await db.update(agama).set(form).where(eq(agama.id, params)).returning();
    return data;
};

export const deleteAgama = async (id: Agama["id"]) => {
    const [data] = await db.delete(agama).where(eq(agama.id, id)).returning();
    return data;
};
