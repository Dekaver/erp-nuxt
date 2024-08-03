import ejs from "ejs";
import { readFileSync } from "fs";
import path from "path";
import puppeteer, { Page } from "puppeteer";
import { formatDate, formatNumber } from "../../libs/formater";
import { Response } from "express";
import { getSettingByName } from "../setting/service";

export const COMPANY_ID = 1; // Replace with your actual default company ID
export const TEMPLATE_PATH = path.join(__dirname, "../../views/templates");
export const CSS_BS_PATH = path.join(__dirname, "../../views/bootstrap.min.css");
export const CSS_CS_PATH = path.join(__dirname, "../../views/templates/design-cetakan.css");

export const setupPuppeteer = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set template from setting
    const data = await getSettingByName("template_cetakan");
    const template = data.value;
    return { browser, page, template };
};

export const generateHTMLContent = (data: any, perusahaan: any, module: string, template: string) => {
    const templateContent = readFileSync(`${TEMPLATE_PATH}/${template}/${module}.ejs`, "utf-8");
    const htmlContent = ejs.render(templateContent, {
        data,
        perusahaan,
        imageSrc: getImageSrc("stempel-planetit-hairian.png"),
        formatDate,
        formatNumber,
    });
    return { templateContent, htmlContent };
};

export const getImageSrc = (imageName: string) => {
    const imagePath = path.join(__dirname, `../../views/templates/${imageName}`);
    return `data:image/png;base64,${readFileSync(imagePath, "base64")}`;
};

export const injectStylesAndScripts = async (page: Page, htmlContent: string) => {
    const cssBSContent = readFileSync(CSS_BS_PATH, "utf-8");
    const cssCSContent = readFileSync(CSS_CS_PATH, "utf-8");
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.addStyleTag({ content: cssBSContent });
    await page.addStyleTag({ content: cssCSContent });
};

export const generatePDF = async (page: Page) => {
    return await page.pdf({
        format: "A4",
    });
};

export const sendPDFResponse = (res: Response, pdfBuffer: Buffer) => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
    res.send(pdfBuffer);
};
