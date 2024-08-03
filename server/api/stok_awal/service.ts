// import { and, desc, eq, getTableColumns, sql } from "drizzle-orm";
// import { type NewStokAwalBarang, type StokAwalBarang, stok_awal_barang } from "./schema";
// import { DateTz, ToString } from "../../libs/formater";
// import { barang } from "../barang/schema";
// import { satuan } from "../satuan/schema";
// import { gudang } from "../gudang/schema";
// import { kategori_barang } from "../kategori_barang/schema";
// import { insertStokBarangSchema, stok_barang } from "../gudang/stok_barang/schema";
// import { StokValue, insertStokValueSchema, stok_value } from "../gudang/stok_value/schema";

// const columns = getTableColumns(stok_awal_barang);

// export const getStokAwalBarang = async (tx = db) => {
//     const columns = getTableColumns(stok_awal_barang);
//     const data = await tx
//         .select({
//             ...columns,
//             id_satuan: barang.id_satuan,
//             satuan: satuan.satuan,
//             id_gudang: stok_awal_barang.id_gudang,
//             gudang: gudang.gudang,
//             id_kategori: barang.id_kategori,
//             kategori_barang: kategori_barang.kategori_barang,
//             kode_barang: barang.kode_barang,
//             nama_barang: barang.nama_barang,
//         })
//         .from(stok_awal_barang)
//         .innerJoin(barang, eq(barang.id, stok_awal_barang.id_barang))
//         .innerJoin(kategori_barang, eq(kategori_barang.id, barang.id_kategori))
//         .innerJoin(gudang, eq(gudang.id, stok_awal_barang.id_gudang))
//         .innerJoin(satuan, eq(satuan.id, barang.id_satuan))
//         .orderBy(desc(stok_awal_barang.id));
//     return data;
// };

// export const getStokAwalBarangById = async (params: StokAwalBarang["id"], tx = db) => {
//     const columns = getTableColumns(stok_awal_barang);
//     const [data] = await tx
//         .select({
//             ...columns,
//             satuan: satuan.satuan,
//         })
//         .from(stok_awal_barang)
//         .innerJoin(barang, eq(barang.id, stok_barang.id_barang))
//         .innerJoin(gudang, eq(gudang.id, stok_barang.id_barang))
//         .innerJoin(satuan, eq(satuan.id, barang.id_satuan))
//         .where(eq(stok_awal_barang.id, params));
//     return data;
// };

// export const createStokAwalBarang = async (form: NewStokAwalBarang, tx = db) => {
//     return await tx.transaction(async (tx) => {
//         const [check] = await tx
//             .select()
//             .from(stok_awal_barang)
//             .where(and(eq(stok_awal_barang.id_barang, form.id_barang), eq(stok_awal_barang.id_gudang, form.id_gudang)));
//         if (check) {
//             throw ValidationError("Stok Awal sudah ada.");
//         }
//         const [data] = await tx.insert(stok_awal_barang).values(form).returning();
//         const validateStokBarang = insertStokBarangSchema.parse({
//             id_gudang: form.id_gudang,
//             tanggal: DateTz(),
//             id_barang: form.id_barang,
//             stok: ToString(form.qty),
//             stok_awal: ToString(form.qty),
//             hpp: ToString(form.hpp),
//             reff: "SA",
//             id_reff: data.id,
//             created_by: form.created_by,
//             updated_by: form.updated_by,
//         });

//         const [dataStokBarang] = await tx.insert(stok_barang).values(validateStokBarang).returning();

//         const tahun = new Date(dataStokBarang.tanggal).getFullYear();

//         //cek apakah stok value sudah ada
//         const [cek_stok_value] = await tx
//             .select()
//             .from(stok_value)
//             .where(and(eq(stok_value.id_gudang, form.id_gudang), eq(stok_value.id_barang, form.id_barang), eq(stok_value.tahun, tahun)));
//         if (cek_stok_value == undefined) {
//             // jika belum ada
//             const [cek_stok_value_tahun_sebelumnya]: StokValue[] = await tx
//                 .select()
//                 .from(stok_value)
//                 .where(and(eq(stok_value.id_gudang, form.id_gudang), eq(stok_value.id_barang, form.id_barang), eq(stok_value.tahun, tahun - 1)));

//             const db0 =
//                 cek_stok_value_tahun_sebelumnya == undefined
//                     ? "0"
//                     : (ToString(parseFloat(cek_stok_value_tahun_sebelumnya.db13 as string) - parseFloat(cek_stok_value_tahun_sebelumnya.cr13 as string)) as string);

//             const validateStokValue = insertStokValueSchema.parse({
//                 id_barang: form.id_barang,
//                 id_gudang: form.id_gudang,
//                 tahun: tahun,
//                 db0: (parseFloat(db0) + parseFloat(form.qty)).toString(),
//                 db13: (parseFloat(db0) + parseFloat(form.qty)).toString(),
//             });

//             await tx.insert(stok_value).values(validateStokValue);

//             //update stok_value
//         } else {
//             const update_stok_value = await tx
//                 .update(stok_value)
//                 .set({
//                     db0: form.qty,
//                 })
//                 .where(and(eq(stok_value.id_barang, form.id_barang), eq(stok_value.id_gudang, form.id_gudang), eq(stok_value.tahun, tahun)));
//         }
//         // update db13 dan cr13
//         const update_stok_value_akhir = await tx.execute(
//             sql`UPDATE stok_value set db13=db0+db1+db2+db3+db4+db5+db6+db7+db8+db9+db10+db11+db12, cr13=cr0+cr1+cr2+cr3+cr4+cr5+cr6+cr7+cr8+cr9+cr10+cr11+cr12 WHERE id_gudang=${form.id_gudang} AND id_barang=${form.id_barang} AND tahun=${tahun}`,
//         );

//         return data;
//     });
// };

// export const updateStokAwalBarang = async (id: StokAwalBarang["id"], form: NewStokAwalBarang, tx = db) => {
//     return await tx.transaction(async (tx) => {
//         const [dataStokBarang] = await tx
//             .select({
//                 ...columns,
//                 stok: stok_barang.stok,
//                 stok_awal: stok_barang.stok_awal,
//             })
//             .from(stok_awal_barang)
//             .innerJoin(
//                 stok_barang,
//                 and(
//                     eq(stok_awal_barang.id_barang, stok_barang.id_barang),
//                     eq(stok_awal_barang.id_gudang, stok_barang.id_gudang),
//                     eq(stok_awal_barang.id, stok_barang.id_reff),
//                     eq(stok_barang.reff, "SA"),
//                 ),
//             )
//             .where(eq(stok_awal_barang.id, id));
//         if (!dataStokBarang) {
//             throw ValidationError("Data stok barang tidak ada");
//         }
//         if (dataStokBarang.id_barang != form.id_barang) {
//             throw ValidationError("Tidak dapat merubah Barang");
//         }
//         const selisihQty = parseFloat(form.qty) - parseFloat(dataStokBarang.stok_awal);
//         if (parseFloat(dataStokBarang.stok) + selisihQty < 0) {
//             throw ValidationError(`Stok Barang tidak mencukupi, sisa stok ${dataStokBarang.stok}`);
//         }
//         const [data] = await tx
//             .update(stok_awal_barang)
//             .set({
//                 hpp: form.hpp,
//                 qty: form.qty,
//             })
//             .where(eq(stok_awal_barang.id, id))
//             .returning();
//         // update stok barang terkait
//         await tx
//             .update(stok_barang)
//             .set({
//                 stok: sql`stok + ${selisihQty}`,
//                 stok_awal: sql`stok_awal + ${selisihQty}`,
//             })
//             .where(and(eq(stok_barang.id_reff, dataStokBarang.id), eq(stok_barang.reff, "SA")));
//         // update stok value
//         const tahun = new Date(data.created_date).getFullYear();

//         //cek apakah stok value sudah ada
//         const [cek_stok_value] = await tx
//             .select()
//             .from(stok_value)
//             .where(and(eq(stok_value.id_gudang, form.id_gudang), eq(stok_value.id_barang, form.id_barang), eq(stok_value.tahun, tahun)));
//         if (cek_stok_value == undefined) {
//             // jika belum ada
//             const [cek_stok_value_tahun_sebelumnya]: StokValue[] = await tx
//                 .select()
//                 .from(stok_value)
//                 .where(and(eq(stok_value.id_gudang, form.id_gudang), eq(stok_value.id_barang, form.id_barang), eq(stok_value.tahun, tahun - 1)));

//             const db0 =
//                 cek_stok_value_tahun_sebelumnya == undefined
//                     ? "0"
//                     : (ToString(parseFloat(cek_stok_value_tahun_sebelumnya.db13 as string) - parseFloat(cek_stok_value_tahun_sebelumnya.cr13 as string)) as string);

//             const validateStokValue = insertStokValueSchema.parse({
//                 id_barang: form.id_barang,
//                 id_gudang: form.id_gudang,
//                 tahun: tahun,
//                 db0: ToString(parseFloat(db0) + selisihQty),
//                 db13: ToString(parseFloat(db0) + selisihQty),
//             });

//             await tx.insert(stok_value).values(validateStokValue);

//             //update stok_value
//         } else {
//             const update_stok_value = await tx
//                 .update(stok_value)
//                 .set({
//                     db0: sql`db0 + ${selisihQty}`,
//                     db13: sql`db0 + ${selisihQty}`,
//                 })
//                 .where(and(eq(stok_value.id_barang, form.id_barang), eq(stok_value.id_gudang, form.id_gudang), eq(stok_value.tahun, tahun)));
//         }
//         // update db13 dan cr13
//         const update_stok_value_akhir = await tx.execute(
//             sql`UPDATE stok_value set db13=db0+db1+db2+db3+db4+db5+db6+db7+db8+db9+db10+db11+db12, cr13=cr0+cr1+cr2+cr3+cr4+cr5+cr6+cr7+cr8+cr9+cr10+cr11+cr12 WHERE id_gudang=${form.id_gudang} AND id_barang=${form.id_barang} AND tahun=${tahun}`,
//         );
//         return data;
//     });
// };

// export const deleteStokAwalBarang = async (id: StokAwalBarang["id"], tx = db) => {
//     const [dataStokBarang] = await tx
//         .select({
//             ...columns,
//             stok: stok_barang.stok,
//             stok_awal: stok_barang.stok_awal,
//         })
//         .from(stok_awal_barang)
//         .innerJoin(
//             stok_barang,
//             and(eq(stok_awal_barang.id_barang, stok_barang.id_barang), eq(stok_awal_barang.id_gudang, stok_barang.id_gudang), eq(stok_awal_barang.id, stok_barang.id_reff), eq(stok_barang.reff, "SA")),
//         )
//         .where(eq(stok_awal_barang.id, id));
//     if (dataStokBarang.stok != dataStokBarang.stok_awal) {
//         throw ValidationError("Sudah ada transaksi, tidak dapat dihapus");
//     }

//     const [deleteStokBarang] = await tx
//         .delete(stok_barang)
//         .where(and(eq(stok_barang.id_reff, id), eq(stok_barang.reff, "SA")))
//         .returning();

//     const update_stok_value = await tx
//         .update(stok_value)
//         .set({
//             db0: sql`db0 - ${dataStokBarang.stok_awal}`,
//             db13: sql`db13 - ${dataStokBarang.stok_awal}`,
//         })
//         .where(and(eq(stok_value.id_barang, dataStokBarang.id_barang), eq(stok_value.id_gudang, dataStokBarang.id_gudang), eq(stok_value.tahun, new Date(dataStokBarang.created_date).getFullYear())));

//     const [data] = await tx.delete(stok_awal_barang).where(eq(stok_awal_barang.id, id)).returning();

//     return data;
// };

// export const stok_awal_barangColumns = getTableColumns(stok_awal_barang);
