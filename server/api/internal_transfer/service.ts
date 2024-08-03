// import { and, desc, eq, getTableColumns, inArray, isNotNull, notInArray, sql } from "drizzle-orm";

// import { ParsedQs } from "qs";
// import { alias } from "drizzle-orm/pg-core";

// import { barang, Barang } from "../barang/schema";
// import { getBarangById } from "../barang/service";
// import { gudang } from "../gudang/schema";
// import { internal_order, internal_order_detail } from "../internal_order/schema";
// import { updateStatusInternalOrder } from "../internal_order/service";
// import { jabatan } from "../jabatan/schema";
// import { pegawai } from "../pegawai/schema";
// import { checkSisaDetail } from "../sales_order/service";
// import { satuan } from "../satuan/schema";
// import {
//     internalTransferColumns,
//     internal_transfer,
//     InternalTransfer,
//     internalTransferDetailColumns,
//     internal_transfer_detail,
//     NewInternalTransfer,
//     NewInternalTransferHpp,
//     internal_transfer_hpp,
//     NewInternalTransferDetail,
//     InternalTransferDetail,
//     InternalTransferHpp,
// } from "./schema";
// import { stok_barang } from "../gudang/stok_barang/schema";
// import { getQtyAvailability, updateStokBarang, createStokBarang } from "../gudang/stok_barang/service";
// import { stok_value } from "../gudang/stok_value/schema";

// const gudang_asal = alias(gudang, "gudang_asal");
// const gudang_tujuan = alias(gudang, "gudang_tujuan");
// const pengirim = alias(pegawai, "pengirim");
// const penerima = alias(pegawai, "penerima");

// export const getInternalTransfer = async (status: string | ParsedQs | string[] | ParsedQs[] | undefined, tx = db) => {
//     const data = tx
//         .select({
//             ...internalTransferColumns,
//             gudang_asal: gudang_asal.gudang,
//             gudang_tujuan: gudang_tujuan.gudang,
//             nomor_internal_order: internal_order.nomor,
//             created_name: pegawai.nama,
//             created_jabatan: jabatan.jabatan,
//             pengirim: pengirim.nama,
//             penerima: penerima.nama,
//             pembuat: pegawai.nama,
//         })
//         .from(internal_transfer)
//         .leftJoin(pengirim, eq(pengirim.id, internal_transfer.id_pengirim))
//         .leftJoin(penerima, eq(penerima.id, internal_transfer.id_penerima))
//         .innerJoin(pegawai, eq(pegawai.id, internal_transfer.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(gudang_asal, eq(gudang_asal.id, internal_transfer.id_gudang_asal))
//         .innerJoin(gudang_tujuan, eq(gudang_tujuan.id, internal_transfer.id_gudang_tujuan))
//         .leftJoin(internal_order, eq(internal_order.id, internal_transfer.id_internal_order));

//     if (status != undefined) {
//         switch (typeof status) {
//             case "string":
//                 data.where(eq(internal_transfer.status, status));
//                 break;
//             case "object":
//                 data.where(inArray(internal_transfer.status, status as string[]));
//                 break;
//             default:
//                 break;
//         }
//     }
//     return await data.orderBy(desc(internal_transfer.tanggal), desc(internal_transfer.nomor));
// };

// export const getInternalReceive = async (status: string | ParsedQs | string[] | ParsedQs[] | undefined, tx = db) => {
//     const data = tx
//         .select({
//             ...internalTransferColumns,
//             gudang_asal: gudang_asal.gudang,
//             gudang_tujuan: gudang_tujuan.gudang,
//             nomor_internal_order: internal_order.nomor,
//             created_name: pegawai.nama,
//             created_jabatan: jabatan.jabatan,
//             pengirim: pengirim.nama,
//             penerima: penerima.nama,
//             pembuat: pegawai.nama,
//         })
//         .from(internal_transfer)
//         .leftJoin(pengirim, eq(pengirim.id, internal_transfer.id_pengirim))
//         .leftJoin(penerima, eq(penerima.id, internal_transfer.id_penerima))
//         .innerJoin(pegawai, eq(pegawai.id, internal_transfer.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(gudang_asal, eq(gudang_asal.id, internal_transfer.id_gudang_asal))
//         .innerJoin(gudang_tujuan, eq(gudang_tujuan.id, internal_transfer.id_gudang_tujuan))
//         .leftJoin(internal_order, eq(internal_order.id, internal_transfer.id_internal_order));

//     if (status != undefined) {
//         switch (typeof status) {
//             case "string":
//                 data.where(and(eq(internal_transfer.status_terima, status), isNotNull(internal_transfer.status_terima)));
//                 break;
//             case "object":
//                 data.where(and(inArray(internal_transfer.status_terima, status as string[]), isNotNull(internal_transfer.status_terima)));
//                 break;
//             default:
//                 break;
//         }
//     } else {
//         data.where(isNotNull(internal_transfer.status_terima));
//     }
//     return await data.orderBy(desc(internal_transfer.tanggal), desc(internal_transfer.nomor));
// };

// export const getOptionInternalTransfer = async (status: string | ParsedQs | string[] | ParsedQs[] | undefined, tx = db) => {
//     const data = tx
//         .select({
//             id: internal_transfer.id,
//             nomor: internal_transfer.nomor,
//             tanggal: internal_transfer.tanggal,
//             gudang_asal: gudang_asal.gudang,
//             gudang_tujuan: gudang_tujuan.gudang,
//             nomor_internal_order: internal_order.nomor,
//             created_name: pegawai.nama,
//             created_jabatan: jabatan.jabatan,
//             pengirim: pengirim.nama,
//             penerima: penerima.nama,
//             pembuat: pegawai.nama,
//         })
//         .from(internal_transfer)
//         .innerJoin(pengirim, eq(pengirim.id, internal_transfer.id_pengirim))
//         .leftJoin(penerima, eq(penerima.id, internal_transfer.id_penerima))
//         .innerJoin(pegawai, eq(pegawai.id, internal_transfer.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(gudang_asal, eq(gudang_asal.id, internal_transfer.id_gudang_asal))
//         .innerJoin(gudang_tujuan, eq(gudang_tujuan.id, internal_transfer.id_gudang_tujuan))
//         .innerJoin(internal_order, eq(internal_order.id, internal_transfer.id_internal_order));
//     if (status != undefined) {
//         switch (typeof status) {
//             case "string":
//                 data.where(eq(internal_transfer.status, status));
//                 break;
//             case "object":
//                 data.where(inArray(internal_transfer.status, status as string[]));
//                 break;
//             default:
//                 break;
//         }
//     }
//     return await data.orderBy(desc(internal_transfer.tanggal), desc(internal_transfer.nomor));
// };

// export const getOptionInternalTransferForInvoice = async (tx = db) => {
//     const data = tx
//         .select({
//             id: internal_transfer.id,
//             nomor: internal_transfer.nomor,
//             tanggal: internal_transfer.tanggal,
//             gudang_asal: gudang_asal.gudang,
//             gudang_tujuan: gudang_tujuan.gudang,
//             nomor_internal_order: internal_order.nomor,
//             created_name: pegawai.nama,
//             created_jabatan: jabatan.jabatan,
//             pengirim: pengirim.nama,
//             penerima: penerima.nama,
//             pembuat: pegawai.nama,
//         })
//         .from(internal_transfer)
//         .innerJoin(pengirim, eq(pengirim.id, internal_transfer.id_pengirim))
//         .leftJoin(penerima, eq(penerima.id, internal_transfer.id_penerima))
//         .innerJoin(pegawai, eq(pegawai.id, internal_transfer.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(gudang_asal, eq(gudang_asal.id, internal_transfer.id_gudang_asal))
//         .innerJoin(gudang_tujuan, eq(gudang_tujuan.id, internal_transfer.id_gudang_tujuan))
//         .innerJoin(internal_order, eq(internal_order.id, internal_transfer.id_internal_order))
//         .where(and(eq(internal_transfer.status, "C"), notInArray(internal_transfer.id, sql`(SELECT id_internal_transfer FROM invoice_internal_transfer)`)));
//     return data;
// };

// export const getInternalTransferById = async (id: InternalTransfer["id"], tx = db) => {
//     const [data] = await tx
//         .select({
//             ...internalTransferColumns,
//             gudang_asal: gudang_asal.gudang,
//             gudang_tujuan: gudang_tujuan.gudang,
//             nomor_internal_order: internal_order.nomor,
//             tanggal_internal_order: internal_order.tanggal,
//             created_name: pegawai.nama,
//             created_jabatan: jabatan.jabatan,
//             pengirim: pengirim.nama,
//             penerima: penerima.nama,
//             pembuat: pegawai.nama,
//         })
//         .from(internal_transfer)
//         .innerJoin(pengirim, eq(pengirim.id, internal_transfer.id_pengirim))
//         .leftJoin(penerima, eq(penerima.id, internal_transfer.id_penerima))
//         .innerJoin(pegawai, eq(pegawai.id, internal_transfer.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(gudang_asal, eq(gudang_asal.id, internal_transfer.id_gudang_asal))
//         .innerJoin(gudang_tujuan, eq(gudang_tujuan.id, internal_transfer.id_gudang_tujuan))
//         .leftJoin(internal_order, eq(internal_order.id, internal_transfer.id_internal_order))
//         .where(eq(internal_transfer.id, id));

//     if (data == undefined) {
//         throw NotFoundError("Not found");
//     }

//     const data_detail = await tx
//         .select({
//             ...internalTransferDetailColumns,
//             nama_barang: barang.nama_barang,
//             kode_barang: barang.kode_barang,
//             satuan: satuan.satuan,
//         })
//         .from(internal_transfer_detail)
//         .innerJoin(barang, eq(barang.id, internal_transfer_detail.id_barang))
//         .innerJoin(satuan, eq(satuan.id, barang.id_satuan))
//         .where(eq(internal_transfer_detail.id, id))
//         .orderBy(internal_transfer_detail.urut);

//     return { ...data, detail: data_detail };
// };

// export const createInternalTransfer = async (form: NewInternalTransfer, tx = db) => {
//     const [data] = await tx.insert(internal_transfer).values(form).returning();
//     return data;
// };

// export const getHPPInternalTransfer = async (id: NewInternalTransferHpp["id"], tx = db) => {
//     const [data] = await tx
//         .select({
//             hpp: stok_barang.hpp,
//         })
//         .from(internal_transfer_hpp)
//         .innerJoin(stok_barang, eq(stok_barang.id, internal_transfer_hpp.id_stok_barang))
//         .where(eq(internal_transfer_hpp.id, id))
//         .orderBy(stok_barang.tanggal, stok_barang.id);
//     return data;
// };

// export const createInternalTransferDetail = async (form: NewInternalTransferDetail[], tx = db) => {
//     const data = await tx.insert(internal_transfer_detail).values(form).returning();
//     return data;
// };

// export const deleteInternalTransferDetail = async (id: NewInternalTransferDetail["id"], tx = db) => {
//     const data = await tx.delete(internal_transfer_detail).where(eq(internal_transfer_detail.id, id));
//     return data;
// };

// export const updateInternalTransfer = async (id: InternalTransfer["id"], form: NewInternalTransfer, tx = db) => {
//     try {
//         const [data] = await tx
//             .update(internal_transfer)
//             .set({
//                 nomor: form.nomor,
//                 tanggal: form.tanggal,

//                 keterangan: form.keterangan,
//                 id_penerima: form.id_penerima,
//                 id_pengirim: form.id_pengirim,
//                 id_gudang_asal: form.id_gudang_asal,
//                 id_gudang_tujuan: form.id_gudang_tujuan,
//                 telepon: form.telepon,
//                 status: form.status,
//                 driver: form.driver,
//                 transporter: form.transporter,
//                 jam_kirim: form.jam_kirim,
//                 modified_by: form.modified_by,
//                 modified_date: sql`LOCALTIMESTAMP`,
//             })
//             .where(eq(internal_transfer.id, id))
//             .returning();
//         return data;
//     } catch (error: any) {
//         console.log(error);
//         if (error.name == "ValidationError") {
//             throw ValidationError(error.message);
//         }
//         throw NotFoundError("error");
//     }
// };

// export const updateReceiveInternalTransfer = async (form: NewInternalTransfer, tx = db) => {
//     try {
//         const [data] = await tx
//             .update(internal_transfer)
//             .set({
//                 keterangan: form.keterangan,
//                 id_penerima: form.id_penerima,
//                 tanggal_terima: form.tanggal_terima,
//                 jam_terima: form.jam_terima,
//                 status_terima: form.status_terima,
//             })
//             .where(eq(internal_transfer.id, form.id as number))
//             .returning();
//         return data;
//     } catch (error: any) {
//         console.log(error);
//         if (error.name == "ValidationError") {
//             throw ValidationError(error.message);
//         }
//         throw NotFoundError("error");
//     }
// };

// export const updateStatusInternalOrderSend = async (form: InternalTransfer, formDetail: InternalTransferDetail[], tx = db) => {
//     const id_gudang = form.id_gudang_asal;
//     for (let j = 0; j < formDetail.length; j++) {
//         const d = formDetail[j];
//         const dataBarang: Barang = await getBarangById(d.id_barang, tx);
//         if (dataBarang.is_stok) {
//             const tahun = new Date(form.tanggal).getFullYear();
//             const bulan = new Date(form.tanggal).getMonth() + 1;
//             //ambil stok barang dari gudang sesuai id barang
//             const availability_stok = await getQtyAvailability(parseFloat(d.qty as string), d.id_barang, d.id_satuan, id_gudang, tx);

//             //cek stok apakah mencukupi untuk di pakai
//             if (!availability_stok.is_available_qty) {
//                 throw ValidationError(`Stok ${dataBarang.nama_barang} Tersisa ${availability_stok.sisa_stok || 0} ${availability_stok.satuan}`);
//             } else {
//                 await tx
//                     .update(internal_order_detail)
//                     .set({
//                         diambil: d.qty as string,
//                         sisa: sql`sisa - ${d.qty}`,
//                     })
//                     .where(and(eq(internal_order_detail.id, form.id_internal_order as number), eq(internal_order_detail.id_barang, d.id_barang)));

//                 //update stok barang menggunakan FIFO
//                 const stok_barang: any = await tx.execute(sql`SELECT * 
// 									FROM stok_barang 
// 									WHERE id_gudang = ${id_gudang} AND id_barang=${d.id_barang} AND stok > 0  
// 									ORDER BY tanggal,id`);

//                 let qty = parseFloat(availability_stok.qty_konversi as string);
//                 let k = 0;
//                 while (qty > 0) {
//                     let tempqty = 0;
//                     if (qty >= stok_barang[k].stok) {
//                         qty = qty - stok_barang[k].stok;
//                         tempqty = stok_barang[k].stok;

//                         const update_stok_barang = await updateStokBarang(stok_barang[k].id, stok_barang[k].stok * -1, tx);
//                     } else {
//                         const update_stok_barang = await updateStokBarang(stok_barang[k].id, qty * -1, tx);
//                         tempqty = qty;
//                         qty = qty - stok_barang[k].stok;
//                     }
//                     const insert_stok_peminjaman = await tx
//                         .insert(internal_transfer_hpp)
//                         .values({ id: form.id, id_stok_barang: stok_barang[k].id as number, qty: tempqty.toString() })
//                         .returning();
//                     k = k + 1;
//                 }

//                 //cek table stok_value sesuai barang pada tahun pemakaian barang

//                 const cek_stok_value = await tx.execute(sql`SELECT * FROM stok_value WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun}`);

//                 // jika tidak ada maka tambah stok_value pada tahun pemakaian barang
//                 if (cek_stok_value.length == 0) {
//                     const cek_stok_value_tahun_sebelumnya: any = await tx.execute(sql`SELECT * FROM stok_value WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun - 1}`);
//                     let db0 = 0;
//                     //cek pada tahun sebelumnya jika ada ambil stok akhir dan jadikan stok awal

//                     if (cek_stok_value_tahun_sebelumnya.length > 0) {
//                         db0 = cek_stok_value_tahun_sebelumnya.db13 - cek_stok_value_tahun_sebelumnya.cr13;
//                     }
//                     let data_stok_value: any = {
//                         id_gudang: id_gudang,
//                         id_barang: d.id_barang,
//                         tahun: tahun,
//                         cr0: 0,
//                         db0: db0,
//                     };
//                     data_stok_value[`cr${bulan}`] = d.qty;
//                     data_stok_value[`cr13`] = d.qty;
//                     await tx.insert(stok_value).values(data_stok_value);
//                 } else {
//                     //update stok_value
//                     await tx.execute(sql.raw(`UPDATE stok_value set cr${bulan}=cr${bulan} + ${d.qty} WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun}`));

//                     await tx.execute(
//                         sql`UPDATE stok_value set db13=db1+db2+db3+db4+db5+db6+db7+db8+db9+db10+db11+db12, cr13=cr1+cr2+cr3+cr4+cr5+cr6+cr7+cr8+cr9+cr10+cr11+cr12 WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun}`,
//                     );
//                 }
//                 if (tahun + 1 == new Date().getFullYear()) {
//                     const stok_akhir: any = await tx.execute(sql`SELECT * FROM stok_value WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun - 1}`);
//                     await tx.execute(
//                         sql`UPDATE stok_value SET db0=${stok_akhir[0].db13 - stok_akhir[0].cr13} AND cr0=0 WHERE id_gudang=${id_gudang} AND id_barang=${d.id_barang} AND tahun=${tahun - 1}`,
//                     );
//                 }
//             }
//         }
//     }
//     //tambah ke dalam stok value
//     // jika yang di ubah adalah tahun sebelumnya maka update saldo awal tahun ini
//     const sisa = await checkSisaDetail(form.id_internal_order as number, tx);
//     if (sisa > 0) {
//         await updateStatusInternalOrder(form.id_internal_order as number, "P", tx);
//     } else {
//         await updateStatusInternalOrder(form.id_internal_order as number, "C", tx);
//     }
// };

// export const deleteInternalTransfer = async (id: InternalTransfer["id"]) => {
//     try {
//         await db.transaction(async (tx) => {
//             await tx
//                 .delete(internal_transfer_detail)
//                 .where(eq(internal_transfer_detail.id, id))
//                 .then(async () => {
//                     const data = await tx.delete(internal_transfer).where(eq(internal_transfer.id, id));
//                 });
//         });
//         return 1;
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("error");
//     }
// };

// export const checkIfInternalTransferPosting = async (id: InternalTransfer["id"], tx = db) => {
//     try {
//         const [data] = await tx.execute(sql`SELECT 
// 		CASE
//             WHEN status = 'P' 
// 				THEN TRUE
//             	ELSE FALSE
// 		END AS is_closed
// 			FROM internal_transfer
// 			WHERE id=${id}`);
//         return data;
//     } catch (error) {
//         throw NotFoundError("error");
//     }
// };

// export const checkIfInternalTransferReceived = async (id: InternalTransfer["id"], tx = db) => {
//     try {
//         const [data] = await tx.execute(sql`SELECT 
// 		CASE
//             WHEN status_terima = 'A' 
// 				THEN TRUE
//             	ELSE FALSE
// 		END AS is_closed
// 			FROM internal_transfer
// 			WHERE id=${id}`);
//         return data;
//     } catch (error) {
//         throw NotFoundError("error");
//     }
// };

// export const checkIfInternalTransferClosing = async (id: InternalTransfer["id"]) => {
//     try {
//         const [data] = await db.execute(sql`SELECT 
// 		CASE
//             WHEN status = 'C' 
// 				THEN TRUE
//             	ELSE FALSE
// 		END AS is_closed
// 			FROM internal_transfer
// 			WHERE id=${id}`);
//         return data;
//     } catch (error) {
//         throw NotFoundError("error");
//     }
// };

// export const updateInternalTransferReceipt = async (id: InternalTransfer["id"], form: { internal_transfer: NewInternalTransfer; lDetail: NewInternalTransferDetail[] }) => {
//     try {
//         const returning: any = await db.transaction(async (tx) => {
//             const [data] = await tx.execute(sql`
//                 UPDATE internal_transfer
//                 SET
//                   status = ${form.internal_transfer.status},
//                   keterangan = ${form.internal_transfer.keterangan},
//                   status = ${form.internal_transfer.status},
//                 WHERE id = ${id} RETURNING *`);

//             await tx
//                 .delete(internal_transfer_detail)
//                 .where(eq(internal_transfer_detail.id, id))
//                 .then(async () => {
//                     const data_detail = await tx.insert(internal_transfer_detail).values(form.lDetail).returning();
//                     data.detail = data_detail;
//                 });
//             return data;
//         });
//         return returning;
//     } catch (error: any) {
//         console.log(error);
//         if (error.name == "ValidationError") {
//             throw ValidationError(error.message);
//         }
//         throw NotFoundError("error");
//     }
// };

// export const getHppById = async (id: InternalTransferHpp["id"], tx = db) => {
//     try {
//         const [data] = await tx.execute(sql`select sum(a.qty*hpp) as total_hpp from internal_transfer_hpp a
// 				inner join stok_barang b on b.id=a.id_stok_barang
// 				where a.id=${id}`);

//         return data;
//     } catch (error) {
//         throw NotFoundError("error");
//     }
// };

// export const updateStatusInternalTransfer = async (form: InternalTransfer, formDetail: InternalTransferDetail[], tx = db) => {
//     try {
//         return await tx.transaction(async (trx) => {
//             for (let i = 0; i < formDetail.length; i++) {
//                 const detail = formDetail[i];

//                 const hpp_it = await getHPPInternalTransfer(form.id, trx);

//                 // TODO: Tambah Stok Barang
//                 // await createStokBarang(
//                 //     {
//                 //         id_gudang: form.id_gudang_tujuan,
//                 //         id_barang: detail.id_barang,
//                 //         reff: `IT`,
//                 //         id_reff: form.id,
//                 //         hpp: hpp_it.hpp,
//                 //         tanggal: form.tanggal,
//                 //         stok: detail.diterima,
//                 //     },
//                 //     tx,
//                 // );

//                 // Tambah Stok Value
//                 const tahun = new Date(form.tanggal).getFullYear();
//                 const bulan = new Date(form.tanggal).getMonth() + 1;
//                 const cek_stok_value: any[] = await trx.execute(sql`SELECT * FROM stok_value WHERE id_gudang=${form.id_gudang_tujuan} AND id_barang=${detail.id_barang} AND tahun=${tahun}`);

//                 if (cek_stok_value.length == 0) {
//                     const cek_stok_value_tahun_sebelumnya: any[] = await trx.execute(
//                         sql`SELECT * FROM stok_value WHERE id_gudang=${form.id_gudang_tujuan} AND id_barang=${detail.id_barang} AND tahun=${tahun - 1}`,
//                     );
//                     let db0 = 0;
//                     if (cek_stok_value_tahun_sebelumnya.length > 0) {
//                         db0 = cek_stok_value_tahun_sebelumnya[0].db13 - cek_stok_value_tahun_sebelumnya[0].cr13;
//                     }
//                     let FormStokValue = {
//                         id_gudang: form.id_gudang_tujuan,
//                         id_barang: detail.id_barang,
//                         tahun: tahun,
//                         cr0: 0,
//                         db0: db0,
//                     } as any;
//                     FormStokValue[`db${bulan}`] = detail.diterima;
//                     FormStokValue[`db13`] = detail.diterima;
//                     await trx.insert(stok_value).values(FormStokValue).returning();
//                 } else {
//                     // Update Stok Value
//                     const updateStokValue = await trx.execute(
//                         sql.raw(`UPDATE stok_value set db${bulan}=db${bulan} + ${detail.diterima} WHERE id_gudang=${form.id_gudang_tujuan} AND id_barang=${detail.id_barang} AND tahun=${tahun}`),
//                     );
//                     const updateStokValueAkhir = await trx
//                         .execute(
//                             sql.raw(
//                                 `UPDATE stok_value set db13=db1+db2+db3+db4+db5+db6+db7+db8+db9+db10+db11+db12, cr13=cr1+cr2+cr3+cr4+cr5+cr6+cr7+cr8+cr9+cr10+cr11+cr12 WHERE id_gudang=${form.id_gudang_tujuan} AND id_barang=${detail.id_barang} AND tahun=${tahun}`,
//                             ),
//                         )
//                         .then(async () => {
//                             if (tahun + 1 == new Date().getFullYear()) {
//                                 const stok_akhir: any[] = await trx.execute(
//                                     sql`SELECT * FROM stok_value WHERE id_gudang=${form.id_gudang_tujuan} AND id_barang=${detail.id_barang} AND tahun=${tahun - 1}`,
//                                 );
//                                 await trx
//                                     .update(stok_value)
//                                     .set({
//                                         db0: ToString(((parseFloat(stok_akhir[0].db13) as number) - parseFloat(stok_akhir[0].cr13)) as number) as string,
//                                         cr0: "0",
//                                     })
//                                     .where(and(eq(stok_value.id_gudang, form.id_gudang_tujuan), eq(stok_value.id_barang, detail.id_barang), eq(stok_value.tahun, tahun)));
//                             }
//                         });
//                 }
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         throw ValidationError("Gagal memproses penerimaan barang.");
//     }
// };
