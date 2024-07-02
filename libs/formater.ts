import { Primitive } from "zod";
import moment from "moment-timezone";
import Terbilang from "terbilang-ts";
import { ToWords } from "to-words";
// import "moment/locale/id";

const toWords = new ToWords({
    localeCode: "en-US",
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: true,
        currencyOptions: {
            // can be used to override defaults for the selected locale
            name: "Rupiah",
            plural: "Rupiah",
            symbol: "Rp.",
            fractionalUnit: {
                name: "Rupiah",
                plural: "Rupiah",
                symbol: "",
            },
        },
    },
});

export function ToString(value: Primitive): Primitive {
    if (value !== null && value !== undefined) {
        return value.toString();
    }
    return value; // Return the original value if it's null or undefined
}

export const formatCurrency = function (value: number) {
    let val = value || "0";
    return parseFloat(val as string).toLocaleString("id-ID", { style: "currency", currency: "IDR" });
};

// export const formatNumber = function (value: number) {
//     let val = value || "0";
//     return parseFloat(val as string).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };
export const formatNumber = function (value: number) {
    // If value is null or undefined, set it to 0
    value = value != null ? value : 0;

    // Convert to a floating-point number with 2 decimal places
    const floatValue = parseFloat(value as any).toFixed(2);

    // Check if the decimal part is '.00'
    const hasDecimal = floatValue.endsWith(".00");

    // Use Intl.NumberFormat for formatting
    const formatter = new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: hasDecimal ? 0 : 2,
        maximumFractionDigits: hasDecimal ? 0 : 2,
    });

    // Format the number
    return formatter.format(parseFloat(floatValue));
};

export const formatInteger = function (value: number) {
    let val = value || "0";
    return parseFloat(val as string).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export function formatDate(value: Date | string, format: string = "YYYY-MM-DD"): string {
    // return moment.utc(new Date(value), 'YYYY-MM-DD').tz("Asia/Makassar").format('YYYY-MM-DD');
    return moment(value).tz("Asia/Makassar").format(format);
}
export function formatDate2(value: Date | string | null | undefined): string {
    if (!value) return ""; // Handle null or undefined values
    const date = moment(value);
    if (!date.isValid()) {
        return ""; // Return an empty string if the date is invalid
    }
    return date.tz("Asia/Makassar").format("LL");
}

export function formatDateLocale(value?: Date | string, format = "LL"): string {
    // return moment.utc(new Date(value), 'YYYY-MM-DD').tz("Asia/Makassar").format('YYYY-MM-DD');
    const date = moment(value).tz("Asia/Makassar");
    return date.locale("id").format(format);
}

export function DateTimeZoneNow(): string {
    return moment().tz("Asia/Makassar").format("YYYY-MM-DD HH:mm:ss");
}

export function formatCapitalizeString(str: string) {
    // Split the string into words based on underscores
    const words = str.split("_");

    // Capitalize the first letter of each word and join them with a space
    const formattedStr = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return formattedStr;
}

export function formatFilterDate(value: String): string {
    let data = "";
    if (value != "") {
        data = new Date(value as string).toISOString().split("T")[0];
    }
    return data;
}

export function DateTz(value?: Date | string): string {
    return moment(value).tz("Asia/Makassar").format("YYYY-MM-DD");
}

export function ToTerbilang(value: number, locale: string = "en") {
    switch (locale) {
        case "in":
            return Terbilang(value);

        case "en":
            return toWords.convert(value);
    }
}
