// import { and, asc, between, eq, gt, sql } from "drizzle-orm";

// import { formatFilterDate } from "../../../libs/formater";

// export const getDataReportPembelian = async (awal?: string, akhir?: string, id_supplier?: string, status?: string, tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const tglAwal = formatFilterDate(awal as string);
//         const tglAkhir = formatFilterDate(akhir as string);
//         const idSupplier = id_supplier as string;

//         let query = `SELECT 
//                         b.kontak as supplier,
//                         a.date, 
//                         a.ap_number, 
//                         a.id_supplier, 
//                         a.invoice_number, 
//                         a.amount, 
//                         a.pay, 
//                         a.amount - a.pay AS sisa_tagihan, 
//                         (SELECT keterangan FROM ap where ap.nomor=a.ap_number) AS keterangan, 
//                         CASE 
//                             WHEN (a.amount - a.discount - a.pay) < 1 THEN 'LUNAS'
//                             WHEN a.pay = 0 THEN 'Belum Bayar'
//                             ELSE 'Partial'
//                         END AS status 
//                     FROM 
//                         acc_ap_faktur a
//                         LEFT JOIN kontak b ON a.id_supplier=b.id
//                         WHERE true
//                         `;

//         if (tglAwal != "") {
//             query += ` AND a.date >= '${tglAwal}' `;
//         }
//         if (tglAkhir != "") {
//             query += ` AND a.date <= '${tglAkhir}' `;
//         }

//         if (tglAkhir != "") {
//             query += ` AND a.date <= '${tglAkhir}' `;
//         }

//         if (status != "" && status != undefined) {
//             switch (status) {
//                 case "Lunas":
//                     query += ` AND (a.amount - a.discount - a.pay) < 1 `;
//                     break;
//                 case "Belum Bayar":
//                     query += ` AND a.pay = 0 `;
//                     break;
//                 default:
//                     query += ` AND ((a.amount - a.discount - a.pay) > 1) AND a.pay > 0 `;
//                     break;
//             }
//         }

//         if (idSupplier != undefined && idSupplier != "") {
//             query += ` AND a.id_supplier = ${idSupplier} `;
//         }

//         query += ` ORDER BY a.date DESC `;
//         const data = await trx.execute(sql.raw(query));

//         return data;
//     });
// };

// export const getDataReportHutangSupplier = async (awal?: string, akhir?: string, id_supplier?: string, tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const tglAwal = formatFilterDate(awal as string);
//         const tglAkhir = formatFilterDate(akhir as string);
//         const idSupplier = id_supplier as string;

//         let query = `SELECT 
//         b.kontak as supplier,
//         a.date, 
//         a.ap_number, 
//         a.id_supplier, 
//         a.invoice_number, 
//         a.amount, 
//         a.pay, 
//         a.amount - a.pay AS sisa_tagihan, 
//         (SELECT keterangan FROM ap where ap.nomor=a.ap_number) AS keterangan, 
//         CASE 
//             WHEN a.amount - a.pay < 1 THEN 'LUNAS'
//             WHEN a.pay = 0 THEN 'Belum Bayar'
//             ELSE 'Partial'
//         END AS status 
//     FROM 
//         acc_ap_faktur a
//         INNER JOIN kontak b ON a.id_supplier=b.id WHERE b.is_supplier is true AND (a.amount - a.discount - a.pay) > 0
//         `;
//         if (tglAwal != "") {
//             query += ` AND a.date >= '${tglAwal}' `;
//         }
//         if (tglAkhir != "") {
//             query += ` AND a.date <= '${tglAkhir}' `;
//         }

//         if (idSupplier != undefined && idSupplier != "") {
//             query += ` AND a.id_supplier = ${idSupplier} `;
//         }

//         query += `ORDER BY a.date DESC`;

//         const data = await trx.execute(sql.raw(query));

//         return data;
//     });
// };

// export const getDataReportPenerimaanBarang = async (awal?: string, akhir?: string, id_gudang?: string, id_supplier?: string, tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const tglAwal = formatFilterDate(awal as string);
//         const tglAkhir = formatFilterDate(akhir as string);
//         const idGudang = id_gudang as string;
//         const idSupplier = id_supplier as string;
//         // const date = new Date(tanggal_awal);
//         // const month = date.getMonth() + 1; // Get the month (1-12)
//         // const year = date.getFullYear(); // Get the year
//         let query = ` select b.kode_barang, d.id_supplier, d.id_gudang, b.nama_barang, a.diambil as qty, c.satuan, d.tanggal, f.kontak as supplier, 
//         d.referensi as nomor_dn, a.id
//         FROM penerimaan_barang_detail a 
//         INNER JOIN barang b ON a.id_barang=b.id
//         INNER JOIN satuan c ON b.id_satuan=c.id
//         INNER JOIN penerimaan_barang d ON d.id=a.id
//         INNER JOIN kontak f ON d.id_supplier=f.id `;

//         if (tglAwal != "") {
//             query += ` AND d.tanggal >= '${tglAwal}' `;
//         }
//         if (tglAkhir != "") {
//             query += ` AND d.tanggal <= '${tglAkhir}' `;
//         }
//         if (idGudang != undefined && idGudang != "") {
//             query += ` AND d.id_gudang = ${idGudang} `;
//         }
//         if (idSupplier != undefined && idSupplier != "") {
//             query += ` AND d.id_supplier = ${idSupplier} `;
//         }

//         query += ` ORDER BY d.tanggal DESC,a.id `;
//         const data = await trx.execute(sql.raw(query));

//         return data;
//     });
// };

// export const getDataReportPembelianProduk = async (awal?: string, akhir?: string, id_kategori?: string, tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const tglAwal = formatFilterDate(awal as string);
//         const tglAkhir = formatFilterDate(akhir as string);
//         const idKategori = id_kategori as string;

//         let query = `select b.kode_barang, b.nama_barang, SUM(a.qty) as qty, c.satuan, SUM(a.total) as total, SUM(a.total)/SUM(a.qty) as rata_rata, e.kategori_barang
//         FROM ap_detail a 
//         INNER JOIN barang b ON a.id_barang=b.id
//         LEFT JOIN satuan c ON b.id_satuan=c.id
//         LEFT JOIN ap d ON d.id=a.id
// 		LEFT JOIN kategori_barang e ON e.id=b.id_kategori
//         WHERE true `;
//         if (tglAwal != "") {
//             query += ` AND d.tanggal >= '${tglAwal}' `;
//         }
//         if (tglAkhir != "") {
//             query += ` AND d.tanggal <= '${tglAkhir}' `;
//         }
//         if (idKategori != "") {
//             query += ` AND e.id = ${id_kategori} `;
//         }
//         query += ` GROUP BY b.kode_barang,b.nama_barang,c.satuan,e.kategori_barang `;
//         const data = await trx.execute(sql.raw(query));

//         return data;
//     });
// };

// export const getDataReportPembelianSupplier = async (awal?: string, akhir?: string, id_supplier?: string, tx = db) => {
//     const tglAwal = formatFilterDate(awal as string);
//     const tglAkhir = formatFilterDate(akhir as string);
//     const idSupplier = id_supplier as string;
//     // const id_supplier = null;
//     return await tx.transaction(async (trx) => {
//         let query = `SELECT b.kontak as supplier, b.id as id_supplier FROM ap a
//         LEFT JOIN kontak b ON b.id=a.id_supplier WHERE true `;

//         if (tglAwal != "") {
//             query += ` AND a.tanggal >= '${tglAwal}' `;
//         }

//         if (tglAkhir != "") {
//             query += ` AND a.tanggal <= '${tglAkhir}' `;
//         }

//         if (idSupplier != undefined && idSupplier != "") {
//             query += `AND b.id = ${idSupplier}`;
//         }
//         query += `GROUP BY b.kontak, b.id`;

//         const data = await trx.execute(sql.raw(query));
//         let grandtotal = 0;
//         const results = await Promise.all(
//             data.map(async (item) => {
//                 const detail = await trx.execute(
//                     sql.raw(`SELECT b.tanggal, b.id_supplier, c.kode_barang, a.nama_barang, 
//                 a.qty, d.satuan, a.total*a.qty as jumlah_tagihan, 
//                 a.diskonrp+(a.diskonrp*(b.persendiskon/100)) as diskon, a.persen_pajak, e.kontak,b.persendiskon
//                 FROM ap_detail a 
//                 INNER JOIN ap b ON a.id=b.id
//                 LEFT JOIN barang c ON c.id=a.id_barang
//                 LEFT JOIN satuan d ON c.id_satuan=d.id
//                 LEFT JOIN kontak e ON e.id=b.id_supplier
//                 WHERE b.id_supplier=${item.id_supplier}
//                 ORDER BY b.tanggal DESC`),
//                 );

//                 let urutan = 0;
//                 const children = [];
//                 let totalTagihan = 0;
//                 for (let index = 0; index < detail.length; index++) {
//                     const element = detail[index];
//                     totalTagihan = totalTagihan + parseFloat(element.jumlah_tagihan as string);
//                     let dataObject = {
//                         key: `${item.id_supplier}-${urutan}`,
//                         data: {
//                             ...element,
//                             total: totalTagihan,
//                             style: "font-normal",
//                         },
//                     };
//                     urutan = +1;
//                     children.push(dataObject);

//                     // item.persendiskon != null && item != 0;
//                     if (parseFloat(element.diskon as string) > 0) {
//                         totalTagihan = totalTagihan - parseFloat(element.diskon as string);
//                         let dataObject = {
//                             key: `${item.id_supplier}-${urutan}`,
//                             data: {
//                                 tanggal: element.tanggal,
//                                 nama_barang: "Diskon",
//                                 jumlah_tagihan: -parseFloat(element.diskon as string),
//                                 total: totalTagihan,
//                                 style: "font-normal",
//                             },
//                         };
//                         urutan = +1;
//                         children.push(dataObject);
//                     }

//                     if (element.persen_pajak != null && element.persen_pajak != "") {
//                         let pajak = (element.persen_pajak as string).split(" ");
//                         let totalPajak = 0;
//                         for (let index = 0; index < pajak.length; index++) {
//                             const dataPajak = pajak[index];
//                             totalPajak = totalPajak + (element.jumlah_tagihan as number) * (parseFloat(dataPajak) / 100);
//                         }

//                         totalTagihan = totalTagihan + (totalPajak as number);
//                         let dataObject = {
//                             key: `${item.id_supplier}-${urutan}`,
//                             data: {
//                                 tanggal: element.tanggal,
//                                 nama_barang: "Pajak",
//                                 jumlah_tagihan: totalPajak,
//                                 total: totalTagihan,
//                                 style: "font-normal",
//                             },
//                         };
//                         urutan = +1;
//                         children.push(dataObject);
//                     }
//                 }

//                 // Calculate the total for the last child node
//                 if (children.length > 0) {
//                     const amount = children.reduce((sum, child) => {
//                         return (child.data.total as number) || 0;
//                     }, 0);
//                     children.push({
//                         key: `${item.id_supplier}-total`,
//                         data: {
//                             style: "font-bold",
//                             satuan: "Total",
//                             total: amount,
//                         },
//                     } as any);
//                     grandtotal = grandtotal + amount;
//                 }

//                 return {
//                     key: item.id_supplier,
//                     data: {
//                         style: "font-bold",
//                         ap_number: item.kode_supplier,
//                         date: item.supplier,
//                         id_supplier: item.id_supplier,
//                         tanggal: item.tanggal,
//                     },
//                     children,
//                 };
//             }),
//         );

//         return { data: results, total: grandtotal };
//     });
// };
