import { eq, sql } from "drizzle-orm";

import { AbsenPeriode, NewAbsenPeriode, absenPeriode } from "./schema";

export const getAbsenPeriode = async (tx = db) => {
    const data = await tx.select().from(absenPeriode);
    return data;
};

export const getAbsenPeriodeByYear = async (params: AbsenPeriode["year"], tx = db) => {
    const data = await tx.execute(
        sql.raw(`
        WITH all_months AS (
            SELECT generate_series(1, 12) AS month
        ),
        all_years AS (
            SELECT generate_series(2020, 2025) AS year
        )
        SELECT
            y.year::text,
            m.month,
            CASE m.month
                    WHEN 1 THEN 'Januari'
                    WHEN 2 THEN 'Februari'
                    WHEN 3 THEN 'Maret'
                    WHEN 4 THEN 'April'
                    WHEN 5 THEN 'Mei'
                    WHEN 6 THEN 'Juni'
                    WHEN 7 THEN 'Juli'
                    WHEN 8 THEN 'Agustus'
                    WHEN 9 THEN 'September'
                    WHEN 10 THEN 'Oktober'
                    WHEN 11 THEN 'November'
                    WHEN 12 THEN 'Desember'
                ELSE NULL
            END AS month_name,
            COALESCE(ap.start, NULL) AS start,
            COALESCE(ap.end_date, NULL) AS end_date
        FROM all_years y
        CROSS JOIN all_months m
        LEFT JOIN hr.absen_periode ap ON y.year::text = ap.year AND m.month = ap.month
        WHERE y.year::text = '${params}'  -- Filter for specific year
        ORDER BY y.year, m.month;
        `),
    );

    return data;
};

export const createAbsenPeriode = async (params: [NewAbsenPeriode], tx = db) => {
    const [data] = await tx.insert(absenPeriode).values(params).returning();
    return data;
};

export const updateAbsenPeriode = async (params: NewAbsenPeriode, tx = db) => {
    const [data] = await tx.update(absenPeriode).set(params).where(eq(absenPeriode.year, params.year)).returning();
    return data;
};

export const deleteAbsenPeriode = async (year: AbsenPeriode["year"], tx = db) => {
    const [data] = await tx.delete(absenPeriode).where(eq(absenPeriode.year, year)).returning();
    return data;
};
