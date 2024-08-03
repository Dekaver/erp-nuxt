import { and, eq, sql } from "drizzle-orm";

import { NewStokValue, StokValue, stok_value } from "./schema";
import { NewStokBarang } from "../stok_barang/schema";

export const getStokValue = async (tx = db) => {
    const data = await tx.select().from(stok_value);
    return data;
};
export const getStokValueById = async (param: Pick<StokValue, "id_barang" | "id_gudang" | "tahun">, tx = db) => {
    const [data] = await tx.select().from(stok_value);
    return data;
};

export const checkStokValue = async (tahun: StokValue["tahun"], id_gudang: StokValue["id_gudang"], id_barang: StokValue["id_barang"], tx = db) => {
    const [data] = await tx
        .select()
        .from(stok_value)
        .where(and(eq(stok_value.id_gudang, id_gudang), eq(stok_value.id_barang, id_barang), eq(stok_value.tahun, tahun)));
    return data;
};

export const createStokValue = async (form: NewStokValue, tx = db) => {
    const [data] = await tx.insert(stok_value).values(form).returning();
    return data;
};

export const updateStokAkhir = async (tahun: StokValue["tahun"], id_gudang: StokValue["id_gudang"], id_barang: StokValue["id_barang"], tx = db) => {
    const [data] = await tx
        .update(stok_value)
        .set({
            db13: sql`db0+db1+db2+db3+db4+db5+db6+db7+db8+db9+db10+db11+db12`,
            cr13: sql`cr0+cr1+cr2+cr3+cr4+cr5+cr6+cr7+cr8+cr9+cr10+cr11+cr12`,
        })
        .where(and(eq(stok_value.id_gudang, id_gudang), eq(stok_value.id_barang, id_barang), eq(stok_value.tahun, tahun)))
        .returning();
    return data;
};

export const updateStokValue = async (tanggal: NewStokBarang["tanggal"], id_gudang: NewStokValue["id_gudang"], id_barang: NewStokValue["id_barang"], qty: NewStokBarang["stok"], tx = db) => {
    await tx.transaction(async (tx) => {
        const tahun = new Date(tanggal).getFullYear();
        const bulan = new Date(tanggal).getMonth() + 1;
        // cek table stok value sesuai barang pada tahun yang sesuai
        const [dataStokValue] = await tx
            .select()
            .from(stok_value)
            .where(and(eq(stok_value.id_barang, id_barang), eq(stok_value.id_gudang, id_gudang), eq(stok_value.tahun, tahun)));

        // jika tidak ada maka tambah stok value pada tahun yang sesuai
        if (dataStokValue == null) {
            const dataStokValueTahunSebelumnya = await tx
                .select()
                .from(stok_value)
                .where(and(eq(stok_value.id_barang, id_barang), eq(stok_value.id_gudang, id_gudang), eq(stok_value.tahun, tahun - 1)));

            // cek pada tahun sebelumnya apakah ada stok value jika ada maka ambil stok value tahun sebelumnya dan jadikan stok awal
            let db0 = dataStokValueTahunSebelumnya.length > 0 ? parseFloat(dataStokValueTahunSebelumnya[0].db13 as string) - parseFloat(dataStokValueTahunSebelumnya[0].cr13 as string) : 0;

            await tx.insert(stok_value).values({
                id_barang: id_barang,
                id_gudang: id_gudang,
                tahun: tahun,
                cr0: "0",
                db0: db0.toString(),
                [`db${bulan}`]: qty,
                db13: qty,
            });
        } else {
            // update stok value
            if (parseFloat(qty) > 0) {
                await tx.execute(sql.raw(`UPDATE stok_value set db${bulan}=db${bulan} + ${qty} WHERE id_gudang=${id_gudang} AND id_barang=${id_barang} AND tahun=${tahun}`));
            } else {
                await tx.execute(sql.raw(`UPDATE stok_value set cr${bulan}=cr${bulan} + ${parseFloat(qty) * -1} WHERE id_gudang=${id_gudang} AND id_barang=${id_barang} AND tahun=${tahun}`));
            }
            await updateStokAkhir(tahun, id_gudang, id_barang, tx);
        }
        if (tahun + 1 === new Date().getFullYear()) {
            const dataStokAkhir = await getStokValueById({ tahun, id_barang, id_gudang });
            const dataStokValue = await tx
                .update(stok_value)
                .set({
                    db0: `${dataStokAkhir.db13 as any - parseFloat(dataStokAkhir.cr13 as string)}`,
                    cr0: "0",
                })
                .where(and(eq(stok_value.id_gudang, id_gudang), eq(stok_value.id_barang, id_barang), eq(stok_value.tahun, new Date().getFullYear())));
        }
    });
};
