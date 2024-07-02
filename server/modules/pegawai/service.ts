import { SQL, and, eq, getTableColumns, ilike, inArray, is, isNotNull, isNull, ne, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { agama } from "../agama/schema";
import { departemen } from "../departemen/schema";
import { provinces, cities, districts } from "../indo/schema";
import { jabatan } from "../jabatan/schema";
import { pengguna } from "../pengguna/schema";
import { role } from "../role/schema";
import { pegawai, Pegawai, NewPegawai, pegawaiColumns } from "./schema";
import { PegawaiKas, PegawaiKasColumns, pegawaiKas } from "./kas/schema";
import db from "../../../libs/db";
import { ValidationError } from "../../../libs/errors";

export const getPegawai = async (params: any, tx = db) => {
    const atasan = alias(pegawai, "atasan");
    const provinsi_ktp = alias(provinces, "provinsi_ktp");
    const kabupaten_ktp = alias(cities, "kabupaten_ktp");
    const kecamatan_ktp = alias(districts, "kecamatan_ktp");
    const provinsi_domisili = alias(provinces, "provinsi_domisili");
    const kabupaten_domisili = alias(cities, "kabupaten_domisili");
    const kecamatan_domisili = alias(districts, "kecamatan_domisili");
    const query = tx
        .select({
            ...pegawaiColumns,
            jabatan: jabatan.jabatan,
            departemen: departemen.departemen,
            agama: agama.agama,
            provinsi_ktp_nama: provinsi_ktp.prov_name,
            kabupaten_ktp_nama: kabupaten_ktp.city_name,
            kecamatan_ktp_nama: kecamatan_ktp.dis_name,
            provinsi_domisili_nama: provinsi_domisili.prov_name,
            kabupaten_domisili_nama: kabupaten_domisili.city_name,
            kecamatan_domisili_nama: kecamatan_domisili.dis_name,
            nama_atasan_langsung: atasan.nama,
        })
        .from(pegawai)
        .leftJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id))
        .leftJoin(departemen, eq(pegawai.id_departemen, departemen.id))
        .leftJoin(agama, eq(pegawai.id_agama, agama.id))
        .leftJoin(provinsi_ktp, eq(pegawai.provinsi_ktp, provinsi_ktp.prov_id))
        .leftJoin(kabupaten_ktp, eq(pegawai.kabupaten_ktp, kabupaten_ktp.city_id))
        .leftJoin(kecamatan_ktp, eq(pegawai.kecamatan_ktp, kecamatan_ktp.dis_id))
        .leftJoin(provinsi_domisili, eq(pegawai.provinsi_domisili, provinsi_domisili.prov_id))
        .leftJoin(kabupaten_domisili, eq(pegawai.kabupaten_domisili, kabupaten_domisili.city_id))
        .leftJoin(kecamatan_domisili, eq(pegawai.kecamatan_domisili, kecamatan_domisili.dis_id))
        .leftJoin(atasan, eq(pegawai.atasan_langsung, atasan.id));

    const condition: SQL[] = [];
    const search: SQL[] = [];

    if (params.search) {
        search.push(ilike(pegawai.nama, `%${params.search}%`));
    }
    if (params.customPegawai) {
        switch (params.customPegawai) {
            case "signature":
                condition.push(inArray(pegawai.id, [1, 2]));
                break;
            case "cost-control":
                condition.push(inArray(pegawai.id, [31, 34]));
                break;
            default:
                break;
        }
    }

    const data = await query
        .where(and(...condition, or(...search)))
        .orderBy(pegawai.nama)
        .limit(params.limit);

    return data;
};

export const getPegawaiById = async (params: Pegawai["id"], tx = db) => {
    const provinsi_ktp = alias(provinces, "provinsi_ktp");
    const kabupaten_ktp = alias(cities, "kabupaten_ktp");
    const kecamatan_ktp = alias(districts, "kecamatan_ktp");
    const provinsi_domisili = alias(provinces, "provinsi_domisili");
    const kabupaten_domisili = alias(cities, "kabupaten_domisili");
    const kecamatan_domisili = alias(districts, "kecamatan_domisili");
    const pegawaiColumns = getTableColumns(pegawai);
    const data = await tx
        .select({
            ...pegawaiColumns,
            jabatan: jabatan.jabatan,
            departemen: departemen.departemen,
            agama: agama.agama,
            provinsi_ktp_nama: provinsi_ktp.prov_name,
            kabupaten_ktp_nama: kabupaten_ktp.city_name,
            kecamatan_ktp_nama: kecamatan_ktp.dis_name,
            provinsi_domisili_nama: provinsi_domisili.prov_name,
            kabupaten_domisili_nama: kabupaten_domisili.city_name,
            kecamatan_domisili_nama: kecamatan_domisili.dis_name,
            username: pengguna.usernamenya,
            login_terakhir: pengguna.loginterakhir,
            role: role.role,
        })
        .from(pegawai)
        .leftJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id))
        .leftJoin(departemen, eq(pegawai.id_departemen, departemen.id))
        .leftJoin(agama, eq(pegawai.id_agama, agama.id))
        .leftJoin(provinsi_ktp, eq(pegawai.provinsi_ktp, provinsi_ktp.prov_id))
        .leftJoin(kabupaten_ktp, eq(pegawai.kabupaten_ktp, kabupaten_ktp.city_id))
        .leftJoin(kecamatan_ktp, eq(pegawai.kecamatan_ktp, kecamatan_ktp.dis_id))
        .leftJoin(provinsi_domisili, eq(pegawai.provinsi_domisili, provinsi_domisili.prov_id))
        .leftJoin(kabupaten_domisili, eq(pegawai.kabupaten_domisili, kabupaten_domisili.city_id))
        .leftJoin(kecamatan_domisili, eq(pegawai.kecamatan_domisili, kecamatan_domisili.dis_id))
        .leftJoin(pengguna, eq(pegawai.id, pengguna.id_pegawai))
        .leftJoin(role, eq(pengguna.role, role.id))
        .where(eq(pegawai.id, params));
    return data[0];
};

export const getOnePegawaiKas = async (params: PegawaiKas["id_pegawai"], tx = db) => {
    const [data] = await tx
        .select({
            ...PegawaiKasColumns,
        })
        .from(pegawaiKas)
        .where(eq(pegawaiKas.id_pegawai, params))
        .limit(1);
    return data;
};

export const getOptionPegawai = async (tx = db) => {
    const data = await tx
        .select({
            id: pegawai.id,
            nama: pegawai.nama,
            jabatan: pegawai.id_jabatan,
            departemen: pegawai.id_departemen,
        })
        .from(pegawai)
        .where(eq(pegawai.status, true));
    return data;
};

export const getAvailablePegawai = async (tx = db) => {
    const data = await tx
        .select({
            id_pegawai: pegawai.id,
            nama: pegawai.nama,
            jabatan: jabatan.jabatan,
        })
        .from(pegawai)
        .leftJoin(pengguna, eq(pegawai.id, pengguna.id_pegawai))
        .leftJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id))
        .where(isNull(pengguna.id_pegawai));
    return data;
};

export const getPegawaiByIdJabatan = async (id_jabatan: Pegawai["id_jabatan"], tx = db) => {
    return await tx
        .select({
            ...pegawaiColumns,
            jabatan: jabatan.jabatan,
        })
        .from(pegawai)
        .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .where(eq(pegawai.id_jabatan, id_jabatan as number));
};

export const getPegawaiHeadDepartemen = async (id: Pegawai["id"], tx = db) => {
    const dataPegawai = await getPegawaiById(id, tx);
    if (dataPegawai.id_departemen == null) {
        throw ValidationError("Pegawai ini belum ada di departemen apapun");
    }
    const lPegawai = await tx
        .select({
            ...pegawaiColumns,
            is_head_departemen: jabatan.is_head_departemen,
            departemen: departemen.departemen,
        })
        .from(pegawai)
        .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .innerJoin(departemen, eq(departemen.id, pegawai.id_departemen))
        .where(and(eq(pegawai.id_departemen, dataPegawai.id_departemen), eq(jabatan.is_head_departemen, true)));
    // TODO: head departemen harus 1
    return lPegawai;
};

export const createPegawai = async (form: NewPegawai, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [check] = await trx
            .select({
                id_pegawai: pegawai.id,
            })
            .from(pegawai)
            .where(or(eq(pegawai.nip, form.nip as string)));
        if (check) {
            throw ValidationError("NIP atau NIK KTP sudah harus unik");
        }
        const [data] = await trx.insert(pegawai).values(form).returning();
        return data;
    });
    return data;
};

export const updatePegawai = async (params: NewPegawai["id"], form: NewPegawai, tx = db) => {
    const data = await tx.transaction(async (trx) => {
        const [check] = await trx
            .select({
                id_pegawai: pegawai.id,
            })
            .from(pegawai)
            .where(and(ne(pegawai.id, params as number), or(eq(pegawai.nip, form.nip as string), eq(pegawai.nik_ktp, form.nik_ktp as string))));
        if (check) {
            throw ValidationError("NIP atau NIK KTP sudah harus unik");
        }
        const [data] = await trx
            .update(pegawai)
            .set(form)
            .where(eq(pegawai.id, params as number))
            .returning();
        return data;
    });
    return data;
};

export const deletePegawai = async (params: Pegawai["id"], tx = db) => {
    const data = await tx.transaction(async (tx) => {
        const [check] = await tx
            .select({
                id_pegawai: pengguna.id_pegawai,
            })
            .from(pengguna)
            .where(eq(pengguna.id_pegawai, params));
        if (check) {
            throw ValidationError("Pegawai sudah terdaftar sebagai pengguna");
        }
        const [data] = await tx.delete(pegawai).where(eq(pegawai.id, params)).returning();
        return data;
    });
    return data;
};

export const updateFotoPegawai = async (foto: Pegawai["fotonya"], params: Pegawai["id"], tx = db) => {
    const [data] = await tx
        .update(pegawai)
        .set({
            fotonya: foto,
        })
        .where(eq(pegawai.id, params))
        .returning();
    return data;
};

export const getFotoPegawai = async (params: Pegawai["id"], tx = db) => {
    const [data] = await tx
        .select({
            fotonya: pegawai.fotonya,
        })
        .from(pegawai)
        .where(eq(pegawai.id, params));
    return data;
};

export const updateTTDPegawai = async (foto: Pegawai["fotonya"], params: Pegawai["id"], tx = db) => {
    const [data] = await tx
        .update(pegawai)
        .set({
            ttd: foto,
        })
        .where(eq(pegawai.id, params))
        .returning();
    return data;
};

export const getTTDPegawai = async (params: Pegawai["id"], tx = db) => {
    const [data] = await tx
        .select({
            ttd: pegawai.ttd,
        })
        .from(pegawai)
        .where(eq(pegawai.id, params));
    return data;
};
