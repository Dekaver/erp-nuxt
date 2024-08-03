import { sql, eq, and, SQL, gt, asc, lte } from "drizzle-orm";

import { stok_barang, StokBarang, NewStokBarang, UpdateStokBarang } from "./schema";
import { ValidationError } from "../../../libs/errors";
import { getBarangById } from "../../barang/service";
import { updateStokValue } from "../stok_value/service";
import { barang, barangColumns } from "../../barang/schema";

export const getStokBarang = async (option?: any, tx = db) => {
    const data = tx
        .select({
            ...barangColumns,
            jumlah_stok: sql<number>`COALESCE(b.total, 0)`.as("jumlah_stok"),
        })
        .from(barang)
        .leftJoin(sql`(SELECT id_barang, SUM(stok) as total FROM stok_barang GROUP BY id_barang) as b`, eq(sql`b.id_barang`, barang.id));
    const where: SQL[] = [];
    if (option.id_kategori) {
        where.push(eq(barang.id_kategori, option.id_kategori));
    }
    return await data.orderBy(barang.nama_barang);
};

export const getTotalStokBarangByIdBarang = async (id: StokBarang["id_barang"], id_gudang: StokBarang["id_gudang"], tx = db) => {
    const [data] = await tx
        .select({
            total: sql<number>`SUM(stok_barang.stok)`,
        })
        .from(stok_barang)
        .where(and(eq(stok_barang.id_barang, id), eq(stok_barang.id_gudang, id_gudang)));

    return data?.total || 0;
};

export const getHPPByIdBarang = async (params: { id_barang: StokBarang["id_barang"]; id_gudang: StokBarang["id_gudang"]; tanggal?: StokBarang["tanggal"] }, tx = db) => {
    const where: SQL[] = [];
    if (params.tanggal) {
        where.push(lte(stok_barang.tanggal, params.tanggal));
    }
    where.push(eq(stok_barang.id_barang, params.id_barang));
    where.push(eq(stok_barang.id_gudang, params.id_gudang));
    const [data] = await tx
        .select({
            hpp: stok_barang.hpp,
        })
        .from(stok_barang)
        .where(and(...where))
        .limit(1);

    return data?.hpp || "0";
};

export const getQtyAvailability = async (qty: number, id_barang: number, id_satuan: number, id_gudang: number, tx = db) => {
    const [data] = await tx.execute(sql`
        SELECT 
          CASE WHEN COALESCE(${qty}/konversi, 0) <= COALESCE(stok, 0) THEN true
          ELSE false
          END as is_available_qty,
          COALESCE(stok,0) as sisa_stok,
          id_satuan_kiri,
          COALESCE(${qty}/konversi, 0) as qty_konversi,
          satuan
        FROM (
          SELECT a.id_barang, b.id_satuan as id_satuan_kiri, a.konversi, a.id_satuan as id_satuan_kanan 
          FROM barang_satuan a 
            JOIN barang b on b.id = a.id_barang 
          UNION ALL
          SELECT a.id as id_barang, a.id_satuan as id_satuan_kiri, 1 as konversi, a.id_satuan as id_sautan_kanan
          FROM barang a
        ) a 
        LEFT JOIN (
          SELECT sum(a.stok) as stok, id_barang , id_gudang FROM stok_barang a 
          INNER JOIN barang b ON a.id_barang=b.id 
          WHERE a.id_gudang=${id_gudang} AND a.id_barang=${id_barang}
          GROUP BY id_barang, id_gudang
        ) b on a.id_barang = b.id_barang
            AND b.id_gudang = ${id_gudang}
        LEFT JOIN satuan ON a.id_satuan_kiri=satuan.id 
        WHERE a.id_barang = ${id_barang} AND id_satuan_kanan = ${id_satuan};
  `);
    return data;
};

export const getStokBarangById = async (id: StokBarang["id"], tx = db) => {
    const [data] = await tx.select().from(stok_barang).where(eq(stok_barang.id, id));
    return data;
};

export const getStokBarangByIdBarang = async (id_barang: StokBarang["id_barang"], id_gudang: StokBarang["id_gudang"], tx = db) => {
    const data = await tx
        .select()
        .from(stok_barang)
        .where(and(eq(stok_barang.id_barang, id_barang), gt(stok_barang.stok, "0"), eq(stok_barang.id_gudang, id_gudang)));
    return data;
};

export const createStokBarang = async (form: NewStokBarang, tx = db) => {
    const [data] = await tx.insert(stok_barang).values(form).returning();
    return data;
};

export const updateStokBarang = async (id: number, qty: number, tx = db) => {
    const [data]: StokBarang[] = await tx.execute(sql`UPDATE stok_barang  SET stok=stok+${qty} WHERE id=${id} returning stok_barang.*`);
    return data;
};

export const deleteStokBarang = async (id: StokBarang["id"], tx = db) => {
    const [data] = await tx.delete(stok_barang).where(eq(stok_barang.id, id)).returning();
    return data;
};

export const deleteStokBarangByReff = async (id_reff: StokBarang["id_reff"], reff: StokBarang["reff"], tx = db) => {
    const [check] = await tx
        .select()
        .from(stok_barang)
        .where(and(eq(stok_barang.reff, reff), eq(stok_barang.id_reff, id_reff)));
    if (!check) return;
    if (check.stok != check.stok_awal) {
        throw ValidationError("STOK BARANG Telah digunakan, tidak dapat di ubah");
    }
    const [data] = await tx
        .delete(stok_barang)
        .where(and(eq(stok_barang.reff, reff), eq(stok_barang.id_reff, id_reff)))
        .returning();
    return data;
};

export const tambahStokBarang = async (form: NewStokBarang[], tx = db) => {
    const data = await tx.transaction(async (tx) => {
        return await Promise.all(
            form.map(async (detail) => {
                try {
                    // Check if barang is_stok
                    const barang = await getBarangById(detail.id_barang, tx);

                    // If barang is_stok is false, then return (do nothing)
                    if (barang.is_stok == false) {
                        return;
                    }

                    await createStokBarang(detail, tx);

                    await updateStokValue(detail.tanggal, detail.id_gudang, detail.id_barang, detail.stok, tx);
                } catch (error) {
                    console.error(error);
                    throw ValidationError("Gagal silahkan hubungi admin");
                }
            }),
        );
    });
    return data;
};

export const getHistoryStok = async (id_barang: any, id_gudang: any, bulan: any, tahun: any) => {
    // Ensure that 'bulan' is two digits
    const pad_bulan = String(bulan).padStart(2, "0");
    // Function to generate the expression for "Diterima"
    function generateDiterimaExpression(bulan: any) {
        // Initialize the expression with the first month's "db" value
        let expression = "a.db0";

        // Add the "db" values for the previous months
        for (let i = 1; i < bulan; i++) {
            expression += ` + a.db${i}`;
        }

        // Subtract the "cr" values for the previous months
        for (let i = 0; i < bulan; i++) {
            expression += ` - a.cr${i}`;
        }

        return expression;
    }

    let queryBarang = `SELECT a.*,b.satuan, c.kategori_barang FROM barang a 
                      INNER JOIN satuan b ON b.id=a.id_satuan
                      INNER JOIN kategori_barang c ON c.id=a.id_kategori
                      WHERE a.id=${id_barang}`;

    let query = `
  SELECT
    jenis,
    tanggal,
    keterangan,
    id_barang,
    nomor,
    COALESCE(jumlah_penerimaan, 0) AS jumlah_penerimaan,
    COALESCE(jumlah_pengeluaran, 0) AS jumlah_pengeluaran
FROM
    (
        SELECT
            '${tahun}-${pad_bulan}-1' :: date as tanggal, 
            default_values.id_barang, 
            SUM(
                ${generateDiterimaExpression(bulan)}
            ) as jumlah_penerimaan,
            NULL::numeric AS jumlah_pengeluaran,
            'Stok Awal' as jenis,
            NULL AS nomor,
            'Saldo Awal' as keterangan
        FROM
            (
                SELECT
                    DISTINCT id AS id_barang,
                    NULL AS jumlah_pengeluaran
                FROM
                    barang
            ) AS default_values
            LEFT JOIN stok_value a ON default_values.id_barang = a.id_barang
        WHERE a.id_gudang=${id_gudang}
        GROUP BY
            tanggal,
            default_values.id_barang,
            jenis,
            nomor
        UNION ALL
        SELECT
            a.tanggal,
            b.id_barang,
            b.diambil AS jumlah_penerimaan,
            NULL::numeric AS jumlah_pengeluaran,
            'Penerimaan' as jenis,
            a.nomor,
            c.kontak AS keterangan
        FROM
            penerimaan_barang a
            INNER JOIN penerimaan_barang_detail b ON a.id = b.id
            INNER JOIN kontak c ON a.id_supplier = c.id
        WHERE
            a.status = 'C'  AND a.id_gudang=${id_gudang}
        UNION ALL
                SELECT
            a.tanggal,
            b.id_barang,
            NULL::numeric AS jumlah_penerimaan,
            b.qty AS jumlah_pengeluaran,
            'Invoice' AS jenis,
            a.nomor,
            a.keterangan AS keterangan
        FROM
            invoice a
            INNER JOIN invoice_detail b ON a.id = b.id 
        WHERE
            a.id NOT IN (
                SELECT aa.id_invoice
                FROM invoice_delivery_order aa
                WHERE a.id = aa.id_invoice
            ) AND a.id_gudang=${id_gudang}
        UNION ALL
            SELECT
            a.tanggal,
            b.id_barang,
            b.qty AS jumlah_penerimaan,
            NULL::numeric AS jumlah_pengeluaran,
            'AP' AS jenis,
            a.nomor,
            a.keterangan AS keterangan
        FROM
            ap a
            INNER JOIN ap_detail b ON a.id = b.id 
        WHERE a.id_pp is null and
            a.id_po is null AND a.id_gudang=${id_gudang}
        UNION ALL
        SELECT
            a.tanggal,
            b.id_barang,
            NULL::numeric AS jumlah_penerimaan,
            b.qty AS jumlah_pengeluaran,
            'Pengeluaran' as jenis,
            a.nomor,
            c.kontak as keterangan
        FROM
            delivery_order a
            INNER JOIN delivery_order_detail b ON a.id = b.id
            INNER JOIN kontak c ON a.id_customer = c.id
        WHERE
            a.status = 'C' AND a.id_gudang=${id_gudang}
    ) AS s
WHERE
    s.id_barang = ${id_barang}
    AND EXTRACT(MONTH FROM s.tanggal) = ${bulan}
    AND EXTRACT(YEAR FROM s.tanggal) = ${tahun}
ORDER BY
    CASE
        WHEN s.jenis = 'Stok Awal' THEN 0
        WHEN s.jenis = 'Penerimaan' THEN 1
        WHEN s.jenis = 'Pengeluaran' THEN 2
        ELSE 6
    END,
    tanggal,
    nomor,
    id_barang,
    jumlah_penerimaan DESC NULLS LAST,
    jumlah_pengeluaran ASC NULLS LAST`;

    const [data] = await db.execute(sql.raw(`${queryBarang}`));
    const dataDetail = await db.execute(sql.raw(`${query}`));

    if (!data) {
        throw ValidationError("Data tidak ditemukan");
    }

    return { ...data, detail: dataDetail };
};

export const kurangStokBarang = async (form: UpdateStokBarang[], metode: "FIFO", tx = db) => {
    return await tx.transaction(async (tx) => {
        const lHPP: any[] = [];
        for (const item of form) {
            const [dataBarang] = await tx.select().from(barang).where(eq(barang.id, item.id_barang));

            if (!dataBarang.is_stok) {
                return;
            }

            // ambil stok barang dari gudang
            const jumlah_stok = await getTotalStokBarangByIdBarang(item.id_barang, item.id_gudang, tx);

            // cek stok apakah mencukupi untuk dipakai
            if (jumlah_stok < parseFloat(item.stok)) {
                throw ValidationError(`Stok ${dataBarang.nama_barang} tidak mencukupi, tersisa ${jumlah_stok}`);
            }
            const orderQuery: SQL[] = [];
            switch (metode) {
                case "FIFO":
                    orderQuery.push(asc(stok_barang.tanggal), asc(stok_barang.id));
                    break;

                default:
                    break;
            }
            let qty = parseFloat(item.stok);

            while (qty > 0) {
                let tempqty = qty;
                //ambil stok barang terbaru
                const [dataStokBarang] = await tx
                    .select()
                    .from(stok_barang)
                    .where(and(eq(stok_barang.id_gudang, item.id_gudang), eq(stok_barang.id_barang, item.id_barang), sql`stok > 0`))
                    .orderBy(...orderQuery)
                    .limit(1);

                // cek qty_diambil lebih besar dari qty stok
                if (qty >= parseFloat(dataStokBarang.stok)) {
                    qty = qty - parseFloat(dataStokBarang.stok);
                    tempqty = parseFloat(dataStokBarang.stok);
                    // kurangi stok sesuai dengan jumlah stok
                    await tx
                        .update(stok_barang)
                        .set({
                            stok: sql`stok_barang.stok - ${dataStokBarang.stok}`,
                        })
                        .where(and(eq(stok_barang.id_gudang, item.id_gudang), eq(stok_barang.id_barang, item.id_barang), eq(stok_barang.id, dataStokBarang.id)));
                } else {
                    // kurangi stok sesuai dengan jumlah diterima
                    await tx
                        .update(stok_barang)
                        .set({
                            stok: sql`stok_barang.stok - ${qty}`,
                        })
                        .where(and(eq(stok_barang.id_gudang, item.id_gudang), eq(stok_barang.id_barang, item.id_barang), eq(stok_barang.id, dataStokBarang.id)));
                    tempqty = qty;

                    qty = qty - parseFloat(dataStokBarang.stok);
                }

                lHPP.push({
                    id_barang: item.id_barang,
                    id_stok: dataStokBarang.id,
                    hpp: dataStokBarang.hpp,
                    nama_barang: dataBarang.nama_barang,
                    qty: tempqty,
                });
            }
            await updateStokValue(item.tanggal, item.id_gudang, item.id_barang, (parseFloat(item.stok) * -1).toString(), tx);
        }

        return lHPP;
    });
};
