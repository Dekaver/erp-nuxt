import { and, eq, exists, inArray, notExists, SQL, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { NotFoundError, ValidationError } from "../../libs/errors";
import { moduleNumberGenerator } from "../../libs/nomor";
import { barang } from "../barang/schema";
import { gudang } from "../gudang/schema";
import { jabatan } from "../jabatan/schema";
import { kontak } from "../kontak/schema";
import { Pegawai, pegawai } from "../pegawai/schema";
import { getPegawaiById, getPegawaiByIdJabatan, getPegawaiHeadDepartemen } from "../pegawai/service";
import { sales_order } from "../sales_order/schema";
import { satuan } from "../satuan/schema";
import { jabatanPersetujuanStrings, persetujuanStrings } from "../schema";
import { top } from "../top/schema";
import { quotation_detail, quotationDetailColumns } from "./detail/schema";
import { QuotationPersetujuan } from "./persetujuan/schema";
import { createQuotationPersetujuan, getQuotationPersetujuanByPegawai } from "./persetujuan/service";
import { NewQuotation, quotation, Quotation, quotationColumns, UpdateQuotation } from "./schema";
import { getQuotationSettings } from "./setting/service";

export const nomorQuotation = async (tanggal: string, tx = db) => {
    return await moduleNumberGenerator("quotation", "nomor", "tanggal", "Q", tanggal, tx);
};

export const getQuotation = async (params: any) => {
    let status = params.status;
    let query = `SELECT a.*, b.nama as created_name, c.nama as modified_name, d.name as created_jabatan, e.name as modified_jabatan, f.kontak as customer
                    FROM quotation a 
                        LEFT JOIN hr.pegawai b ON b.id=a.created_by 
                        LEFT JOIN hr.pegawai c ON c.id=a.updated_by 
                        LEFT JOIN hr.jabatan d ON d.id=b.id_jabatan 
                        LEFT JOIN hr.jabatan e ON e.id=c.id_jabatan 
                        LEFT JOIN hr.pegawai g ON g.id=a.id_salesman
						            LEFT JOIN kontak f ON f.id=a.id_customer 
                WHERE true `;
    if (status !== null && status !== undefined) {
        if (typeof status === "string") {
            query += ` AND a.status='${status}' `;
        } else if (Array.isArray(status)) {
            const statusValues = status.map((s) => `'${s}'`).join(", ");
            query += ` AND a.status IN (${statusValues}) `;
        }
    }
    query += ` ORDER BY a.tanggal DESC`;
    const data = await db.execute(sql.raw(query));
    return data;
};

export const getOptionQuotation = async (option: any, tx = db) => {
    const where: SQL[] = [];
    const module = option.module;
    switch (module) {
        case "sales-order":
            // TODO: salesman
            if (option?.is_so == "true") {
                return await tx
                    .select({
                        ...quotationColumns,
                        customer: kontak.kontak,
                        gudang: gudang.gudang,
                        created_name: gudang.gudang,
                        is_so: sql`true`,
                    })
                    .from(quotation)
                    .innerJoin(kontak, eq(kontak.id, quotation.id_customer))
                    .innerJoin(gudang, eq(gudang.id, quotation.id_gudang))
                    .where(and(inArray(quotation.status, ["O", "C"]), exists(tx.select().from(sales_order).where(eq(quotation.id, sales_order.id_quotation)))));
            }
            return await tx
                .select({
                    ...quotationColumns,
                    customer: kontak.kontak,
                    gudang: gudang.gudang,
                    is_so: sql`false`,
                })
                .from(quotation)
                .innerJoin(kontak, eq(kontak.id, quotation.id_customer))
                .innerJoin(gudang, eq(gudang.id, quotation.id_gudang))
                .where(and(inArray(quotation.status, ["O"]), notExists(tx.select().from(sales_order).where(eq(quotation.id, sales_order.id_quotation)))));

        default:
            break;
    }
};

export const getDataOptionForSalesOrder = async () => {
    const dataSo = await db.execute(sql`SELECT 
    a.*, 
    c.nama as pegawai, 
    b.gudang, 
    d.kontak as customer,  
    (SELECT JSON_AGG(ROW_TO_JSON(aa.*))
        FROM quotation_detail aa 
        WHERE aa.id = a.id
    ) as detail,
    EXISTS (SELECT 1 FROM sales_order bb WHERE bb.id_quotation = a.id) as is_sales_order
    FROM quotation a
    LEFT JOIN gudang b ON b.id = a.id_gudang
    LEFT JOIN hr.pegawai c ON c.id = a.id_salesman
    LEFT JOIN kontak d ON d.id = a.id_customer `);
    return dataSo;
};

export const getQuotationById = async (id: Quotation["id"], tx = db) => {
    const salesman = alias(pegawai, "salesman");

    const [data] = await tx
        .select({
            ...quotationColumns,
            customer: kontak.kontak,
            customer_alamat_tagih: kontak.alamat_penagihan,
            telepon: kontak.telepon,
            salesman: salesman.nama,
            top_keterangan: sql`(CASE 
                            WHEN top.keterangan='Custom' THEN quotation.top || ' Day'
                            ELSE top.keterangan
                        END)`.as("top_keterangan"),
            created_name: pegawai.nama,
            created_jabatan: jabatan.jabatan,
        })
        .from(quotation)
        .innerJoin(kontak, eq(kontak.id, quotation.id_customer))
        .innerJoin(salesman, eq(salesman.id, quotation.id_salesman))
        .innerJoin(pegawai, eq(pegawai.id, quotation.created_by))
        .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .innerJoin(gudang, eq(gudang.id, quotation.id_gudang))
        .innerJoin(top, eq(top.id, quotation.id_top))
        .where(eq(quotation.id, id));

    if (data == undefined) {
        throw NotFoundError("Quotation Not found ");
    }

    return data;
};

export const createQuotationPersetujuanBySetting = async (id: Quotation["id"], id_pegawai: Pegawai["id"], tx = db) => {
    const lPersetujuan: QuotationPersetujuan[] = [];
    const settingPersetujuan = await getQuotationSettings(tx);
    for (let index = 0; index < persetujuanStrings.length; index++) {
        const persetujuan = persetujuanStrings[index];
        const jabatan = jabatanPersetujuanStrings[index];
        if (settingPersetujuan[persetujuan]) {
            let dataPersetujuan;
            // ulang setiap level persetujuan
            switch (settingPersetujuan[persetujuan]) {
                case "1": // atasan langsung
                    const pegawai1 = await getPegawaiById(id_pegawai, tx);
                    if (pegawai1.atasan_langsung && pegawai1.atasan_langsung == id_pegawai) {
                        break;
                    }
                    // Persetujuan 1
                    dataPersetujuan = await createQuotationPersetujuan(id, pegawai1.atasan_langsung as number, index + 1, tx);
                    lPersetujuan.push(dataPersetujuan);
                    break;

                case "2": // head departemen
                    const pegawai2 = await getPegawaiHeadDepartemen(id_pegawai, tx);
                    if (pegawai2) {
                        const check = await getQuotationPersetujuanByPegawai(id, pegawai2.id, tx);
                        if (pegawai2.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createQuotationPersetujuan(id, pegawai2.id as number, index + 1, tx);
                        lPersetujuan.push(persetujuan);
                    } else {
                        throw ValidationError("Tidak Ada pegawai pada jabatan yang dipilih");
                    }
                    break;

                case "3": // jabatan tertentu
                    const lPegawai = await getPegawaiByIdJabatan(settingPersetujuan[jabatan], tx);
                    if (lPegawai.length > 1) {
                        throw ValidationError(`Pegawai Pada Jabatan ${lPegawai[0].jabatan} lebih dari 1`);
                    }
                    const [pegawai3] = lPegawai;
                    if (pegawai3) {
                        const check = await getQuotationPersetujuanByPegawai(id, pegawai3.id, tx);
                        if (pegawai3.id == id_pegawai || check) {
                            break;
                        }
                        const persetujuan = await createQuotationPersetujuan(id, pegawai3.id as number, index + 1, tx);
                        lPersetujuan.push(persetujuan);
                    } else {
                        throw ValidationError("Tidak Ada pegawai pada jabatan yang dipilih");
                    }
                    break;

                default:
                    break;
            }
            continue;
        }
        // jika persetujuan false hentikan loop level
        break;
    }
    return lPersetujuan;
};

export const createQuotation = async (form: NewQuotation, tx = db) => {
    const [data] = await tx.insert(quotation).values(form).returning();
    return data;
};

export const updateQuotation = async (id: Quotation["id"], form: UpdateQuotation, tx = db) => {
    const [data] = await tx
        .update(quotation)
        .set({ ...form, updated_at: sql`NOW()` })
        .where(eq(quotation.id, id))
        .returning();
    return data;
};

export const deleteQuotation = async (id: Quotation["id"], tx = db) => {
    const data = await tx.delete(quotation).where(eq(quotation.id, id)).returning();
    return data;
};

export const revisiQuotation = async (id: Quotation["id"]) => {
    try {
        const returning: any = await db.transaction(async () => {
            return returning;
        });
        return returning;
    } catch (error) {
        console.log(error);

        throw NotFoundError("error");
    }
};

export const updateStatusQuotation = async (id: Quotation["id"], status: Quotation["status"], tx = db) => {
    try {
        const [data] = await tx.update(quotation).set({ status: status }).where(eq(quotation.id, id)).returning();
        return data;
    } catch (error) {
        console.log(error);
        throw NotFoundError("error");
    }
};
