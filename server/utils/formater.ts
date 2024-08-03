import { Primitive } from "zod";
import * as dayjs from 'dayjs'
import Terbilang from "terbilang-ts";
import { ToWords } from "to-words";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

const toWords = new ToWords({
	localeCode: "en-US",
	converterOptions: {
		currency: true,
		ignoreDecimal: false,
		ignoreZeroCurrency: false,
		doNotAddOnly: true,
		currencyOptions: {
			// can be used to override defaults for the selected locale
			name: "RUPIAH",
			plural: "RUPIAH",
			symbol: "Rp.",
			fractionalUnit: {
				name: "RUPIAH",
				plural: "RUPIAH",
				symbol: "",
			},
		},
	},
});

export function ToTerbilang(value: number, locale: string = "in") {
	switch (locale) {
		case "in":
			return Terbilang(value);

		case "en":
			return toWords.convert(value);
	}
}

export const formatCurrency = function (value: number) {
	const val = value || "0";
	return parseFloat(val as string).toLocaleString("id-ID", { style: "currency", currency: "IDR" });
};

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

export const formatNumberCurrency = function (value: number) {
	const val = value || "0";
	return parseFloat(val as string).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export function ToString(value: Primitive): Primitive {
	if (value !== null && value !== undefined) {
		return value.toString();
	}
	return value; // Return the original value if it's null or undefined
}

export function escapePostgresString(input: string): string {
    return input
        .replace(/\\/g, '\\\\')  // Escape backslashes
        .replace(/'/g, "''")     // Escape single quotes
        .replace(/%/g, '\\%')    // Escape percent signs
        .replace(/_/g, '\\_');   // Escape underscore signs
}

export function excelDateToJSDate(serial: number): Date {
    // Subtract the number of days from 1900-01-01 to get the number of days since 1970-01-01.
    const utc_days = Math.floor(serial - 25_569);

    // Multiply the number of days by the number of milliseconds in a day to get the UTC value.
    const utc_value = utc_days * 86_400;

    // Create a new Date object with the UTC value to get the date information.
    const date_info = new Date(utc_value * 1000);

    // Calculate the fractional part of the serial date to get the time information.
    const fractional_day = serial - Math.floor(serial) + 0.0000001;

    // Calculate the total number of seconds in the fractional part of the serial date.
    let total_seconds = Math.floor(86_400 * fractional_day);

    // Calculate the seconds, minutes, and hours from the total number of seconds.
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const minutes = Math.floor(total_seconds / 60) % 60;
    const hours = Math.floor(total_seconds / (60 * 60));

    // Create a new Date object with the UTC values and the time information.
    return new Date(Date.UTC(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds));
}


export function formatDate(value?: Date | string, format = "YYYY-MM-DD"): string {
	return dayjs(value).tz("Asia/Makassar").format(format);
}

export function formatDateLocale(value?: Date | string, format = "LL"): string {
	// return moment.utc(new Date(value), 'YYYY-MM-DD').tz("Asia/Makassar").format('YYYY-MM-DD');
	const date = dayjs(value).tz("Asia/Makassar");
	return date.locale("id").format(format);
}

export function DateTimeZoneNow(): string {
	return dayjs().tz("Asia/Makassar").format("YYYY-MM-DD HH:mm:ss");
}
const romanNumerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export function formatRomawi(value: number | string): string {
	return romanNumerals[parseInt(value as string)];
}

export function formatCapitalizeString(str: string) {
	// Split the string into words based on underscores
	const words = str.split("_");

	// Capitalize the first letter of each word and join them with a space
	const formattedStr = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

	return formattedStr;
}

export function formatUrl(str: string) {
	return (
		str
			.toLowerCase()
			// .replace(/ /g, "-")
			.replace(/_/g, "-")
			.replace(/[^\w-]+/g, "")
	);
}

export function formatTime(str: Date) {
	return str == null ? null : dayjs(str).tz("Asia/Makassar").format("HH:mm:ss");
}

export function roundToTens(value: number | string): number {
	const number = parseFloat(value as string);
	if (number % 10 <= 6) {
		return number - (number % 10);
	} else {
		return number + (10 - (number % 10));
	}
}

export function roundToHundreds(value: number | string): number {
	const number = parseFloat(value as string);
	if (number % 100 <= 60) {
		return number - (number % 100);
	} else {
		return number + (100 - (number % 100));
	}
}

export function hitungDiskon(harga: any, diskon_persen_1: any, diskon_persen_2: any, diskon_persen_3: any, rumus: any) {
	harga = parseFloat(harga);
	diskon_persen_1 = parseFloat(diskon_persen_1);
	diskon_persen_2 = parseFloat(diskon_persen_2);
	diskon_persen_3 = parseFloat(diskon_persen_3);

	let diskon1, diskon2, diskon3;

	if (rumus === 1) {
		diskon1 = (harga * diskon_persen_1) / 100;
		diskon2 = ((harga - diskon1) * diskon_persen_2) / 100;
		diskon3 = ((harga - diskon1 - diskon2) * diskon_persen_3) / 100;
	} else if (rumus === 2) {
		diskon1 = (harga * diskon_persen_1) / 100;
		diskon2 = (harga * diskon_persen_2) / 100;
		diskon3 = (harga * diskon_persen_3) / 100;
	} else if (rumus === 3) {
		diskon1 = (harga * diskon_persen_1) / 100;
		diskon2 = ((harga - diskon1) * diskon_persen_2) / 100;
		diskon3 = (harga * diskon_persen_3) / 100;
	} else {
		diskon1 = 0;
		diskon2 = 0;
		diskon3 = 0;
	}

	return { diskon1, diskon2, diskon3 };
}
