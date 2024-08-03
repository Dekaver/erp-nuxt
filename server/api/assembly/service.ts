// import { and, asc, eq, isNotNull, ne, sql } from "drizzle-orm";

// import { Barang } from "../barang/schema";
// import { getBarangById } from "../barang/service";
// import { insertStokBarangSchema, NewStokBarang } from "../gudang/stok_barang/schema";
// import { getQtyAvailability, updateStokBarang, tambahStokBarang } from "../gudang/stok_barang/service";
// import { stok_value } from "../gudang/stok_value/schema";
// import { assembly_bahan_baku, NewAssemblyBahanBaku, AssemblyBahanBaku } from "./bahan_baku/schema";
// import { assembly_biaya, NewAssemblyBiaya } from "./biaya/schema";
// import { Assembly, NewAssembly, assembly } from "./schema";

// export const nomorAssembly = async (tanggal: string, tx = db) => {
//     return await moduleNumberGenerator("assembly", "nomor", "tanggal", "AS", tanggal, tx);
// };

// export const getAssembly = async (tx = db) => {
//     const data = await tx.execute(sql`
//     SELECT
//     assembly.*, c.gudang, b.nama_barang as barang,
//     (SELECT JSON_AGG(ROW_TO_JSON(a))
//      FROM (
//          SELECT * FROM assembly_biaya aa WHERE aa.id = assembly.id ORDER BY aa.urut
//      ) a
//     ) AS biaya,
//     (SELECT JSON_AGG(ROW_TO_JSON(b))
//      FROM (
//          SELECT * FROM assembly_bahan_baku bb WHERE bb.id = assembly.id ORDER BY bb.urut
//      ) b
//     ) AS bahan_baku
// FROM
//     assembly 
// 	INNER JOIN barang b ON assembly.id_barang=b.id
// 	INNER JOIN gudang c ON assembly.id_gudang=c.id
// 	order by tanggal desc
// `);
//     return data;
// };

// export const getAssemblyById = async (params: Assembly["id"], tx = db) => {
//     const data = await tx.execute(sql`
//     SELECT
//     assembly.*,
//     (SELECT JSON_AGG(ROW_TO_JSON(a))
//      FROM (
//          SELECT * FROM assembly_biaya aa WHERE aa.id = assembly.id ORDER BY aa.urut
//      ) a
//     ) AS biaya,
//     (SELECT JSON_AGG(ROW_TO_JSON(b))
//      FROM (
//          SELECT * FROM assembly_bahan_baku bb WHERE bb.id = assembly.id ORDER BY bb.urut
//      ) b
//     ) AS bahan_baku
// FROM
//     assembly 
// WHERE assembly.id=${params}

// `);
//     return data[0];
// };

// export const createAssembly = async (form: NewAssembly, tx = db) => {
//     return await tx.transaction(async (tx) => {
//         const [data] = await tx.insert(assembly).values(form).returning();
//         return data;
//     });
// };

// export const updateAssembly = async (params: Assembly["id"], form: NewAssembly, tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const [updatedAssembly] = await trx.update(assembly).set(form).where(eq(assembly.id, params)).returning();
//         return updatedAssembly;
//     });
// };

// export const deleteAssembly = async (id: Assembly["id"], tx = db) => {
//     try {
//         return await tx.transaction(async (trx) => {
//             await trx.delete(assembly_bahan_baku).where(eq(assembly_bahan_baku.id, id));
//             await trx.delete(assembly_biaya).where(eq(assembly_biaya.id, id));
//             return await trx.delete(assembly).where(eq(assembly.id, id)).returning();
//         });
//     } catch (error) {
//         throw ValidationError("Assembly tidak boleh dihapus karena sudah digunakan");
//     }
// };

// export const createBiaya = async (form: NewAssemblyBiaya[], tx = db) => {
//     return await tx.insert(assembly_biaya).values(form).returning();
// };

// export const deleteBiaya = async (id_barang: NewAssemblyBiaya["id"], tx = db) => {
//     return await tx.delete(assembly_biaya).where(eq(assembly_biaya.id, id_barang as number));
// };

// export const createBahanBaku = async (form: NewAssemblyBahanBaku[], tx = db) => {
//     return await tx.insert(assembly_bahan_baku).values(form).returning();
// };

// export const deleteBahanBaku = async (id_barang: NewAssemblyBahanBaku["id"], tx = db) => {
//     return await tx.delete(assembly_bahan_baku).where(eq(assembly_bahan_baku.id, id_barang as number));
// };

// export const updateStok = async (form: Assembly, formBahanBaku: AssemblyBahanBaku[], tx = db) => {
//     const id_gudang = form.id_gudang;

//     const dataBarang: Barang = await getBarangById(form.id_barang as number, tx);
//     if (form.jenis == "R") {
//         for (let j = 0; j < formBahanBaku.length; j++) {
//             const d = formBahanBaku[j];
//             await penguranganStok({ id_barang: d.id_barang, qty: d.qty, id_satuan: d.id_satuan });
//         }
//         if (dataBarang.id_satuan != null) {
//             await penambahanStok({ id_barang: form.id_barang, qty: form.qty as string, id_satuan: dataBarang.id_satuan, harga: parseFloat(form.harga_satuan) });
//         }
//     } else {
//         for (let j = 0; j < formBahanBaku.length; j++) {
//             const d = formBahanBaku[j];
//             await penambahanStok({ id_barang: d.id_barang, qty: d.qty as string, id_satuan: d.id_satuan, harga: parseFloat(d.harga_beli) });
//         }
//         if (dataBarang.id_satuan != null) {
//             await penguranganStok({ id_barang: form.id_barang, qty: form.qty as string, id_satuan: dataBarang.id_satuan });
//         }
//     }

//     async function penguranganStok(d: { id_barang: number; qty: string; id_satuan: number }) {
//         const dataBarang: Barang = await getBarangById(d.id_barang as number, tx);
//         // TODO: check if barang is stok gk tau jasa itu gmn
//         if (dataBarang && dataBarang.is_stok) {
//             const tahun = new Date(form.tanggal).getFullYear();
//             const bulan = new Date(form.tanggal).getMonth() + 1;
//             //ambil stok barang dari gudang sesuai id barang
//             if (id_gudang != null) {
//                 const availability_stok = await getQtyAvailability(parseFloat(d.qty as string), d.id_barang as number, d.id_satuan, id_gudang, tx);
//                 //cek stok apakah mencukupi untuk di pakai
//                 if (!availability_stok.is_available_qty) {
//                     throw ValidationError(`Stok ${dataBarang.nama_barang} Tersisa ${availability_stok.sisa_stok || 0} ${availability_stok.satuan}`);
//                 } else {
//                     //update stok barang menggunakan FIFO
//                     const stok_barang: any = await tx.execute(sql`SELECT *
// 									FROM stok_barang
// 									WHERE id_gudang = ${id_gudang} AND id_barang=${d.id_barang} AND stok > 0
// 									ORDER BY tanggal,id`);

//                     let qty = parseFloat(availability_stok.qty_konversi as string);
//                     let k = 0;
//                     while (qty > 0) {
//                         let tempqty = 0;
//                         if (qty >= stok_barang[k].stok) {
//                             qty = qty - stok_barang[k].stok;
//                             tempqty = stok_barang[k].stok;

//                             const update_stok_barang = await updateStokBarang(stok_barang[k].id, stok_barang[k].stok * -1, tx);
//                         } else {
//                             const update_stok_barang = await updateStokBarang(stok_barang[k].id, qty * -1, tx);
//                             tempqty = qty;
//                             qty = qty - stok_barang[k].stok;
//                         }
//                         // const insert_stok_peminjaman = await tx
//                         //     .insert(delivery_order_hpp)
//                         //     .values({ id: form.id, id_stok_barang: stok_barang[k].id as number, qty: tempqty.toString() })
//                         //     .returning();
//                         k = k + 1;
//                     }

//                     //cek table stok_value sesuai barang pada tahun pemakaian barang

//                     const cek_stok_value = await tx.execute(sql`SELECT * FROM stok_value WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun}`);

//                     // jika tidak ada maka tambah stok_value pada tahun pemakaian barang
//                     if (cek_stok_value.length == 0) {
//                         const cek_stok_value_tahun_sebelumnya: any = await tx.execute(sql`SELECT * FROM stok_value WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun - 1}`);
//                         let db0 = 0;
//                         //cek pada tahun sebelumnya jika ada ambil stok akhir dan jadikan stok awal

//                         if (cek_stok_value_tahun_sebelumnya.length > 0) {
//                             db0 = cek_stok_value_tahun_sebelumnya.db13 - cek_stok_value_tahun_sebelumnya.cr13;
//                         }
//                         let data_stok_value: any = {
//                             id_gudang: id_gudang,
//                             id_barang: d.id_barang,
//                             tahun: tahun,
//                             cr0: 0,
//                             db0: db0,
//                         };
//                         data_stok_value[`cr${bulan}`] = d.qty;
//                         data_stok_value[`cr13`] = d.qty;
//                         await tx.insert(stok_value).values(data_stok_value);
//                     } else {
//                         //update stok_value
//                         const update_stok_value = await tx.execute(
//                             sql.raw(`UPDATE stok_value set cr${bulan}=cr${bulan} + ${d.qty} WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun}`),
//                         );

//                         const update_stok_value_akhir = await tx.execute(
//                             sql`UPDATE stok_value set db13=db1+db2+db3+db4+db5+db6+db7+db8+db9+db10+db11+db12, cr13=cr1+cr2+cr3+cr4+cr5+cr6+cr7+cr8+cr9+cr10+cr11+cr12 WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun}`,
//                         );
//                     }
//                     if (tahun + 1 == new Date().getFullYear()) {
//                         const stok_akhir: any = await tx.execute(sql`SELECT * FROM stok_value WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun - 1}`);
//                         await tx.execute(
//                             sql`UPDATE stok_value SET db0=${stok_akhir[0].db13 - stok_akhir[0].cr13} AND cr0=0 WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun - 1}`,
//                         );
//                     }
//                 }
//             }
//         }
//     }

//     async function penambahanStok(d: { id_barang: number; qty: string; id_satuan: number; harga: number }) {
//         let dataStok = [];
//         dataStok.push(d);
//         let validateStokBarang = (await Promise.all(
//             dataStok.map(async (item: { id_barang: number; qty: string; id_satuan: number; harga: number }) => {
//                 let hpp = item.harga;

//                 // Konversi jumlah barang berdasarkan satuan utama
//                 let [dataBarangSatuan] = await tx
//                     .select({ konversi: barang_satuan.konversi })
//                     .from(barang_satuan)
//                     .where(and(eq(barang_satuan.id_barang, item.id_barang as number), eq(barang_satuan.id_satuan, item.id_satuan)));
//                 let konversi = dataBarangSatuan ? parseFloat(dataBarangSatuan.konversi) : 1;

//                 if (item.id_barang) {
//                     return insertStokBarangSchema.parse({
//                         id_gudang: form.id_gudang,
//                         id_barang: item.id_barang,
//                         stok: ToString(parseFloat(item.qty) / konversi) as string,
//                         tanggal: formatDate(new Date(form.tanggal)),
//                         reff: "AS",
//                         id_reff: form.id,
//                         hpp: hpp.toString(),
//                         stok_awal: ToString(parseFloat(item.qty) / konversi) as string,
//                         created_by: form.created_by,
//                         updated_by: form.updated_by,
//                     });
//                 }
//                 return;
//             }),
//         )) as NewStokBarang[];

//         validateStokBarang = validateStokBarang.filter((item) => item !== undefined);
//         if (validateStokBarang.length > 0) {
//             await tambahStokBarang(validateStokBarang, tx);
//         }
//     }
// };
