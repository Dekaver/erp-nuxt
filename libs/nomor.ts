import { sql } from "drizzle-orm";
import db from "./db";
import moment from "moment";
import { Account } from "../modules/account/schema";
import { ValidationError } from "./errors";

const romanNumerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export const nomorTandaTerimaInvoice = async (tanggal: string, tx = db) => {
  return await moduleNumberGenerator("tanda_terima_invoice", "nomor", "tanggal", "", tanggal, tx);
};
export const nomorDebitNote = async (tanggal: string, tx = db) => {
  return await moduleNumberGenerator("debit_note", "nomor", "tanggal", "", tanggal, tx);
};

export const nomorUangMuka = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("uang_muka", "nomor", "tanggal", "UM", tanggal, tx);
};

export const nomorPenerimaanBarang = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("penerimaan_barang", "nomor", "tanggal", "PB", tanggal, tx);
};

export const nomorInternalTransfer = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("internal_transfer", "nomor", "tanggal", "IT", tanggal, tx);
};

export const nomorPettyCash = async (tanggal: string, tx = db) => {
  return await moduleNumberGenerator("petty_cash", "reference", "date", "PT", tanggal, tx);
};

export const nomorKasKeluar = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("acc_kas", "reference", "date", "CO", tanggal, tx);
};

export const nomorKasMasuk = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("acc_kas", "reference", "date", "CI", tanggal, tx);
};
export const nomorGlTrans = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("acc_gl_trans", "gl_number", "gl_date", "GL", tanggal, tx);
};

export const nomorInternalOrder = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("internal_order", "nomor", "tanggal", "IO", tanggal, tx);
};

// TODO: ini ada API jadi khusus
export const nomorSaldoAwalAp = async (tahun: number, bulan: number, tx = db) => {
    return await tx
        .execute(sql`SELECT MAX(SUBSTR(ap_number, 8, 12)) FROM acc_ap_faktur WHERE EXTRACT(month FROM date) = ${bulan} AND EXTRACT(year FROM date) = ${tahun} AND ap_number LIKE 'API%'`)
        .then((query: any) => {
            let dataAkhir = "";
            const subTahun = String(tahun).substring(2, 4);
            const bulanPadded = String(bulan).padStart(2, "0");
            if (query[0].max != null) {
                const numberString = query[0].max || 0;
                const number = Number(numberString);
                const incrementedNumber = number + 1;
                const noMaxPadded = String(incrementedNumber).padStart(numberString.length, "0");

                dataAkhir = `API${subTahun}${bulanPadded}${noMaxPadded}`;
            } else {
                dataAkhir = `API${subTahun}${bulanPadded}00001`;
            }
            return dataAkhir;
        })
        .catch((error) => {
            console.error("Error executing raw select query:", error);
            return error;
        });
};

// ! i dunno
export const nomorAccApFaktur = async (tahun: number, bulan: number, tx = db) => {
    return await tx
        .execute(sql`SELECT MAX(SUBSTR(number,1,3)) FROM acc_ap_faktur WHERE EXTRACT(month FROM date)=${bulan} AND EXTRACT(year FROM date)=${tahun}`)
        .then((query: any) => {
            let dataAkhir = "";
            console.log(query[0].max);
            if (query[0].max != null) {
                const numberString = query[0].max || 0;
                const number = Number(numberString);
                const incrementedNumber = number + 1;
                const noMaxPadded = String(incrementedNumber).padStart(numberString.length, "0");

                dataAkhir = `${noMaxPadded}/APP/${bulan}/${tahun}`;
            } else {
                dataAkhir = `001/ACP/${bulan}/${tahun}`;
            }
            return dataAkhir;
        })
        .catch((error) => {
            console.error("Error executing raw select query:", error);
            return error;
        });
};

// ? Maybe dipake
export const nomorAccProposalAp = async (tahun: number, bulan: number, tx = db) => {
    return await tx
        .execute(sql`SELECT MAX(SUBSTR(nomor,1,3)) FROM acc_proposal_ap WHERE EXTRACT(month FROM tanggal)=${bulan} AND EXTRACT(year FROM tanggal)=${tahun}`)
        .then((query: any) => {
            let dataAkhir = "";
            console.log(query[0].max);
            if (query[0].max != null) {
                const numberString = query[0].max || 0;
                const number = Number(numberString);
                const incrementedNumber = number + 1;
                const noMaxPadded = String(incrementedNumber).padStart(numberString.length, "0");

                dataAkhir = `${noMaxPadded}/APP/${bulan}/${tahun}`;
            } else {
                dataAkhir = `001/PAP/${bulan}/${tahun}`;
            }
            return dataAkhir;
        })
        .catch((error) => {
            console.error("Error executing raw select query:", error);
            return error;
        });
};

export const nomorAccountLevel2 = async (parent_id: Account["id"], tx = db) => {
    const [data] = await tx.execute(sql`
    WITH ParentCode AS (
      SELECT
        code AS parent_code
      FROM
        account
      WHERE
        id = ${parent_id}
    ),
    LastLevel2Code AS (
      SELECT
        MAX(CAST(RIGHT(code, 3) AS INTEGER)) AS last_code
      FROM
        account
      WHERE
        LENGTH(code) = 4 AND level = 2 AND LEFT(code, 1) = (SELECT parent_code FROM ParentCode)
    )
    SELECT
      (SELECT parent_code FROM ParentCode) || COALESCE(TO_CHAR(COALESCE(last_code + 100, 0), 'FM000'), '000') AS next_code
    FROM
      LastLevel2Code;
  `);
    return data.next_code as string;
};

export const nomorAccountLevel3 = async (parent_id: Account["id"], tx = db) => {
    const [data] = await tx.execute(sql`
  WITH ParentCode AS (
    SELECT
      code AS parent_code
    FROM
      account
    WHERE
      id = ${parent_id}  -- Replace with the actual parent account ID
  ),
  LastLevel3Code AS (
    SELECT
      CASE
        WHEN MAX(code::integer) IS NULL THEN (SELECT parent_code FROM ParentCode)::integer + 1
        ELSE (COALESCE(MAX(code::integer), 0) + 1)
      END::text AS last_code
    FROM
      account AS a1
    WHERE
      LENGTH(code) = 4  -- Assuming level 3 codes have a length of 4 characters
      AND level = 3
      AND EXISTS (
        SELECT 1
        FROM account AS a2
        WHERE a2.id = a1.parent  -- Match the parent ID of level 3 accounts
        AND a2.code = (SELECT parent_code FROM ParentCode)
      )
  )
  SELECT last_code as next_code FROM LastLevel3Code;
  `);
    return data.next_code as string;
};

export const nomorMasterAccount = async (parent_id: Account["id"], tx = db) => {
    const [data] = await tx.execute(sql`
    WITH ParentCode AS (
      SELECT
        MAX(LEFT(code, 4)) AS parent_code
      FROM
        account
      WHERE
        LENGTH(code) >= 4 AND level = 3 AND id = ${parent_id}
    ),
    LastFiveDigits AS (
      SELECT
        CASE
          WHEN code ~ '[0-9]{5}$' THEN CAST(SUBSTR(code, LENGTH(code) - 4, 5) AS integer)
          ELSE 0  -- Use a default value (0) for cases where extraction fails
        END AS last_digits
      FROM
        account
      WHERE
        LENGTH(code) >= 5  -- Adjust the condition as needed
    )
    SELECT
      (SELECT parent_code FROM ParentCode) || '-00-' || TO_CHAR(COALESCE(MAX(last_digits),0) + 1, 'FM00000') AS next_code
    FROM
      LastFiveDigits;
      `);
    return data.next_code as string;
};

export const moduleNumberGenerator = async (table: string, columnNumber: string, columnDate: string, module: string, dateString: string | Date, tx = db) => {
    let date = moment(dateString).tz("Asia/Makassar").format("YYYY-MM-DD");
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

    const [maxNumber] = await tx.execute(sql.raw(query));

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

export const moduleInvoiceNumberGenerator = async (table: string, columnNumber: string, columnDate: string, module: string, dateString: string | Date, tx = db) => {
    let date = moment(dateString).tz("Asia/Makassar");
    let formattedDate = date.format("YYYY-MM-DD");
    let monthRoman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

    let query = `
  SELECT
  COALESCE(
    MAX(
      CAST(
        SUBSTRING(nomor, POSITION('/' IN nomor) + 1, POSITION('/TW' IN nomor) - POSITION('/' IN nomor) - 1)
        AS INTEGER
      )
    ), 0
  ) AS max
  FROM
    ${table}
  WHERE
    ${columnDate} >= DATE_TRUNC('year', '${formattedDate}'::date)`;

    const [maxNumber] = await tx.execute(sql.raw(query));

    if (maxNumber.max == null) {
        throw ValidationError("Error, nomor tidak ditemukan");
    }

    const newNumber = parseInt(maxNumber.max as unknown as string) + 1; // + 1
    const paddedNumber = String(newNumber).padStart(3, "0"); // convert to 070

    const year = date.format("YYYY"); // Extracts '2024'
    const month = monthRoman[date.month()]; // Extracts 'II' for February

    const generated = `${module}/${paddedNumber}/TW/${month}/${year}`;

    return generated;
};

export const moduleDoNumberGenerator = async (dateString: string | Date, tx = db) => {
    let date = moment(dateString).tz("Asia/Makassar");
    let formattedDate = date.format("YYYY-MM-DD");

    let query = `
    SELECT
    COALESCE(
      MAX(
        CAST(
          RIGHT(TRIM(SUBSTRING(nomor FROM POSITION(' ' IN nomor) + 1)), 3)
          AS INTEGER
        )
      ), 0
    ) AS max
FROM
  delivery_order
WHERE
  tanggal >= DATE_TRUNC('year', '${formattedDate}'::date)`;

    const [maxNumber] = await tx.execute(sql.raw(query));

    if (maxNumber.max == null) {
        throw ValidationError("Error, nomor tidak ditemukan");
    }

    const newNumber = parseInt(maxNumber.max as unknown as string) + 1; // + 1
    const paddedNumber = String(newNumber).padStart(3, "0"); // convert to 070

    const year = date.format("YY");

    const generated = `D ${year}${paddedNumber}`;

    return generated;
};
