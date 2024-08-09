import { eq } from "drizzle-orm";
import { type NewGudang, type Gudang, gudang, GudangColumns, UpdateGudang } from "@/databases/gudang/schema";
import { account } from "@/databases/account/schema";
import { alias } from "drizzle-orm/pg-core";

export const getGudang = async (tx = db) => {
    const account_hpp = alias(account, "account_hpp");
    const account_persediaan = alias(account, "account_persediaan");
    const data = await tx
        .select({
            ...GudangColumns,
            akun_hpp: account_hpp.name,
            akun_persediaan: account_persediaan.name,
        })
        .from(gudang)
        .innerJoin(account_hpp, eq(account_hpp.id, gudang.account_hpp))
        .innerJoin(account_persediaan, eq(account_persediaan.id, gudang.account_persediaan))
        .orderBy(gudang.gudang, gudang.inisial);


    return data;
};

export const getGudangById = async (params: Gudang["id"], tx = db) => {
    const [data] = await tx.select().from(gudang).where(eq(gudang.id, params));
    return data;
};

export const createGudang = async (params: NewGudang, tx = db) => {
    const [data] = await tx.insert(gudang).values(params).returning();
    return data;
};

export const updateGudang = async (params: Gudang["id"], form: UpdateGudang, tx = db) => {
    const [data] = await tx.update(gudang).set(form).where(eq(gudang.id, params)).returning();
    return data;
};

export const deleteGudang = async (params: Gudang["id"], tx = db) => {
    const [data] = await tx.delete(gudang).where(eq(gudang.id, params)).returning();
    return data;
};
