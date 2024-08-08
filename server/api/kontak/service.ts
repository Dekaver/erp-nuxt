import { SQL, and, eq, ilike, lt, lte, ne, or, sql, sum } from "drizzle-orm";
import { NewKontak, Kontak, kontak, KategoriKontak, NewKategoriKontak, kategoriKontak, kontakColumns } from "@/databases/kontak/schema";
import { top } from "@/databases/top/schema";
import { ap } from "@/databases/ap/schema";

export const getKontak = async () => {
    const data = await db.select().from(kontak).orderBy(kontak.kontak);
    return data;
};

export const getKontakSupplier = async () => {
    const data = await db
        .select({
            id: kontak.id,
            kontak: kontak.kontak,
            hp: kontak.hp,
            email: kontak.email,
            telepon: kontak.telepon,
            attention: kontak.attention,
            inisial: kontak.inisial,
            id_top: kontak.id_top,
            top: top.top,
            alamat_kirim: kontak.alamat_kirim,
        })
        .from(kontak)
        .innerJoin(top, eq(top.id, kontak.id_top))
        .where(and(eq(kontak.is_supplier, true), eq(kontak.is_aktif, true)));
    return data;
};

export const getKontakCustomer = async () => {
    const data = await db
        .select({
            id: kontak.id,
            kontak: kontak.kontak,
            hp: kontak.hp,
            email: kontak.email,
            telepon: kontak.telepon,
            attention: kontak.attention,
            inisial: kontak.inisial,
            id_top: kontak.id_top,
            alamat_kirim: kontak.alamat_kirim,
            top: top.top,
        })
        .from(kontak)
        .innerJoin(top, eq(top.id, kontak.id_top))
        .where(and(eq(kontak.is_customer, true), eq(kontak.is_aktif, true)));
    return data;
};

export const getKontakOption = async (option: any, tx = db) => {
    const otherSelect: any =  {}
    if (option.is_supplier ) {
        if(option.is_hutang){
            otherSelect.sisa = sql`a.sisa`
        }
        otherSelect.akun_hutang = kontak.akun_hutang
    }
    if (option.is_customer) {
        otherSelect.akun_piutang = kontak.akun_piutang
    }

    const data = tx
        .select({
            id: kontak.id,
            kontak: kontak.kontak,
            hp: kontak.hp,
            email: kontak.email,
            telepon: kontak.telepon,
            attention: kontak.attention,
            inisial: kontak.inisial,
            id_top: kontak.id_top,
            alamat_kirim: kontak.alamat_kirim,
            top: top.top,
            ...otherSelect
        })
        .from(kontak)
        .innerJoin(top, eq(top.id, kontak.id_top));

    const where: SQL[] = [];
    if (option.is_customer) {
        where.push(eq(kontak.is_customer, sql.raw(option.is_customer)));
    }
    if (option.is_supplier) {
        where.push(eq(kontak.is_supplier, sql.raw(option.is_supplier)));
        if (option.is_hutang) {
            data.innerJoin(
                tx
                    .select({ id_supplier: ap.id_supplier, sisa: sum(sql`amount-discount-pay`).as("sisa") })
                    .from(ap)
                    .where(lt(sql`pay+discount`, sql`amount`))
                    .groupBy(ap.id_supplier)
                    .as("a"),
                eq(sql`a.id_supplier`, kontak.id),
            );
        }
    }
    if (option.id_kategori) {
        where.push(eq(kontak.id_kategori, option.id_kategori));
    }
    if (option.search) {
        where.push(or(ilike(kontak.inisial, `%${option.search}%`), ilike(kontak.kontak, `%${option.search}%`)) as SQL<unknown>);
    }
    if (option.limit) {
        data.limit(option.limit);
    }
    return await data.where(and(eq(kontak.is_aktif, true), ...where)).orderBy(kontak.kontak);
};


export const getKontakById = async (params: Kontak["id"], tx = db) => {
    const [data] = await tx
        .select({ ...kontakColumns, top: top.top })
        .from(kontak)
        .innerJoin(top, eq(top.id, kontak.id_top))
        .where(eq(kontak.id, params));
    return data;
};

export const createKontak = async (form: NewKontak, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [check] = await trx.select().from(kontak).where(eq(kontak.kode, form.kode));
        if (check) {
            throw ValidationError("Nama/Email/Hp/Telepon/Inisial/Kode harus unik!");
        }
        const [data] = await trx.insert(kontak).values(form).returning();
        return data;
    });
    return data;
};

export const updateKontak = async (params: Kontak["id"], form: NewKontak, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [check] = await trx
            .select()
            .from(kontak)
            .where(and(eq(kontak.kontak, form.kontak), ne(kontak.id, params)));
        if (check) {
            throw ValidationError("Nama/Email/Hp/Telepon/Inisial/Kode harus unik!");
        }
        const [data] = await trx
            .update(kontak)
            .set(form)
            .where(eq(kontak.id, params as number))
            .returning();
        return data;
    });
    return data;
};

export const deleteKontak = async (params: Kontak["id"], tx = db) => {
    try {
        const [data] = await db.delete(kontak).where(eq(kontak.id, params)).returning();
        return data;
    } catch (error) {
        throw ValidationError("Kontak tidak boleh dihapus karena sudah digunakan");
    }
};

export const getKategoriKontak = async () => {
    const data = await db.select().from(kategoriKontak);
    return data;
};

export const getKategoriKontakById = async (params: KategoriKontak["id"]) => {
    const data = await db.select().from(kategoriKontak).where(eq(kategoriKontak.id, params));
    return data[0];
};

export const createKategoriKontak = async (params: NewKategoriKontak) => {
    const data = await db.insert(kategoriKontak).values(params).returning();
    return data[0];
};

export const updateKategoriKontak = async (params: KategoriKontak["id"], form: NewKategoriKontak) => {
    const data = await db
        .update(kategoriKontak)
        .set(form)
        .where(eq(kategoriKontak.id, params as number))
        .returning();
    return data[0];
};

export const deleteKategoriKontak = async (id: KategoriKontak["id"]) => {
    try {
        const [data] = await db.delete(kategoriKontak).where(eq(kategoriKontak.id, id)).returning();

        return data;
    } catch (error) {
        throw ValidationError("Kategori Kontak tidak boleh dihapus karena sudah digunakan");
    }
};
