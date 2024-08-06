import dayjs from 'dayjs'
import Terbilang from "terbilang-ts";
import { ToWords } from "to-words";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Makassar");

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

// If value is null or undefined, set it to 0
export const formatNumber = (value = 0, options?: Intl.NumberFormatOptions) => {
	// Convert to a floating-point number with 2 decimal places
	// const floatValue = parseFloat(value as any).toFixed(2);
	// Check if the decimal part is '.00'
	// const hasDecimal = floatValue.endsWith(".00");
	// Use Intl.NumberFormat for formatting
	const formatter = new Intl.NumberFormat("id-ID", {
        ...options,
		minimumFractionDigits : 2,
		maximumFractionDigits : 2,
	});

	// Format the number
	return formatter.format(value);
};

export const formatNumberCurrency = function (value: number) {
	const val = value || "0";
	return parseFloat(val as string).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};



export function formatDate(value?: Date | string, format = "YYYY-MM-DD"): string | undefined {
    if (!value) return
	return dayjs(value).tz("Asia/Makassar").format(format);
}

export function formatDateLocale(value?: Date | string, format = "LL"): string {
	// return moment.utc(new Date(value), 'YYYY-MM-DD').tz("Asia/Makassar").format('YYYY-MM-DD');
	const date = dayjs(value).tz("Asia/Makassar");
	return date.locale("id").format(format);
}

const romanNumerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export function formatRomawi(value: number | string): string {
	return romanNumerals[parseInt(value as string)];
}

// schema.ts
export function formatCapitalizeString(str: string) {
	// Split the string into words based on underscores
	const words = str.split("_");

	// Capitalize the first letter of each word and join them with a space
	const formattedStr = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

	return formattedStr;
}

// schema.ts
export function formatUrl(str: string) {
	return (
		str
			.toLowerCase()
			// .replace(/ /g, "-")
			.replace(/_/g, "-")
			.replace(/[^\w-]+/g, "")
	);
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

// dari Ferto
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
