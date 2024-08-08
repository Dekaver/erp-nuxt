import { sql } from 'drizzle-orm';
import  db from '../utils/db'
import dayjs from 'dayjs';
// ("rencana_anggaran_biaya", "nomor", "tanggal", "RAB", tanggal, tx)
// export const moduleNumberGenerator = async ( table: string, column: string, dateColumn: string, prefix: string, date: string, tx= db) => {
//     return ''
// }
export const moduleNumberGenerator = async (table: string, columnNumber: string, columnDate: string, module: string, dateString: string | Date, tx = db) => {
    let date = dayjs(dateString).tz("Asia/Makassar").format("YYYY-MM-DD");
    let query = `
		SELECT
			COALESCE(
			MAX(
				CAST(
					SUBSTRING(${columnNumber}, LENGTH(${columnNumber}) - 4 + 1, 5) AS INTEGER
				)
			), 0
			) AS max
		FROM
			${table}
		WHERE
			${columnDate} >= DATE_TRUNC('month', '${date}'::date)
			AND ${columnDate} < DATE_TRUNC('month', '${date}'::date) + INTERVAL '1 month';`;

    const [maxNumber]: any = await tx.execute(sql.raw(query));

    if (maxNumber.max == null) {
        throw ValidationError("Error, nomor tidak ditemukan");
    }
    const newNumber = parseInt(maxNumber.max as unknown as string) + 1; // + 1
    const paddedNumber = String(newNumber).padStart(5, "0"); // convert to 00001

    const year = date.substring(2, 4); // Extracts '23'
    const month = date.substring(5, 7); // Extracts '09'

    const generated = `${module}${year}${month}${paddedNumber}`;

    return generated;
};