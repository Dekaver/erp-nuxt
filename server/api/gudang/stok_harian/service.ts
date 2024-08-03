// import { and, eq, sql } from "drizzle-orm";

// import { NewStokHarian, StokHarian, insertStokHarianSchema, stok_harian } from "./schema";
// import { NewStokBarang } from "../stok_barang/schema";
// import { ToString, formatDate } from "../../../libs/formater";

// export const getStokHarian = async (tx = db) => {
//     const data = await tx.select().from(stok_harian);
//     return data;
// };
// export const getStokHarianById = async (param: Pick<StokHarian, "id_barang" | "id_gudang" | "tanggal">, tx = db) => {
//     const [data] = await tx
//         .select()
//         .from(stok_harian)
//         .where(and(eq(stok_harian.id_barang, param.id_barang), eq(stok_harian.id_gudang, param.id_gudang), eq(stok_harian.tanggal, param.tanggal)));
//     return data;
// };

// export const createStokHarian = async (form: NewStokHarian, tx = db) => {
//     const [data] = await tx.insert(stok_harian).values(form).returning();
//     return data;
// };

// export const updateStokHarian = async (tanggal: NewStokBarang["tanggal"], id_gudang: NewStokHarian["id_gudang"], id_barang: NewStokHarian["id_barang"], qty: NewStokBarang["stok"], tx = db) => {
//     await tx.transaction(async (tx) => {
//         // cek table stok value sesuai barang pada tahun yang sesuai
//         const [dataStokHarian] = await tx
//             .select()
//             .from(stok_harian)
//             .where(and(eq(stok_harian.id_barang, id_barang), eq(stok_harian.id_gudang, id_gudang), eq(stok_harian.tanggal, tanggal)));

//         // jika tidak ada maka tambah stok value pada tahun yang sesuai
//         if (dataStokHarian == null) {
//             const validate = insertStokHarianSchema.parse({
//                 id_barang: id_barang,
//                 id_gudang: id_gudang,
//                 tanggal: formatDate(tanggal),
//                 masuk: parseFloat(qty) > 0 ? ToString(qty) : "0",
//                 keluar: parseFloat(qty) < 0 ? ToString(qty) : "0",
//             });
//             await createStokHarian(validate, tx);
//         } else {
//             // update stok value
//             if (parseFloat(qty) > 0) {
//                 await tx.execute(sql.raw(`UPDATE stok_harian set masuk=masuk + ${qty} WHERE id_gudang=${id_gudang} AND id_barang=${id_barang} AND tanggal='${formatDate(tanggal)}'`));
//             } else {
//                 await tx.execute(sql.raw(`UPDATE stok_harian set keluar=keluar + ${qty} WHERE id_gudang=${id_gudang} AND id_barang=${id_barang} AND tanggal='${formatDate(tanggal)}'`));
//             }
//         }
//     });
// };
