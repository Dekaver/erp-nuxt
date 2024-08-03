// import { and, desc, eq, inArray, notExists, SQL, sql } from "drizzle-orm";
// import { alias } from "drizzle-orm/pg-core";
// import { ParsedQs } from "qs";

// import { Barang } from "../barang/schema";
// import { getBarangById } from "../barang/service";
// import { gudang } from "../gudang/schema";
// import { updateStokBarangSchema } from "../gudang/stok_barang/schema";
// import { getQtyAvailability, kurangStokBarang } from "../gudang/stok_barang/service";
// import { invoice_detail } from "../invoice/detail/schema";
// import { jabatan } from "../jabatan/schema";
// import { kontak } from "../kontak/schema";
// import { Pegawai, pegawai } from "../pegawai/schema";
// import { getPegawaiById, getPegawaiByIdJabatan, getPegawaiHeadDepartemen } from "../pegawai/service";
// import { sales_order_detail } from "../sales_order/detail/schema";
// import { sales_order } from "../sales_order/schema";
// import { checkSisaDetail, updateStatusSalesOrder } from "../sales_order/service";
// import { jabatanPersetujuanStrings, persetujuanStrings } from "../schema";
// import { delivery_order_detail, DeliveryOrderDetail, NewDeliveryOrderDetail } from "./detail/schema";
// import { delivery_order_hpp, DeliveryOrderHpp } from "./hpp/schema";
// import { DeliveryOrderPersetujuan } from "./persetujuan/schema";
// import { createDeliveryOrderPersetujuan, getDeliveryOrderPersetujuanByPegawai } from "./persetujuan/service";
// import { delivery_order, DeliveryOrder,  NewDeliveryOrder, UpdateDeliveryOrder } from "./schema";
// import { getDeliveryOrderSettingSettings } from "./setting/service";

// export const nomorDeliveryOrder = async (tanggal: string, tx = db) => {
//     return await moduleNumberGenerator("delivery_order", "nomor", "tanggal", "DO", tanggal, tx);
// };

// export const getDeliveryOrder = async (status: string | ParsedQs | string[] | ParsedQs[] | undefined, tx = db) => {
//     let data = tx
//         .select({
//             ...deliveryOrderColumns,
//             created_name: pegawai.nama,
//             customer: kontak.kontak,
//             gudang: gudang.gudang,
//             no_so: sales_order.nomor,
//             created_jabatan: jabatan.jabatan,
//         })
//         .from(delivery_order)
//         .innerJoin(pegawai, eq(pegawai.id, delivery_order.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(gudang, eq(gudang.id, delivery_order.id_gudang))
//         .innerJoin(sales_order, eq(sales_order.id, delivery_order.id_so))
//         .innerJoin(kontak, eq(kontak.id, delivery_order.id_customer));
        
//     return await data.orderBy(desc(delivery_order.tanggal), desc(delivery_order.nomor));
// };

// export const getOptionDeliveryOrder = async (module = "", tx = db) => {
//     const where: SQL[] = [];

//     switch (module) {
//         case "invoice":
//             return await tx
//                 .select({
//                     id: delivery_order.id,
//                     id_gudang: gudang.id,
//                     id_so: sales_order.id,
//                     nomor: delivery_order.nomor,
//                     tanggal: delivery_order.tanggal,
//                     created_name: pegawai.nama,
//                     id_customer: kontak.id,
//                     customer: kontak.kontak,
//                     referensi: sales_order.referensi,
//                     gudang: gudang.gudang,
//                     no_so: sales_order.nomor,
//                     created_jabatan: jabatan.jabatan,
//                     detail: sql`(SELECT JSON_AGG(ROW_TO_JSON(aaaaa.*)) from (
//                             select delivery_order_detail.*, sales_order_detail.qty as dipesan, sales_order_detail.sisa from delivery_order_detail 
//                             join sales_order_detail on delivery_order.id_so=sales_order_detail.id and delivery_order_detail.nama_barang=sales_order_detail.nama_barang
//                         ) as aaaaa where aaaaa.id=delivery_order.id)`,
//                 })
//                 .from(delivery_order)
//                 .innerJoin(sales_order, eq(sales_order.id, delivery_order.id_so))
//                 .innerJoin(pegawai, eq(pegawai.id, sales_order.id_salesman))
//                 .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//                 .innerJoin(gudang, eq(gudang.id, delivery_order.id_gudang))
//                 .innerJoin(kontak, eq(kontak.id, delivery_order.id_customer))
//                 .where(and(eq(delivery_order.status, "C"), notExists(tx.select().from(invoice_detail).where(eq(delivery_order.id, invoice_detail.id_do)))));

//         case "delivery-receive":
//             break;

//         default:
//             break;
//     }

//     let data = tx
//         .select({
//             id: delivery_order.id,
//             nomor: delivery_order.nomor,
//             tanggal: delivery_order.tanggal,
//             created_name: pegawai.nama,
//             customer: kontak.kontak,
//             gudang: gudang.gudang,
//             id_so: sales_order.id,
//             no_so: sales_order.nomor,
//             created_jabatan: jabatan.jabatan,
//         })
//         .from(delivery_order)
//         .innerJoin(pegawai, eq(pegawai.id, delivery_order.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(gudang, eq(gudang.id, delivery_order.id_gudang))
//         .innerJoin(sales_order, eq(sales_order.id, delivery_order.id_so))
//         .innerJoin(kontak, eq(kontak.id, delivery_order.id_customer));
//     // if (status != undefined) {
//     //     switch (typeof status) {
//     //         case "string":
//     //             data = data.where(eq(delivery_order.status, status));
//     //             break;
//     //         case "object":
//     //             data = data.where(inArray(delivery_order.status, status as string[]));
//     //             break;
//     //         default:
//     //             break;
//     //     }
//     // }
//     return await data.orderBy(desc(delivery_order.tanggal), desc(delivery_order.nomor));
// };

// export const getOptionDeliveryOrderForInvoice = async (tx = db) => {
//     const data = await db.execute(sql`
//         SELECT 
//             'D' as tipe,
//             a.id,
//             a.nomor,
//             a.tanggal,
//             b.nama AS created_name,
//             f.kontak AS customer,
//             d.gudang,
//             e.id AS id_so,
//             e.nomor AS no_so,
//             c.name AS created_jabatan,
//             (SELECT JSON_AGG(ROW_TO_JSON(aa.*))
//             FROM delivery_order_detail aa 
//             WHERE aa.id = a.id) as detail
//         FROM 
//             delivery_order a
//             LEFT JOIN hr.pegawai b ON b.id = a.created_by
//             LEFT JOIN hr.jabatan c ON c.id = b.id_jabatan
//             LEFT JOIN gudang d ON d.id = a.id_gudang
//             LEFT JOIN sales_order e ON e.id = a.id_so
//             LEFT JOIN kontak f ON f.id = a.id_customer
//         WHERE 
//             a.status = 'C' AND 
//             a.id NOT IN (
//                 SELECT aa.id_delivery_order 
//                 FROM invoice_delivery_order aa 
//                 WHERE aa.id_delivery_order = a.id
//             ) AND (SELECT (aaa.qty-aaa.qty_diterima) FROM delivery_order_detail aaa 
//                 WHERE aaa.id = a.id ) > 1;
//     `);

//     return data;
// };

// export const getDeliveryOrderById = async (id: DeliveryOrder["id"], tx = db) => {
//     const salesman = alias(pegawai, "pegawai");
//     const [data] = await tx
//         .select({
//             ...deliveryOrderColumns,
//             created_name: pegawai.nama,
//             customer: kontak.kontak,
//             gudang: gudang.gudang,
//             nomor_so: sales_order.nomor,
//             created_jabatan: jabatan.jabatan,
//             salesman: salesman.nama,
//             referensi: sales_order.referensi,
//             date_so: sales_order.tanggal,
//         })
//         .from(delivery_order)
//         .innerJoin(pegawai, eq(pegawai.id, delivery_order.created_by))
//         .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
//         .innerJoin(gudang, eq(gudang.id, delivery_order.id_gudang))
//         .innerJoin(sales_order, eq(sales_order.id, delivery_order.id_so))
//         .innerJoin(kontak, eq(kontak.id, delivery_order.id_customer))
//         .where(eq(delivery_order.id, id));
//     return data;
// };

// export const createDeliveryOrder = async (form: NewDeliveryOrder, tx = db) => {
//     const [data] = await tx.insert(delivery_order).values(form).returning();
//     return data;
// };

// export const updateDeliveryOrder = async (id: DeliveryOrder["id"], form: UpdateDeliveryOrder, tx = db) => {
//     try {
//         const [data] = await tx
//             .update(delivery_order)
//             .set({
//                 ...form,
//                 updated_at: sql`NOW()`,
//             })
//             .where(eq(delivery_order.id, id))
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
// export const createDeliveryOrderPersetujuanBySetting = async (id: DeliveryOrder["id"], id_pegawai: Pegawai["id"], tx = db) => {
//     const lPersetujuan: DeliveryOrderPersetujuan[] = [];
//     const settingPersetujuan = await getDeliveryOrderSettingSettings(tx);
//     for (let index = 0; index < persetujuanStrings.length; index++) {
//         const persetujuan = persetujuanStrings[index];
//         const jabatan = jabatanPersetujuanStrings[index];
//         if (settingPersetujuan[persetujuan]) {
//             let dataPersetujuan;
//             // ulang setiap level persetujuan
//             switch (settingPersetujuan[persetujuan]) {
//                 case "1": // atasan langsung
//                     const pegawai1 = await getPegawaiById(id_pegawai, tx);
//                     if (pegawai1.atasan_langsung && pegawai1.atasan_langsung == id_pegawai) {
//                         break;
//                     }
//                     // Persetujuan 1
//                     dataPersetujuan = await createDeliveryOrderPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
//                     lPersetujuan.push(dataPersetujuan);
//                     break;

//                 case "2": // head departemen
//                     const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
//                     if (pegawai2) {
//                         const check = await getDeliveryOrderPersetujuanByPegawai(id, pegawai2.id, tx);
//                         if (pegawai2.id == id_pegawai || check) {
//                             break;
//                         }
//                         const persetujuan = await createDeliveryOrderPersetujuan(id, pegawai2.id as number, index + 1, tx);
//                         lPersetujuan.push(persetujuan);
//                     } else {
//                         throw ValidationError("Tidak Ada pegawai pada jabatan yang dipilih");
//                     }
//                     break;

//                 case "3": // jabatan tertentu
//                     const lPegawai = await getPegawaiByIdJabatan(settingPersetujuan[jabatan], tx);
//                     if (lPegawai.length > 1) {
//                         throw ValidationError(`Pegawai Pada Jabatan ${lPegawai[0].jabatan} lebih dari 1`);
//                     }
//                     const [pegawai3] = lPegawai;
//                     if (pegawai3) {
//                         const check = await getDeliveryOrderPersetujuanByPegawai(id, pegawai3.id, tx);
//                         if (pegawai3.id == id_pegawai || check) {
//                             break;
//                         }
//                         const persetujuan = await createDeliveryOrderPersetujuan(id, pegawai3.id as number, index + 1, tx);
//                         lPersetujuan.push(persetujuan);
//                     } else {
//                         throw ValidationError("Tidak Ada pegawai pada jabatan yang dipilih");
//                     }
//                     break;

//                 default:
//                     break;
//             }
//             continue;
//         }
//         // jika persetujuan false hentikan loop level
//         break;
//     }
//     return lPersetujuan;
// };

// export const updateStatusDoSend = async (form: DeliveryOrder, formDetail: DeliveryOrderDetail[], tx = db) => {
//     const id_gudang = form.id_gudang;
//     for (let j = 0; j < formDetail.length; j++) {
//         const d = formDetail[j];
//         const dataBarang: Barang = await getBarangById(d.id_barang as number, tx);
//         // TODO: check if barang is stok gk tau jasa itu gmn
//         if (dataBarang?.is_stok) {
//             //ambil stok barang dari gudang sesuai id barang
//             const availability_stok = await getQtyAvailability(parseFloat(d.qty as string), d.id_barang as number, d.id_satuan, id_gudang, tx);

//             //cek stok apakah mencukupi untuk di pakai
//             if (availability_stok.is_available_qty) {
//                 await tx
//                     .update(sales_order_detail)
//                     .set({
//                         diambil: d.qty as string,
//                         sisa: sql`sisa - ${d.qty}`,
//                     })
//                     .where(and(eq(sales_order_detail.id, form.id_so), eq(sales_order_detail.id_barang, d.id_barang as number)));

//                 const validate = updateStokBarangSchema.parse({
//                     id_gudang: form.id_gudang,
//                     id_barang: d.id_barang,
//                     tanggal: formatDate(form.tanggal),
//                     stok: d.qty,
//                     stok_awal: d.qty,
//                     updated_by: form.updated_by,
//                 });
//                 const lHpp = await kurangStokBarang([validate], "FIFO", tx);
//                 for (const hpp of lHpp as any[]) {
//                     await tx.insert(delivery_order_hpp).values({ id: form.id, id_stok_barang: hpp.id_stok, qty: hpp.qty });
//                 }
//             } else {
//                 throw ValidationError(`Stok ${dataBarang.nama_barang} Tersisa ${availability_stok.sisa_stok || 0} ${availability_stok.satuan}`);
//             }
//         }
//     }
//     //tambah ke dalam stok value
//     // jika yang di ubah adalah tahun sebelumnya maka update saldo awal tahun ini
//     const sisa = await checkSisaDetail(form.id_so, tx);
//     if (sisa > 0) {
//         await updateStatusSalesOrder(form.id_so, "P", tx);
//     } else {
//         await updateStatusSalesOrder(form.id_so, "C", tx);
//     }
// };

// export const deleteDeliveryOrder = async (id: DeliveryOrder["id"], tx = db) => {
//     try {
//         await tx.transaction(async (tx) => {
//             await tx.delete(delivery_order_detail).where(eq(delivery_order_detail.id, id));
//             await tx.delete(delivery_order).where(eq(delivery_order.id, id));
//         });
//     } catch (error) {
//         console.error(error);
//         throw NotFoundError("Gagal Delete Delivery Order");
//     }
// };

// export const checkIfDeliveryOrderPosting = async (id: DeliveryOrder["id"], tx = db) => {
//     try {
//         const [data] = await tx.execute(sql`SELECT 
// 		CASE
//             WHEN status = 'P' 
// 				THEN TRUE
//             	ELSE FALSE
// 		END AS is_closed
// 			FROM delivery_order
// 			WHERE id=${id}`);
//         return data;
//     } catch (error) {
//         throw NotFoundError("error");
//     }
// };

// export const checkIfDeliveryOrderClosing = async (id: DeliveryOrder["id"], tx = db) => {
//     try {
//         const [data] = await tx.execute(sql`SELECT 
// 		CASE
//             WHEN status = 'C' 
// 				THEN TRUE
//             	ELSE FALSE
// 		END AS is_closed
// 			FROM delivery_order
// 			WHERE id=${id}`);
//         return data;
//     } catch (error) {
//         throw NotFoundError("error");
//     }
// };

// export const updateDeliveryOrderReceipt = async (id: DeliveryOrder["id"], form: { delivery_order: NewDeliveryOrder; lDetail: NewDeliveryOrderDetail[] }) => {
//     try {
//         const returning: any = await db.transaction(async (tx) => {
//             const [data] = await tx.execute(sql`
//                 UPDATE delivery_order
//                 SET
//                   status = ${form.delivery_order.status},
//                   keterangan = ${form.delivery_order.keterangan},
//                   shipping_costs = ${form.delivery_order.shipping_costs},
//                   received_date = ${form.delivery_order.received_date},
//                   received_name = ${form.delivery_order.received_name},
//                   return_date = ${form.delivery_order.return_date},
//                   arrived_date = ${form.delivery_order.arrived_date},
//                   received_date_posting = ${form.delivery_order.received_date_posting},
//                   received_posting = ${form.delivery_order.received_posting},
//                   status = ${form.delivery_order.status},
//                 WHERE id = ${id} RETURNING *`);

//             await tx
//                 .delete(delivery_order_detail)
//                 .where(eq(delivery_order_detail.id, id))
//                 .then(async () => {
//                     const data_detail = await tx.insert(delivery_order_detail).values(form.lDetail).returning();
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

// export const getHppById = async (id: DeliveryOrderHpp["id"], tx = db) => {
//     try {
//         const [data] = await tx.execute(sql`select sum(a.qty*hpp) as total_hpp  from delivery_order_hpp a
// 				inner join stok_barang b on b.id=a.id_stok_barang
// 				where a.id=${id}`);

//         return data;
//     } catch (error) {
//         throw NotFoundError("error");
//     }
// };

// // Delivery Order Detail
