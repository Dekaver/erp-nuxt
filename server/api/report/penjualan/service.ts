// import { and, asc, between, eq, gt, sql } from "drizzle-orm";

// import { formatFilterDate } from "../../../libs/formater";

// export const getDataReportPenjualan = async (awal?: string, akhir?: string, id_customer?: string, status?: string, tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const tglAwal = formatFilterDate(awal as string);
//         const tglAkhir = formatFilterDate(akhir as string);
//         const idCustomer = id_customer as string;

//         let query = `SELECT 
//         b.kontak as customer,
//         a.invoice_date , 
//         a.invoice, 
//         a.id_customer, 
//         a.amount, 
//         a.pay, 
//         a.amount - a.pay AS sisa_tagihan, 
//         (SELECT keterangan FROM invoice where invoice.nomor=a.invoice) AS keterangan, 
//         CASE 
//             WHEN (a.amount - a.discount - a.pay) < 1 THEN 'LUNAS'
//             WHEN a.pay = 0 THEN 'Belum Bayar'
//             ELSE 'Partial'
//         END AS status 
//     FROM 
//         acc_ar_faktur a
//         LEFT JOIN kontak b ON a.id_customer=b.id
//         WHERE true
//                         `;

//         if (tglAwal != "") {
//             query += ` AND a.invoice_date >= '${tglAwal}' `;
//         }
//         if (tglAkhir != "") {
//             query += ` AND a.invoice_date <= '${tglAkhir}' `;
//         }

//         if (tglAkhir != "") {
//             query += ` AND a.invoice_date <= '${tglAkhir}' `;
//         }

//         if (idCustomer != undefined && idCustomer != "") {
//             query += ` AND a.id_customer = ${idCustomer} `;
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

//         query += ` ORDER BY a.invoice_date DESC `;
//         const data = await trx.execute(sql.raw(query));

//         return data;
//     });
// };

// export const getDataReportPenjualanProduk = async (awal?: string, akhir?: string, id_kategori?: string, tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const tglAwal = formatFilterDate(awal as string);
//         const tglAkhir = formatFilterDate(akhir as string);
//         const idKategori = id_kategori as string;

//         let query = `select b.kode_barang, b.nama_barang, SUM(a.qty) as qty, c.satuan, SUM(a.total) as total, SUM(a.total)/SUM(a.qty) as rata_rata, e.kategori_barang
//         FROM invoice_detail a 
//         INNER JOIN barang b ON a.id_barang=b.id
//         LEFT JOIN satuan c ON b.id_satuan=c.id
//         LEFT JOIN invoice d ON d.id=a.id
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

// export const getDataReportPenjualanCustomer = async (awal?: string, akhir?: string, id_customer?: string, tx = db) => {
//     const tglAwal = formatFilterDate(awal as string);
//     const tglAkhir = formatFilterDate(akhir as string);
//     const idCustomer = id_customer as string;
//     // const id_customer = null;
//     return await tx.transaction(async (trx) => {
//         let query = `SELECT b.kontak as customer, b.id as id_customer FROM invoice a
//         LEFT JOIN kontak b ON b.id=a.id_kontak WHERE true `;

//         if (tglAwal != "") {
//             query += ` AND a.tanggal >= '${tglAwal}' `;
//         }

//         if (tglAkhir != "") {
//             query += ` AND a.tanggal <= '${tglAkhir}' `;
//         }

//         if (idCustomer != undefined && idCustomer != "") {
//             query += `AND b.id = ${idCustomer}`;
//         }
//         query += `GROUP BY b.kontak, b.id`;

//         const data = await trx.execute(sql.raw(query));
//         let grandtotal = 0;
//         const results = await Promise.all(
//             data.map(async (item) => {
//                 const detail = await trx.execute(
//                     sql.raw(`SELECT b.tanggal, b.id_kontak, c.kode_barang, a.nama_barang, 
//                     a.qty, d.satuan, a.total as jumlah_tagihan, a.total * a.qty as total, 
//                     a.diskonrp+(a.diskonrp*(b.diskonpersen/100)) as diskon, a.persen_pajak, e.kontak,b.diskonpersen
//                     FROM invoice_detail a 
//                     INNER JOIN invoice b ON a.id=b.id
//                     LEFT JOIN barang c ON c.id=a.id_barang
//                     LEFT JOIN satuan d ON c.id_satuan=d.id
//                     LEFT JOIN kontak e ON e.id=b.id_kontak
//                     WHERE b.id_kontak=${item.id_customer}
//                     ORDER BY b.tanggal DESC`),
//                 );

//                 let urutan = 0;
//                 const children = [];
//                 let totalTagihan = 0;
//                 for (let index = 0; index < detail.length; index++) {
//                     const element = detail[index];
//                     totalTagihan = totalTagihan + parseFloat(element.jumlah_tagihan as string);
//                     let dataObject = {
//                         key: `${item.id_customer}-${urutan}`,
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
//                             key: `${item.id_customer}-${urutan}`,
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
//                             key: `${item.id_customer}-${urutan}`,
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
//                         key: `${item.id_customer}-total`,
//                         data: {
//                             style: "font-bold",
//                             satuan: "Total",
//                             total: amount,
//                         },
//                     } as any);
//                     grandtotal = grandtotal + amount;
//                 }

//                 return {
//                     key: item.id_customer,
//                     data: {
//                         style: "font-bold",
//                         invoice: item.kode_customer,
//                         date: item.customer,
//                         id_kontak: item.id_customer,
//                         tanggal: item.tanggal,
//                     },
//                     children,
//                 };
//             }),
//         );

//         return { data: results, total: grandtotal };
//     });
// };
