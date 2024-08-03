import { and, eq, lt, sql } from "drizzle-orm";
import { account } from "../account/schema";
import { acc_value, NewAccValue } from "../accounting/schema";
import { initialAccountColunms, initial_account, InitialAccount, NewInitialAccount, UpdateInitialAccount } from "./schema";
import { updateAccAkhir } from "../accounting/service";

export const getInitialAccount = async (tahun: string,tx = db) => {
    const data = await tx
        .select({
            ...initialAccountColunms,
            code: account.code,
            name: account.name,
            debit: acc_value.db0,
            kredit: acc_value.cr0,
            category: account.id_category,
        })
        .from(initial_account)
        .innerJoin(acc_value, eq(initial_account.id_account, acc_value.id_account))
        .leftJoin(account, eq(initial_account.id_account, account.id))
        .where(and(eq(account.level, 4), lt(account.id_category, 4), eq(acc_value.years, tahun)));
    return data;
};

export const getInitialAccountById = async (params: InitialAccount["id_account"], tx = db) => {
    const [data] = await tx.select().from(initial_account).where(eq(initial_account.id_account, params));
    return data;
};

export const createInitialAccount = async (form: NewInitialAccount, formAccValue: NewAccValue, tx = db) => {
    const data = await tx.transaction(async (tx) => {
        const [check] = await tx
            .select({
                id_account: account.id,
                name: account.name,
            })
            .from(initial_account)
            .leftJoin(account, eq(initial_account.id_account, account.id))
            .where(eq(account.id, form.id_account));

        if (check && check.id_account == form.id_account) {
            throw ValidationError("Account already exists");
        }

        const dataAccValue = await tx
            .insert(acc_value)
            .values(formAccValue)
            .onConflictDoUpdate({
                target: [acc_value.id_account, acc_value.years],
                set: {
                    db0: formAccValue.db0,
                    cr0: formAccValue.cr0,
                },
                where: eq(acc_value.id_account, formAccValue.id_account),
            })
            .returning();
        const [data] = await tx.insert(initial_account).values(form).returning();
        return data;
    });
    return data;
};

export const updateInitialAccount = async (id_account: InitialAccount["id_account"], form: UpdateInitialAccount, formAccValue: NewAccValue, tx = db) => {
    const data = await tx.transaction(async (tx) => {
        const [data] = await tx.update(initial_account).set({...form, updated_at: sql`NOW()`}).where(eq(initial_account.id_account, id_account)).returning();
        await tx
            .insert(acc_value)
            .values(formAccValue)
            .onConflictDoUpdate({
                target: [acc_value.id_account, acc_value.years],
                set: {
                    db0: formAccValue.db0,
                    cr0: formAccValue.cr0,
                },
                where: eq(acc_value.id_account, id_account),
            })
            .returning();
            
        await updateAccAkhir(formAccValue.years, formAccValue.id_account, tx)
        return data;
    });
    return data;
};

export const deleteInitialAccount = async (id_account: InitialAccount["id_account"], tx = db) => {
    const data = await tx.transaction(async (tx) => {
        const [data] = await tx.delete(initial_account).where(eq(initial_account.id_account, id_account)).returning();
        await tx
            .update(acc_value)
            .set({
                db0: "0",
                cr0: "0",
            })
            .where(and(eq(acc_value.id_account, id_account)))
            .returning();
        return data;
    });
    return data;
};
