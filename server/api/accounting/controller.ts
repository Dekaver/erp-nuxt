// import { NextFunction, Request, Response } from "express";
// import { getBukuBesar, getJurnal, getJurnalForExport, getLabaRugi, getNeraca, getNetProfitLabaRugi } from "./service";
// import puppeteer from "puppeteer";
// import path from "path";
// import fs from "fs";
// import ejs from "ejs";
// import { formatNumber, formatDate } from "../../libs/formater";
// import { z } from "zod";
// import { getInternalPerusahaanById } from "../internal-perusahaan/service";

// export const cetakLabaRugi = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const awal = req.query.awal || "1";
//         const akhir = req.query.akhir || "12";
//         const tahun = req.query.tahun || new Date().getFullYear();
//         const bulan = [
//             { id: 1, nama: "JANUARI" },
//             { id: 2, nama: "FEBRUARY" },
//             { id: 3, nama: "MARET" },
//             { id: 4, nama: "APRIL" },
//             { id: 5, nama: "MEI" },
//             { id: 6, nama: "JUNI" },
//             { id: 7, nama: "JULI" },
//             { id: 8, nama: "AGUSTUS" },
//             { id: 9, nama: "SEPTEMBER" },
//             { id: 10, nama: "OKTOBER" },
//             { id: 11, nama: "NOVEMBER" },
//             { id: 12, nama: "DESEMBER" },
//         ];
//         const data = await getNetProfitLabaRugi(awal as string, akhir as string, tahun as string);

//         const dataPerusahaan = await getInternalPerusahaanById(1);

//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         const templatePath = path.join(__dirname, "../../views/templates/default", "laba-rugi.ejs");
//         const templateContent = fs.readFileSync(templatePath, "utf-8");

//         // Set up the CSS and JavaScript paths
//         // const cssBSPath = path.join(__dirname, '../views/bootstrap.min.css');
//         // const cssCSPath = path.join(__dirname, '../views/custom-print.css');
//         // const imagePath = path.join(__dirname, '../views/sbs-logo.png');
//         // const imageSrc = `data:image/png;base64,${fs.readFileSync(imagePath, 'base64')}`;

//         const htmlContent = ejs.render(templateContent, {
//             data: data,
//             perusahaan: dataPerusahaan,
//             periodeAwal: bulan[parseInt(awal as string) - 1].nama,
//             periodeAkhir: bulan[parseInt(akhir as string) - 1].nama,
//             periodeTahun: tahun,
//             formatDate: formatDate,
//             formatNumber: formatNumber,
//         });

//         // Inject the CSS and JavaScript into the HTML page
//         // const cssBSContent = fs.readFileSync(cssBSPath, 'utf-8');
//         // const cssCSContent = fs.readFileSync(cssCSPath, 'utf-8');
//         await page.setContent(htmlContent, { waitUntil: "networkidle0" });
//         // await page.addStyleTag({ content: cssBSContent });
//         // await page.addStyleTag({ content: cssCSContent });

//         // Generate PDF
//         const pdfBuffer = await page.pdf({
//             format: "A4",
//         });

//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
//         res.send(pdfBuffer);

//         await browser.close();
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("An error occurred while generating the PDF.");
//     }
// };

// export const cetakNeraca = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const bulan = req.query.bulan || new Date().getMonth() + 1;
//         const tahun = req.query.tahun || new Date().getFullYear();
//         const lbulan = [
//             { id: 1, nama: "JANUARI" },
//             { id: 2, nama: "FEBRUARY" },
//             { id: 3, nama: "MARET" },
//             { id: 4, nama: "APRIL" },
//             { id: 5, nama: "MEI" },
//             { id: 6, nama: "JUNI" },
//             { id: 7, nama: "JULI" },
//             { id: 8, nama: "AGUSTUS" },
//             { id: 9, nama: "SEPTEMBER" },
//             { id: 10, nama: "OKTOBER" },
//             { id: 11, nama: "NOVEMBER" },
//             { id: 12, nama: "DESEMBER" },
//         ];

//         // Harta
//         const dataHarta = await getNeraca(0, parseInt(bulan as string), parseInt(tahun as string), "1");

//         // Harta aktiva lancar dengan kode 100
//         const dataHartaLancar = dataHarta.filter((account) => account.code.startsWith("100") && account.level == 4 && parseFloat(account.debit as unknown as string));
//         const totalHartaLancar = dataHartaLancar.reduce((a, b) => a + (b.debit || 0) * 1, 0) || 0;

//         // Harta aktiva tetap dengan kode 110
//         const dataHartaTetap = dataHarta.filter((account) => account.code.startsWith("110") && account.level == 4 && parseFloat(account.debit as unknown as string));
//         const totalHartaTetap = dataHartaTetap.reduce((a, b) => a + (b.debit || 0) * 1, 0) || 0;

//         // Hutang
//         const dataHutang = await getNeraca(0, parseInt(bulan as string), parseInt(tahun as string), "2");
//         const totalHutang = dataHutang.filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3).reduce((a, b) => a + b.debit * -1, 0);

//         const dataSaham = await getNeraca(0, parseInt(bulan as string), parseInt(tahun as string), "3");
//         const totalSaham = dataSaham.filter((account) => (account.level == 4 && (account.debit || 0) != 0) || account.level == 3).reduce((a, b) => a + b.debit * -1, 0);

//         const dataNetProfit = await getNetProfitLabaRugi("1" as string, bulan as string, tahun as string);
//         const totalNetProfit = dataNetProfit.find((account) => account.name == "NET PROFIT/LOSS");

//         const data = [
//             ...dataHartaLancar.map((account) => {
//                 return {
//                     type: account.level == 3 ? "H" : "D",
//                     name: account.name,
//                     debit: account.debit * 1,
//                 };
//             }),
//             {
//                 type: "F",
//                 name: "TOTAL HARTA Lancar",
//                 debit: totalHartaLancar,
//             },
//             ...dataHartaTetap.map((account) => {
//                 return {
//                     type: account.level == 3 ? "H" : "D",
//                     name: account.name,
//                     debit: account.debit * 1,
//                 };
//             }),
//             {
//                 type: "F",
//                 name: "TOTAL HARTA Tetap",
//                 debit: totalHartaTetap,
//             },
//             {
//                 type: "F",
//                 name: "TOTAL HARTA",
//                 debit: totalHartaLancar + totalHartaTetap,
//             },
//             ...dataHutang
//                 .filter((account) => account.level == 4 && (account.debit || 0) != 0)
//                 .map((account) => {
//                     return {
//                         type: account.level == 3 ? "H" : "D",
//                         name: account.name,
//                         debit: account.debit * -1,
//                     };
//                 }),
//             {
//                 type: "F",
//                 name: "TOTAL Hutang",
//                 debit: totalHutang,
//             },
//             ...dataSaham
//                 .filter((account) => account.level == 4 && (account.debit || 0) != 0)
//                 .map((account) => {
//                     return {
//                         type: account.level == 3 ? "H" : "D",
//                         name: account.name,
//                         debit: account.debit * -1,
//                     };
//                 }),
//             {
//                 type: "D",
//                 name: "Laba/Rugi Tahun Berjalan",
//                 debit: totalNetProfit?.debit || 0,
//             },
//             {
//                 type: "F",
//                 name: "TOTAL Modal",
//                 debit: (totalNetProfit?.debit || 0) + totalSaham,
//             },
//             {
//                 type: "F",
//                 name: "TOTAL Passiva",
//                 debit: (totalHutang) + (totalNetProfit?.debit || 0) + totalSaham,
//             },

//             // {
//             //     type: "F",
//             //     name: "NET PROFIT/LOSS",
//             //     debit: totalPendapatan - totalHPP - totalBiayaOperasional + totalPendapatan - totalBiayaLainLain,
//             // },
//         ];

//         const dataPerusahaan = await getInternalPerusahaanById(1);
//         console.log(dataPerusahaan);

//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();

//         const templatePath = path.join(__dirname, "../../views/templates/default", "neraca.ejs");
//         const templateContent = fs.readFileSync(templatePath, "utf-8");

//         // Set up the CSS and JavaScript paths
//         // const cssBSPath = path.join(__dirname, '../views/bootstrap.min.css');
//         // const cssCSPath = path.join(__dirname, '../views/custom-print.css');
//         // const imagePath = path.join(__dirname, '../views/sbs-logo.png');
//         // const imageSrc = `data:image/png;base64,${fs.readFileSync(imagePath, 'base64')}`;

//         const htmlContent = ejs.render(templateContent, {
//             data: data,
//             perusahaan: dataPerusahaan,
//             nama_bulan: lbulan[parseInt(bulan as string) - 1].nama,
//             periodeTahun: tahun,
//             formatDate: formatDate,
//             formatNumber: formatNumber,
//         });

//         // Inject the CSS and JavaScript into the HTML page
//         // const cssBSContent = fs.readFileSync(cssBSPath, 'utf-8');
//         // const cssCSContent = fs.readFileSync(cssCSPath, 'utf-8');
//         await page.setContent(htmlContent, { waitUntil: "networkidle0" });
//         // await page.addStyleTag({ content: cssBSContent });
//         // await page.addStyleTag({ content: cssCSContent });

//         // Generate PDF
//         const pdfBuffer = await page.pdf({
//             format: "A4",
//         });

//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
//         res.send(pdfBuffer);

//         await browser.close();
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("An error occurred while generating the PDF.");
//     }
// };

// export const showBukuBesar = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const querySchema = z.object({
//             deskripsi: z.string(),
//             akun_awal: z.string(),
//             akun_akhir: z.string(),
//             tanggal_awal: z.string(),
//             tanggal_akhir: z.string(),
//         });
//         const validate = querySchema.parse(req.query);
//         const data = await getBukuBesar(validate.deskripsi, validate.akun_awal, validate.akun_akhir, validate.tanggal_awal, validate.tanggal_akhir);
//         res.status(200).json({
//             message: "Success Get Buku Besar",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const showJurnal = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const data = await getJurnal();
//         res.status(200).json({
//             message: "Success Get Jurnal",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// export const exportJurnal = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { awal, akhir } = req.query;
//         const data = await getJurnalForExport(awal as string, akhir as string);
//         res.status(200).json({
//             message: "Success Get Jurnal For Export",
//             data: data,
//         });
//     } catch (error) {
//         next(error);
//     }
// };
