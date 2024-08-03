import { sql, eq, and } from "drizzle-orm";
import { type NewTarget, type Target, target, targetColumns } from "../target/schema";
import { type NewAccount, type Account, account } from "../account/schema";

export const getTarget = async (tx = db) => {
    const data = await tx.execute(
        sql`
        SELECT a.*, b.nama as kantor
        FROM target a 
        INNER JOIN hr.kantor b ON b.id=a.id_kantor`,
    );
    return data;
};

export const getTargetById = async (tahun: Target["tahun"], id_kantor: Target["id_kantor"], tx = db) => {
    const data = await tx.execute(
        sql`
        SELECT json_agg(json_build_object(
            'bulan', bulan,
            'nama_bulan', nama_bulan,
            'operasional', COALESCE(operasional, 0),
            'pendapatan', COALESCE(pendapatan, 0)
        )) AS data
        FROM (
            SELECT 
                gs.bulan,
                CASE
                    WHEN gs.bulan = 1 THEN 'Januari'
                    WHEN gs.bulan = 2 THEN 'Februari'
                    WHEN gs.bulan = 3 THEN 'Maret'
                    WHEN gs.bulan = 4 THEN 'April'
                    WHEN gs.bulan = 5 THEN 'Mei'
                    WHEN gs.bulan = 6 THEN 'Juni'
                    WHEN gs.bulan = 7 THEN 'Juli'
                    WHEN gs.bulan = 8 THEN 'Agustus'
                    WHEN gs.bulan = 9 THEN 'September'
                    WHEN gs.bulan = 10 THEN 'Oktober'
                    WHEN gs.bulan = 11 THEN 'November'
                    WHEN gs.bulan = 12 THEN 'Desember'
                    ELSE 'Tidak Diketahui'
                END AS nama_bulan,
                SUM(CASE WHEN gs.bulan = 1 THEN t.o1
                         WHEN gs.bulan = 2 THEN t.o2
                         WHEN gs.bulan = 3 THEN t.o3
                         WHEN gs.bulan = 4 THEN t.o4
                         WHEN gs.bulan = 5 THEN t.o5
                         WHEN gs.bulan = 6 THEN t.o6
                         WHEN gs.bulan = 7 THEN t.o7
                         WHEN gs.bulan = 8 THEN t.o8
                         WHEN gs.bulan = 9 THEN t.o9
                         WHEN gs.bulan = 10 THEN t.o10
                         WHEN gs.bulan = 11 THEN t.o11
                         WHEN gs.bulan = 12 THEN t.o12
                         ELSE 0 END) AS operasional,
                SUM(CASE WHEN gs.bulan = 1 THEN t.p1
                         WHEN gs.bulan = 2 THEN t.p2
                         WHEN gs.bulan = 3 THEN t.p3
                         WHEN gs.bulan = 4 THEN t.p4
                         WHEN gs.bulan = 5 THEN t.p5
                         WHEN gs.bulan = 6 THEN t.p6
                         WHEN gs.bulan = 7 THEN t.p7
                         WHEN gs.bulan = 8 THEN t.p8
                         WHEN gs.bulan = 9 THEN t.p9
                         WHEN gs.bulan = 10 THEN t.p10
                         WHEN gs.bulan = 11 THEN t.p11
                         WHEN gs.bulan = 12 THEN t.p12
                         ELSE 0 END) AS pendapatan
            FROM generate_series(1,12) AS gs(bulan)
            CROSS JOIN target t
            WHERE t.tahun = ${tahun}
              AND t.id_kantor = ${id_kantor}
            GROUP BY gs.bulan
            ORDER BY gs.bulan
        ) AS monthly_data `,
    );
    return data[0];
};

export const createTarget = async (tahun: NewTarget, tx = db) => {
    const [data] = await tx.insert(target).values(tahun).returning();
    return data;
};

export const updateTarget = async (tahun: Target["tahun"], id_kantor: Target["id_kantor"], form: NewTarget, tx = db) => {
    const [data] = await tx
        .update(target)
        .set(form)
        .where(and(eq(target.tahun, tahun), eq(target.id_kantor, id_kantor)))
        .returning();
    return data;
};

export const deleteTarget = async (tahun: Target["tahun"], id_kantor: Target["id_kantor"], tx = db) => {
    const [data] = await tx
        .delete(target)
        .where(and(eq(target.tahun, tahun), eq(target.id_kantor, id_kantor)))
        .returning();
    return data;
};
