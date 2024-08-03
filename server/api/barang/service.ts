import { and, asc, eq, isNotNull, ne, sql } from "drizzle-orm";
import {
    type NewBarang,
    type Barang,
    barang,
    NewBarangExtended,
    BarangSatuan,
    NewBarangSatuan,
    barangColumns,
    barang_satuan,
    barang_biaya,
    NewBarangBiaya,
    NewBarangBahanBaku,
    barang_bahan_baku,
} from "./schema";
import { satuan } from "../satuan/schema";
import { kategori_barang } from "../kategori_barang/schema";
import { brand } from "../brand/schema";

export const getBarang = async (tx = db) => {
    const data = await tx.execute(sql`
    SELECT
    barang.*,
    satuan.satuan,
    kategori_barang.kategori_barang,
    brand.brand,
    (SELECT JSON_AGG(ROW_TO_JSON(a))
     FROM (
         SELECT * FROM barang_biaya aa WHERE aa.id = barang.id ORDER BY aa.urut
     ) a
    ) AS biaya,
    (SELECT JSON_AGG(ROW_TO_JSON(b))
     FROM (
         SELECT * FROM barang_bahan_baku bb WHERE bb.id = barang.id ORDER BY bb.urut
     ) b
    ) AS bahan_baku
FROM
    barang 
LEFT JOIN satuan ON barang.id_satuan = satuan.id
LEFT JOIN kategori_barang ON barang.id_kategori = kategori_barang.id
LEFT JOIN brand ON barang.id_brand = brand.id
ORDER BY
    barang.nama_barang ASC,
    barang.harga_jual ASC
`);
    return data;
};

export const getOptionBarang = async () => {
    const data = await db
        .select({
            id: barang.id,
            kode_barang: barang.kode_barang,
            nama_barang: barang.nama_barang,
            harga_jual: barang.harga_jual,
            id_kategori: barang.id_kategori,
            kategori_barang: kategori_barang.kategori_barang,
            id_satuan: barang.id_satuan,
            satuan: satuan.satuan,
        })
        .from(barang)
        .leftJoin(satuan, eq(barang.id_satuan, satuan.id))
        .leftJoin(kategori_barang, eq(barang.id_kategori, kategori_barang.id))
        .where(and(eq(barang.status, true), isNotNull(barang.id_satuan), eq(barang.status, true)));
    return data;
};

export const getBarangWithStok = async (tx = db) => {
    const data = await tx
        .select({
            ...barangColumns,
            satuan: satuan.satuan,
            kategori_barang: kategori_barang.kategori_barang,
            stok: sql`COALESCE (d.stok, 0)`,
            id_gudang: sql`d.id_gudang`,
        })
        .from(barang)
        .leftJoin(kategori_barang, eq(kategori_barang.id, barang.id_kategori))
        .leftJoin(satuan, eq(satuan.id, barang.id_satuan))
        .leftJoin(sql`(SELECT SUM(stok) as stok, id_barang, id_gudang FROM stok_barang GROUP BY (id_barang, id_gudang)) d`, eq(sql`d.id_barang`, barang.id));

    return data;
};

// Keperluan untuk dropdown option barang
export const getBarangWithOptionSatuan = async (tx = db) => {
    const data = await tx.execute(sql`
					SELECT
					barang.*,
                    kategori_barang.id as id_kategori_barang,
                    kategori_barang.kategori_barang,
                    kategori_barang.id_account as id_account_kategori,
					COALESCE(
						(
							SELECT
								JSONB_AGG(
									JSON_BUILD_OBJECT(
										'satuan',
										satuan.satuan,
										'konversi',
										barang_satuan.konversi,
										'id',
										satuan.id,
										'keterangan',
										satuan.keterangan
									)
								)
							FROM
								barang_satuan
								LEFT JOIN satuan ON barang_satuan.id_satuan = satuan.id
							WHERE
								barang_satuan.id_barang = barang.id
						) || JSONB_AGG(
							JSON_BUILD_OBJECT(
								'satuan',
								satuan.satuan,
								'konversi',
								1,
								'id',
								satuan.id,
								'keterangan',
								satuan.keterangan
							)
						),
						JSONB_AGG(
							JSON_BUILD_OBJECT(
								'satuan',
								satuan.satuan,
								'konversi',
								1,
								'id',
								satuan.id,
								'keterangan',
								satuan.keterangan
							)
						)
					) as option_satuan
					FROM barang
					LEFT JOIN satuan on satuan.id = barang.id_satuan
					LEFT JOIN kategori_barang on kategori_barang.id = barang.id_kategori
					WHERE barang.status = true
					GROUP BY barang.id, kategori_barang.id;
	`);
    return data;
};
export const getBarangById = async (id: Barang["id"], tx = db) => {
    const [data] = await tx.select({
        ...barangColumns,
        satuan: satuan.satuan
    }).from(barang)
    .innerJoin(satuan, eq(satuan.id, barang.id_satuan))
    .where(eq(barang.id, id));
    return data;
};

export const createBarang = async (form: NewBarang, tx = db) => {
    return await tx.transaction(async (tx) => {
        const [check] = await tx.select({ kode_barang: barang.kode_barang }).from(barang).where(eq(barang.kode_barang, form.kode_barang));
        if (check) {
            throw ValidationError("Kode Barang sudah ada");
        }
        const [data] = await tx.insert(barang).values(form).returning();
        //  TODO: move file
        // if (!!createdBarang) {
        //   await moveFile(dataBarang.images as string);
        //   dataBarang.optional!.map((item: { image: string }) => {
        //     moveFile(item.image as string);
        //   });
        // }
        return data;
    });
};

export const updateBarang = async (params: Barang["id"], form: NewBarangExtended, tx = db) => {
    return await tx.transaction(async (trx) => {
        const [check] = await trx
            .select({ kode_barang: barang.kode_barang })
            .from(barang)
            .where(and(eq(barang.kode_barang, form.kode_barang), ne(barang.id, params)));
        if (check) {
            throw ValidationError("Kode Barang sudah ada");
        }
        const inputWithoutSatuanData: any = { ...form };
        delete inputWithoutSatuanData.satuan_data;

        const dataBarang: NewBarang = inputWithoutSatuanData;
        const [updatedBarang] = await trx
            .update(barang)
            .set(dataBarang)
            .where(eq(barang.id, form.id as number))
            .returning();
        return updatedBarang;
    });
};

export const createBarangSatuan = async (form: NewBarangSatuan[], tx = db) => {
    return await tx.insert(barang_satuan).values(form).returning();
};

export const deleteBarangSatuan = async (id_barang: BarangSatuan["id_barang"], tx = db) => {
    return await tx.delete(barang_satuan).where(eq(barang_satuan.id_barang, id_barang as number));
};

export const deleteBarang = async (id: Barang["id"], tx = db) => {
    try {
        return await tx.transaction(async (trx) => {
            await trx.delete(barang_satuan).where(eq(barang_satuan.id_barang, id));
            await trx.delete(barang_bahan_baku).where(eq(barang_bahan_baku.id, id));
            await trx.delete(barang_biaya).where(eq(barang_biaya.id, id));
            return await trx.delete(barang).where(eq(barang.id, id)).returning();
        });
    } catch (error) {
        throw ValidationError("Barang tidak boleh dihapus karena sudah digunakan");
    }
};

export const createBiaya = async (form: NewBarangBiaya[], tx = db) => {
    return await tx.insert(barang_biaya).values(form).returning();
};

export const deleteBiaya = async (id_barang: NewBarangBiaya["id"], tx = db) => {
    return await tx.delete(barang_biaya).where(eq(barang_biaya.id, id_barang as number));
};

export const createBahanBaku = async (form: NewBarangBahanBaku[], tx = db) => {
    return await tx.insert(barang_bahan_baku).values(form).returning();
};

export const deleteBahanBaku = async (id_barang: NewBarangBahanBaku["id"], tx = db) => {
    return await tx.delete(barang_bahan_baku).where(eq(barang_bahan_baku.id, id_barang as number));
};

// ? Gk tau kepake atau ndak
export const getBarangSatuanByIdBarang = async (params: Barang["id"]) => {
    const data = await db.execute(sql`SELECT a.id_barang, b.id_satuan as id_satuan_kiri, a.konversi, a.id_satuan as id_satuan_kanan 
    FROM barang_satuan a 
      JOIN barang b on b.id= a.id_barang 
    WHERE a.id_barang=${params}`);
    return data;
};

export const getStokBarang = async (params: Barang["id"], tx = db) => {
    const data = await tx.execute(sql`SELECT a.id_barang, b.id_satuan as id_satuan_kiri, a.konversi, a.id_satuan as id_satuan_kanan 
    FROM barang_satuan a 
      JOIN barang b on b.id= a.id_barang 
    WHERE a.id_barang=${params}`);
    return data;
};

export const deleteBarangSatuanByIdBarang = async (params: Barang["id"]) => {
    const data = await db.delete(barang_satuan).where(eq(barang_satuan.id_barang, params)).returning();
    return data[0];
};


// Keperluan untuk dropdown option barang
export const getBarangWithOptionSatuanByIdBarang = async (id: number, tx = db) => {
    const data = await tx.execute(sql`
					SELECT
					barang.*,
					COALESCE(
						(
							SELECT
								JSONB_AGG(
									JSON_BUILD_OBJECT(
										'satuan',
										satuan.satuan,
										'konversi',
										barang_satuan.konversi,
										'id',
										satuan.id,
										'keterangan',
										satuan.keterangan
									)
								)
							FROM
								barang_satuan
								LEFT JOIN satuan ON barang_satuan.id_satuan = satuan.id
							WHERE
								barang_satuan.id_barang = barang.id
						) || JSONB_AGG(
							JSON_BUILD_OBJECT(
								'satuan',
								satuan.satuan,
								'konversi',
								1,
								'id',
								satuan.id,
								'keterangan',
								satuan.keterangan
							)
						),
						JSONB_AGG(
							JSON_BUILD_OBJECT(
								'satuan',
								satuan.satuan,
								'konversi',
								1,
								'id',
								satuan.id,
								'keterangan',
								satuan.keterangan
							)
						)
					) as option_satuan
					FROM barang
					LEFT JOIN satuan on satuan.id = barang.id_satuan
					WHERE barang.status = true AND barang.id = ${id}
					GROUP BY barang.id;
	`);
    return data[0];
};