import { Request, Response, NextFunction } from "express";
import { acc_ap_faktur } from "../ap/schema";
import { eq, sql } from "drizzle-orm";
import { acc_ar_faktur } from "../ar/schema";
import { invoice } from "../invoice/schema";

export const indexAPBelumLunas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sq = db
            .select({
                hutang: sql`COALESCE(SUM(acc_ap_faktur.amount - acc_ap_faktur.discount - acc_ap_faktur.pay), 0)`.as("hutang"),
            })
            .from(acc_ap_faktur)
            .groupBy(acc_ap_faktur.ap_number)
            .as("sq");

        const [data] = await db
            .select({
                hutang: sql`COALESCE(SUM(sq.hutang), 0)`,
            })
            .from(sq);

        res.status(200).json({
            message: "Success get data AP Belum Lunas",
            data: data.hutang || 0,
        });
    } catch (error) {
        next(error);
    }
};

export const indexARBelumLunas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sq = db
            .select({
                piutang: sql`COALESCE(SUM(acc_ar_faktur.amount - acc_ar_faktur.discount - acc_ar_faktur.pay), 0)`.as("piutang"),
            })
            .from(acc_ar_faktur)
            .groupBy(acc_ar_faktur.invoice)
            .as("sq");
        const [data] = await db
            .select({
                piutang: sql`COALESCE(SUM(sq.piutang), 0)`,
            })
            .from(sq);

        res.status(200).json({
            message: "Success get data AR Belum Lunas",
            data: data.piutang || 0,
        });
    } catch (error) {
        next(error);
    }
};

export const indexPendapatan = async (req: Request, res: Response, next: NextFunction) => {
    const { tahun } = req.query;
    try {
        let query = `SELECT
        COALESCE(SUM(cr1-db1), 0) AS balance1,
        COALESCE(SUM(cr2-db2), 0) AS balance2,
        COALESCE(SUM(cr3-db3), 0) AS balance3,
        COALESCE(SUM(cr4-db4), 0) AS balance4,
        COALESCE(SUM(cr5-db5), 0) AS balance5,
        COALESCE(SUM(cr6-db6), 0) AS balance6,
        COALESCE(SUM(cr7-db7), 0) AS balance7,
        COALESCE(SUM(cr8-db8), 0) AS balance8,
        COALESCE(SUM(cr9-db9), 0) AS balance9,
        COALESCE(SUM(cr10-db10), 0) AS balance10,
        COALESCE(SUM(cr11-db11), 0) AS balance11,
        COALESCE(SUM(cr12-db12), 0) AS balance12
    FROM acc_value a
    INNER JOIN account b ON a.id_account=b.id
    WHERE (b.code LIKE '4%' OR b.code LIKE '8%')
    `;

        if (tahun != undefined && tahun != null) {
            // const date = new Date(tahun);
            // const year = date.getFullYear();
            query += ` AND a.years = '${tahun}' `;
        }

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data total pendapatan",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const indexTarget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tahun, kantor } = req.query;
        let query = ` SELECT 
        SUM(p1) AS p1, 
        SUM(p2) AS p2, 
        SUM(p3) AS p3, 
        SUM(p4) AS p4, 
        SUM(p5) AS p5, 
        SUM(p6) AS p6, 
        SUM(p7) AS p7, 
        SUM(p8) AS p8, 
        SUM(p9) AS p9, 
        SUM(p10) AS p10, 
        SUM(p11) AS p11, 
        SUM(p12) AS p12
        FROM target WHERE true
        `;

        if (tahun != undefined && tahun != null) {
            // const date = new Date(tahun);
            // const year = date.getFullYear();
            query += ` AND tahun = ${tahun} `;
        }

        if (kantor != undefined && kantor != "" && kantor != null) {
            query += ` AND id_kantor = ${kantor} `;
        }

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data target",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const totalHutang = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query = `SELECT sum(amount-pay) FROM acc_ap_faktur `;

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data total hutang",
            data: data[0] || null,
        });
    } catch (error) {
        next(error);
    }
};

export const totalPiutang = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query = `SELECT sum(amount-pay) FROM acc_ar_faktur `;

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data total hutang",
            data: data[0] || null,
        });
    } catch (error) {
        next(error);
    }
};

export const produkTerlaris = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tahun } = req.query;
        let query = `SELECT SUM(a.qty) as total, a.id_barang, b.nama_barang FROM invoice_detail a
        INNER JOIN barang b ON a.id_barang=b.id
        INNER JOIN invoice c ON c.id=a.id
         `;

        if (tahun != undefined && tahun != null) {
            query += ` WHERE EXTRACT(year FROM c.tanggal)=${tahun} `;
        }

        query += ` GROUP BY a.id_barang, b.nama_barang ORDER BY total DESC LIMIT 10 `;

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data produk terlaris",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const totalBeban = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tahun } = req.query;
        let query = `SELECT
        COALESCE(SUM(db1-cr1), 0) AS balance1,
        COALESCE(SUM(db2-cr2), 0) AS balance2,
        COALESCE(SUM(db3-cr3), 0) AS balance3,
        COALESCE(SUM(db4-cr4), 0) AS balance4,
        COALESCE(SUM(db5-cr5), 0) AS balance5,
        COALESCE(SUM(db6-cr6), 0) AS balance6,
        COALESCE(SUM(db7-cr7), 0) AS balance7,
        COALESCE(SUM(db8-cr8), 0) AS balance8,
        COALESCE(SUM(db9-cr9), 0) AS balance9,
        COALESCE(SUM(db10-cr10), 0) AS balance10,
        COALESCE(SUM(db11-cr11), 0) AS balance11,
        COALESCE(SUM(db12-cr12), 0) AS balance12
    FROM acc_value a
    INNER JOIN account b ON a.id_account=b.id
    WHERE (b.code LIKE '5%' OR b.code LIKE '6%' OR b.code LIKE '9%') 
    `;

        if (tahun != undefined && tahun != null) {
            // const date = new Date(tahun);
            // const year = date.getFullYear();
            query += ` AND a.years = '${tahun}' `;
        }

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data total beban",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

export const totalCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query = ` SELECT count(*) as total FROM kontak WHERE is_customer=TRUE `;

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data total customer",
            data: data[0] || null,
        });
    } catch (error) {
        next(error);
    }
};

export const totalProduk = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query = `SELECT count(*) as total FROM barang `;

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data total barang",
            data: data[0] || null,
        });
    } catch (error) {
        next(error);
    }
};

export const totalUang = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let query = `SELECT
        SUM(db13-cr13) AS total_balance
    FROM acc_value a
    INNER JOIN account b ON a.id_account = b.id
    WHERE b.code LIKE '1001%'
    `;

        let dataQuery = db.execute(sql.raw(query));

        const data = await dataQuery;
        res.status(200).json({
            message: "Success get data total beban",
            data: data[0],
        });
    } catch (error) {
        next(error);
    }
};
