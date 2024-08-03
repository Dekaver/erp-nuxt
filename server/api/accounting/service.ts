// import { and, asc, between, eq, gt, sql } from "drizzle-orm";

// import { account, accountColumns } from "../account/schema";
// import { accGLDetailColumns, acc_gl_detail } from "./acc_gl_trans/acc_gl_detail/schema";
// import { AccGlTrans, acc_gl_trans } from "./acc_gl_trans/schema";
// import { NewAccValue, insertAccValueSchema, acc_value, AccValue } from "./schema";

// export const updateAccValue = async (date: AccGlTrans["gl_date"], tx = db) => {
//     return await tx.transaction(async (trx2) => {
//         const dataTransaksiKas = (await trx2.execute(
//             sql.raw(`SELECT
//                         id_account,
//                         EXTRACT(MONTH FROM gl_date) AS month,
//                         EXTRACT(YEAR FROM gl_date) AS year,
//                         COALESCE(SUM(kas_keluar), 0) AS total_keluar,
//                         COALESCE(SUM(kas_masuk), 0) AS total_masuk
//                     FROM
//                         (
//                             SELECT
//                                 id_account,
//                                 gl_date,
//                                 CASE
//                                     WHEN is_debit = true THEN SUM(amount)
//                                 END AS kas_masuk,
//                                 CASE
//                                     WHEN is_debit = false THEN SUM(amount)
//                                 END AS kas_keluar
//                             from
//                                 acc_gl_trans
//                                 left join acc_gl_detail on acc_gl_detail.gl_number = acc_gl_trans.gl_number
//                             WHERE
//                                 gl_date >= DATE_TRUNC('month', '${date}'::date) AND
//                                 gl_date < DATE_TRUNC('month','${date}'::date) + INTERVAL '1 month'
//                                 AND id_account is not null
//                             GROUP BY
//                                 id_account,
//                                 is_debit,
//                                 gl_date
//                         ) subquery
//                     GROUP BY
//                         id_account,
//                         gl_date
//                         `),
//         )) as {
//             id_account: number;
//             month: number;
//             year: number;
//             total_keluar: number;
//             total_masuk: number;
//         }[];

//         // const formAccValue = dataTransaksiKas.map((item) => {
//         //     return {
//         //         id_account: item.id_account,
//         //         years: item.year.toString(),
//         //         [`db${item.month}`]: item.total_masuk.toString(),
//         //         [`cr${item.month}`]: item.total_keluar.toString(),
//         //     };
//         // }) as NewAccValue[];

//         const formAccValue = dataTransaksiKas.reduce((acc : any [], item :any) => {
//             const existingEntry = acc.find(entry => entry.id_account === item.id_account && entry.years === item.year.toString());
//             if (existingEntry) {
//                 // Jika entri sudah ada, tambahkan ke properti yang sudah ada
//                 existingEntry[`db${item.month}`] = (parseInt(existingEntry[`db${item.month}`]) + parseInt(item.total_masuk)).toString();
//                 existingEntry[`cr${item.month}`] = (parseInt(existingEntry[`cr${item.month}`]) + parseInt(item.total_keluar)).toString();
//             } else {
//                 // Jika entri belum ada, buat entri baru
//                 const newEntry = {
//                     id_account: item.id_account,
//                     years: item.year.toString(),
//                     [`db${item.month}`]: item.total_masuk.toString(),
//                     [`cr${item.month}`]: item.total_keluar.toString(),
//                 };
//                 acc.push(newEntry);
//             }
        
//             return acc;
//         }, []);

//         const validateAccValue = formAccValue.map((item) => insertAccValueSchema.parse(item));

//         for (const item of validateAccValue) {
//             const [updatedAccValue] = await trx2
//                 .insert(acc_value)
//                 .values(item)
//                 .onConflictDoUpdate({
//                     target: [acc_value.id_account, acc_value.years],
//                     set: {
//                         ...item,
//                     },
//                     where: and(eq(acc_value.id_account, item.id_account), eq(acc_value.years, item.years)),
//                 })
//                 .returning();
//             await trx2.transaction(async (trx3) => {
//                 await trx3
//                     .update(acc_value)
//                     .set({
//                         db13: ToString(
//                             parseFloat(updatedAccValue.db0) +
//                                 parseFloat(updatedAccValue.db1) +
//                                 parseFloat(updatedAccValue.db2) +
//                                 parseFloat(updatedAccValue.db3) +
//                                 parseFloat(updatedAccValue.db4) +
//                                 parseFloat(updatedAccValue.db5) +
//                                 parseFloat(updatedAccValue.db6) +
//                                 parseFloat(updatedAccValue.db7) +
//                                 parseFloat(updatedAccValue.db8) +
//                                 parseFloat(updatedAccValue.db9) +
//                                 parseFloat(updatedAccValue.db10) +
//                                 parseFloat(updatedAccValue.db11) +
//                                 parseFloat(updatedAccValue.db12),
//                         ) as string,
//                         cr13: (
//                             parseFloat(updatedAccValue.cr0) +
//                             parseFloat(updatedAccValue.cr1) +
//                             parseFloat(updatedAccValue.cr2) +
//                             parseFloat(updatedAccValue.cr3) +
//                             parseFloat(updatedAccValue.cr4) +
//                             parseFloat(updatedAccValue.cr5) +
//                             parseFloat(updatedAccValue.cr6) +
//                             parseFloat(updatedAccValue.cr7) +
//                             parseFloat(updatedAccValue.cr8) +
//                             parseFloat(updatedAccValue.cr9) +
//                             parseFloat(updatedAccValue.cr10) +
//                             parseFloat(updatedAccValue.cr11) +
//                             parseFloat(updatedAccValue.cr12)
//                         ).toString(),
//                     })
//                     .where(and(eq(acc_value.id_account, item.id_account), eq(acc_value.years, item.years)));
//             });
//         }
//     });
// };

// export const updateAccAkhir = async (years: AccValue["years"], id_account: AccValue["id_account"], tx = db) => {
//     const [data] = await tx
//         .update(acc_value)
//         .set({
//             db13: sql`db0+db1+db2+db3+db4+db5+db6+db7+db8+db9+db10+db11+db12`,
//             cr13: sql`cr0+cr1+cr2+cr3+cr4+cr5+cr6+cr7+cr8+cr9+cr10+cr11+cr12`,
//         })
//         .where(and(eq(acc_value.id_account, id_account), eq(acc_value.years, years)))
//         .returning();
//     return data;
// };

// export const getJurnal = async (awal?: string, akhir?: string, tx = db) => {
//     let query = tx
//         .select({
//             ...accGLDetailColumns,
//             akun: account.name,
//             akun_code: account.code,
//             parent: acc_gl_trans,
//             debit: sql<number>`CASE WHEN acc_gl_detail.is_debit = TRUE THEN acc_gl_detail.amount ELSE 0 END`,
//             kredit: sql<number>`CASE WHEN acc_gl_detail.is_debit = FALSE THEN acc_gl_detail.amount ELSE 0 END`,
//         })
//         .from(acc_gl_detail)
//         .leftJoin(acc_gl_trans, eq(acc_gl_trans.gl_number, acc_gl_detail.gl_number))
//         .leftJoin(account, eq(account.id, acc_gl_detail.id_account));

//     if (awal && akhir) {
//         query.where(and(between(acc_gl_trans.gl_date, awal, akhir)));
//     }

//     const data = await query.orderBy(asc(acc_gl_detail.gl_number), asc(acc_gl_detail.line));
//     return data;
// };

// export const getJurnalForExport = async (awal?: string, akhir?: string, tx = db) => {
//     let query = tx.execute(
//         sql.raw(`
// 		  SELECT acc_gl_trans.*,
// 		  (
// 			  SELECT JSONB_AGG(
// 				  JSON_BUILD_OBJECT(
// 					  'gl_number', ad.gl_number,
// 					  'line', ad.line,
// 					  'id_account', ad.id_account,
// 					  'amount', ad.amount,
// 					  'is_debit', ad.is_debit,
// 					  'description', ad.description,
// 					  'akun', a.name,
// 					  'akun_code', a.code
// 				  ) ORDER BY line
// 			  )
// 			  FROM acc_gl_detail AS ad
// 			  LEFT JOIN account AS a ON a.id = ad.id_account
// 			  WHERE ad.gl_number = acc_gl_trans.gl_number
			 
// 		  ) AS children
// 		  FROM acc_gl_trans
// 		  ${awal && akhir ? `WHERE gl_date BETWEEN '${awal}' AND '${akhir}'` : ""}
// 	  `),
//     );

//     const data = await query;
//     return data;
// };

// export const getLabaRugi = async (awal: number, akhir: number, tahun: number, code: string, tx = db) => {
//     function generateDiterimaExpression(awal: number, akhir: number) {
//         // Initialize the expression with the first month's "db" value
//         let expression = "0";
//         // Add the "db" values for the previous months
//         for (let i = awal; i <= akhir; i++) {
//             expression += ` + acc_value.db${i}`;
//         }
//         // Subtract the "cr" values for the previous months
//         for (let i = awal; i <= akhir; i++) {
//             expression += ` - acc_value.cr${i}`;
//         }
//         return expression;
//     }

//     const data = await tx
//         .select({
//             ...accountColumns,
//             debit: sql.raw(`${generateDiterimaExpression(awal, akhir)}`).as<number>(),
//         })
//         .from(account)
//         .leftJoin(acc_value, and(eq(acc_value.id_account, account.id), eq(acc_value.years, tahun.toString())))
//         .where(and(eq(sql`SUBSTR(account.code, 0,${code.length + 1})`, code), gt(account.level, 2)))
//         .orderBy(account.code);
//     return data;
// };

// export const getNeraca = async (awal: number, akhir: number, tahun: number, code: string, tx = db) => {
//     function generateDiterimaExpression(awal: number, akhir: number) {
//         // Initialize the expression with the first month's "db" value
//         let expression = "0";
//         // Add the "db" values for the previous months
//         for (let i = awal; i <= akhir; i++) {
//             expression += ` + acc_value.db${i}`;
//         }
//         // Subtract the "cr" values for the previous months
//         for (let i = awal; i <= akhir; i++) {
//             expression += ` - acc_value.cr${i}`;
//         }
//         return expression;
//     }

//     const data = await tx
//         .select({
//             ...accountColumns,
//             debit: sql.raw(`${generateDiterimaExpression(awal, akhir)}`).as<number>(),
//         })
//         .from(account)
//         .leftJoin(acc_value, and(eq(acc_value.id_account, account.id), eq(acc_value.years, tahun.toString())))
//         .where(and(eq(sql`SUBSTR(account.code, 0,${code.length + 1})`, code), gt(account.level, 2)))
//         .orderBy(account.code);
//     return data;
// };

// export const getNetProfitLabaRugi = async (awal: string, akhir: string, tahun: string) => {
//     const dataPendapatan = await getLabaRugi(parseInt(awal as string), parseInt(akhir as string), parseInt(tahun as string), "4");
//     const totalPendapatan = dataPendapatan.filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3).reduce((a, b) => a + (b.debit || 0) * -1, 0) || 0;

//     const dataHpp = await getLabaRugi(parseInt(awal as string), parseInt(akhir as string), parseInt(tahun as string), "5");
//     const totalHPP = dataHpp.filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3).reduce((a, b) => a + b.debit * 1, 0);

//     const dataBiayaOperasional = await getLabaRugi(parseInt(awal as string), parseInt(akhir as string), parseInt(tahun as string), "6");
//     const totalBiayaOperasional = dataBiayaOperasional.filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3).reduce((a, b) => a + b.debit * 1, 0);

//     const dataPendapatanLainLain = await getLabaRugi(parseInt(awal as string), parseInt(akhir as string), parseInt(tahun as string), "8");
//     const totalPendapatanLainLain = dataPendapatanLainLain.filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3).reduce((a, b) => a + b.debit * 1, 0);

//     const dataBiayaLainLain = await getLabaRugi(parseInt(awal as string), parseInt(akhir as string), parseInt(tahun as string), "9");
//     const totalBiayaLainLain = dataBiayaLainLain.filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3).reduce((a, b) => a + b.debit * -1, 0);

//     return  [
//         ...dataPendapatan
//             .filter((account) => (account.level == 4 && account.debit != null) || account.level == 3)
//             .map((account) => {
//                 return {
//                     type: account.level == 3 ? "H" : "D",
//                     name: account.name,
//                     debit: account.debit * -1 || null,
//                 };
//             }),
//         {
//             type: "F",
//             name: "TOTAL PENDAPATAN",
//             debit: totalPendapatan,
//         },
//         ...dataHpp
//             .filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3)
//             .map((account) => {
//                 return {
//                     type: account.level == 3 ? "H" : "D",
//                     name: account.name,
//                     debit: account.debit * 1,
//                 };
//             }),
//         {
//             type: "F",
//             name: "TOTAL HARGA POKOK PENJUALAN",
//             debit: totalHPP,
//         },
//         {
//             type: "F",
//             name: "GROSS PROFIT",
//             debit: totalPendapatan - totalHPP,
//         },
//         ...dataBiayaOperasional
//             .filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3)
//             .map((account) => {
//                 return {
//                     type: account.level == 3 ? "H" : "D",
//                     name: account.name,
//                     debit: account.debit * 1,
//                 };
//             }),
//         {
//             type: "F",
//             name: "TOTAL BIAYA OPERASIONAL",
//             debit: totalBiayaOperasional,
//         },
//         {
//             type: "F",
//             name: "OPERATING PROFIT",
//             debit: totalPendapatan - totalHPP - totalBiayaOperasional,
//         },
//         ...dataPendapatanLainLain
//             .filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3)
//             .map((account) => {
//                 return {
//                     type: account.level == 3 ? "H" : "D",
//                     name: account.name,
//                     debit: account.debit * 1,
//                 };
//             }),
//         {
//             type: "F",
//             name: "TOTAL PENDAPATAN LAIN-LAIN",
//             debit: totalPendapatanLainLain,
//         },
//         ...dataBiayaLainLain
//             .filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3)
//             .map((account) => {
//                 return {
//                     type: account.level == 3 ? "H" : "D",
//                     name: account.name,
//                     debit: account.debit * 1,
//                 };
//             }),
//         {
//             type: "F",
//             name: "TOTAL BIAYA LAIN-LAIN",
//             debit: totalBiayaLainLain,
//         },
//         {
//             type: "F",
//             name: "NET PROFIT/LOSS",
//             debit: totalPendapatan - totalHPP - totalBiayaOperasional + totalPendapatanLainLain - totalBiayaLainLain,
//         },
//     ];
// };

// export const getBukuBesar = async (deskripsi: string, akun_awal: string, akun_akhir: string, tanggal_awal: string, tanggal_akhir: string, tx = db) => {
//     return await tx.transaction(async (trx) => {
//         const date = new Date(tanggal_awal);
//         const month = date.getMonth() + 1; // Get the month (1-12)
//         const year = date.getFullYear(); // Get the year

//         // Create column expressions based on the month
//         const debitColumns = [];
//         const creditColumns = [];

//         for (let i = 0; i < month; i++) {
//             debitColumns.push(`db${i}`);
//             creditColumns.push(`cr${i}`);
//         }

//         const debitExpression = debitColumns.join("+");
//         const creditExpression = creditColumns.join("+");

//         // Construct the dynamic column expression
//         let column = `(${debitExpression}) - (${creditExpression})`;
//         console.log(column, "ini cplasd");
//         const saldoAwal = await trx.execute(
//             sql.raw(`
//     -- ini kuery kek nya kepake   
//     WITH combined_data AS (
//       SELECT
//           s.id_account,
//           account.code,
//           s.years,
//           CASE
//               WHEN ${column}::numeric >= 0 THEN ${column}::numeric
//               ELSE 0
//           END AS debit,
//           CASE
//               WHEN ${column}::numeric < 0 THEN -${column}::numeric
//               ELSE 0
//           END AS credit
//       FROM
//           acc_value AS s
//           INNER JOIN account ON account.id = s.id_account
//       WHERE
//           s.years = '${year}'
//           ${!!akun_awal && !!akun_akhir ? `AND account.code BETWEEN '${akun_awal}' AND '${akun_akhir}'` : ""}
//       ${!!deskripsi && deskripsi != null ? `OR account.name ILIKE '%${deskripsi}%'` : ""}
//       GROUP BY
//           s.id_account,
//           account.code,
//           s.years
//       UNION ALL
//       SELECT
//           t.id_account,
//           account.code,
//           '${year}' AS years,
//           COALESCE(SUM(t.debit), 0) AS debit,
//           COALESCE(SUM(t.credit), 0) AS credit
//       FROM
//           (
//               SELECT
//                   account.id AS id_account,
//                   COALESCE(
//                       SUM(
//                           CASE
//                               WHEN is_debit = true THEN amount
//                               ELSE 0
//                           END
//                       ),
//                       0
//                   ) AS debit,
//                   COALESCE(
//                       SUM(
//                           CASE
//                               WHEN is_debit = false THEN amount
//                               ELSE 0
//                           END
//                       ),
//                       0
//                   ) AS credit
//               FROM
//                   acc_gl_detail
//                   LEFT JOIN acc_gl_trans ON acc_gl_trans.gl_number = acc_gl_detail.gl_number
//                   LEFT JOIN account ON account.id = acc_gl_detail.id_account
//               WHERE
//                   acc_gl_trans.gl_date < '${tanggal_awal}'
//                   AND account.code BETWEEN '${akun_awal}'
//                   AND '${akun_akhir}'
//                   ${!!deskripsi && deskripsi != null ? `AND account.name ILIKE '%${deskripsi}%'` : ""}
//               GROUP BY
//                   account.id
//           ) AS t
//           LEFT JOIN acc_value AS av ON av.id_account = t.id_account
//           LEFT JOIN account ON account.id = av.id_account
//       WHERE
//           av.years = '${year}'
//       GROUP BY
//           t.id_account, account.code
//   )
//   SELECT
//       cd.code as reference,
//       cd.id_account,
//       'Saldo Awal' AS memo,
//       years AS tanggal,
//       CASE
//           WHEN total_debit - total_credit >= 0 THEN total_debit - total_credit
//           ELSE 0
//       END AS debit,
//       CASE
//           WHEN total_debit - total_credit < 0 THEN ABS(total_debit - total_credit)
//           ELSE 0
//       END AS credit
//   FROM
//       (
//           SELECT
//               combined_data.id_account,
//               combined_data.code,
//               years,
//               SUM(debit) AS total_debit,
//               SUM(credit) AS total_credit
//           FROM
//               combined_data
//           GROUP BY
//               id_account,
//               code,
//               years
//       ) AS cd
//   `),
//         );

//         const dataDetail = await trx.execute(
//             sql.raw(`
//     select
//     reference,
//     id_account,
//     description as memo,
//     gl_date as date,
//     CASE
//         WHEN acc_gl_detail.is_debit = TRUE THEN acc_gl_detail.amount
//         ELSE 0
//     END as debit,
//     CASE
//         WHEN acc_gl_detail.is_debit = FALSE THEN acc_gl_detail.amount
//         ELSE 0
//     END as credit
//   from
//     acc_gl_detail
//     left join acc_gl_trans on acc_gl_trans.gl_number = acc_gl_detail.gl_number
//     LEFT JOIN account ON account.id = acc_gl_detail.id_account
//   WHERE
//     acc_gl_trans.gl_date BETWEEN '${tanggal_awal}'
//     AND '${tanggal_akhir}'
//         ${!!deskripsi && deskripsi != null ? `AND account.name ILIKE '%${deskripsi}%'` : ""}
//         ORDER BY gl_date, reference `),
//         );

//         const dataAkun = await trx.execute(
//             sql.raw(`
//     select account.id, account.code, account.name from account
//     LEFT join acc_value on account.id = acc_value.id_account AND acc_value.years = '${year}'
//     left join acc_gl_detail on acc_gl_detail.id_account = acc_value.id_account
//     left join acc_gl_trans on acc_gl_trans.gl_number = acc_gl_detail.gl_number
//     WHERE 
//     account.level = 4 AND
//     COALESCE(acc_value.years, '${year}') = '${year}' ${!!akun_awal && !!akun_akhir ? `AND account.code BETWEEN '${akun_awal}' AND '${akun_akhir}'` : ""}
//     ${!!deskripsi && deskripsi != null ? `AND account.name ILIKE '%${deskripsi}%'` : ""}
//     GROUP BY account.id, account.code, account.name 
//     ORDER BY account.code ASC
//       `),
//         );

//         const data = dataAkun.map((item, index) => {
//             let dataSaldoAwal = saldoAwal.find((itemDetail: any) => itemDetail.id_account === item.id);
//             return {
//                 key: `${index}-${item.id}`,
//                 data: {
//                     reference: item.code,
//                     memo: item.name,
//                     debit: null,
//                     credit: null,
//                 },
//                 children: [
//                     {
//                         key: `${index}-${item.id}-saldo-awal`,
//                         data: {
//                             ...saldoAwal.find((itemDetail: any) => itemDetail.id_account === item.id),
//                             memo: "Saldo Awal",
//                             debit: parseFloat(!!dataSaldoAwal ? (dataSaldoAwal.debit as string) : "0"),
//                             credit: parseFloat(!!dataSaldoAwal ? (dataSaldoAwal.credit as string) : "0"),
//                             ending_balance: 0,
//                         },
//                     },
//                     ...dataDetail
//                         .filter((detail) => detail.id_account === item.id)
//                         .map((detail) => {
//                             return {
//                                 key: `${index}-${item.id}-${detail.reference}`,
//                                 data: {
//                                     ...detail,
//                                     debit: parseFloat(detail.debit as string),
//                                     credit: parseFloat(detail.credit as string),
//                                     ending_balance: 0,
//                                 },
//                                 children: [],
//                             };
//                         }),
//                     {
//                         key: `${index}-${item.id}-saldo-akhir`,
//                         data: {
//                             date: "Total",
//                             debit: ((parseFloat(saldoAwal.find((itemDetail: any) => itemDetail.id_account === item.id)?.debit as any) as number) +
//                                 dataDetail
//                                     .filter((detail) => detail.id_account === item.id)
//                                     .map((detail) => parseFloat(detail.debit as string))
//                                     .reduce((acc, curr) => acc + curr, 0)) as number,
//                             credit: ((parseFloat(saldoAwal.find((itemDetail: any) => itemDetail.id_account === item.id)?.credit as any) as number) +
//                                 dataDetail
//                                     .filter((detail) => detail.id_account === item.id)
//                                     .map((detail) => parseFloat(detail.credit as string))
//                                     .reduce((acc, curr) => acc + curr, 0)) as number,
//                             ending_balance: 0,
//                         },
//                     },
//                 ],
//             };
//         });

//         // Loop through each account entity in the data response
//         for (const account of data) {
//             let endingBalance = 0; // Initialize the ending balance with the initial balance

//             // Loop through transactions in the account entity
//             for (let i = 0; i < account.children.length - 1; i++) {
//                 const transaction = account.children[i];

//                 // Calculate the ending balance for each transaction
//                 endingBalance += transaction.data.debit - transaction.data.credit;

//                 // Add the ending balance to the transaction data
//                 transaction.data.ending_balance = endingBalance;
//             }

//             // Special handling for the last transaction in "saldo-akhir" row
//             const lastTransaction = account.children[account.children.length - 1];
//             if (lastTransaction.key.endsWith("saldo-akhir")) {
//                 let totalDebit = 0;
//                 let totalCredit = 0;

//                 // Calculate the total debit and total credit for all transactions except the last one
//                 for (let i = 0; i < account.children.length - 1; i++) {
//                     const transaction = account.children[i];
//                     totalDebit += transaction.data.debit;
//                     totalCredit += transaction.data.credit;
//                 }

//                 // Calculate the ending balance for the last row
//                 lastTransaction.data.debit = totalDebit;
//                 lastTransaction.data.credit = totalCredit;
//                 lastTransaction.data.ending_balance = totalDebit - totalCredit;
//             }
//         }
//         return data;
//     });
// };
