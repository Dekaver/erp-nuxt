import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { jabatan } from "../jabatan/schema";
import { pegawai } from "../pegawai/schema";
import { pengguna, Pengguna, NewPengguna, UpdatePengguna, penggunaColumns } from "./schema";
import { role } from "../role/schema";
import db from "../../../libs/db";

export const getPengguna = async () => {
    const data = await db
        .select({
            usernamenya: pengguna.usernamenya,
            // passwordnya: pengguna.passwordnya,
            dibuat: pengguna.dibuat,
            loginterakhir: pengguna.loginterakhir,
            enabled: pengguna.enabled,
            jmlogin: pengguna.jmlogin,
            loginterbaru: pengguna.loginterbaru,
            role: pengguna.role,
            pinnya: pengguna.pinnya,
            id_pegawai: pengguna.id_pegawai,
            nama: pegawai.nama,
            jabatan: jabatan.jabatan,
        })
        .from(pengguna)
        .leftJoin(pegawai, eq(pengguna.id_pegawai, pegawai.id))
        .leftJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id));
    return data;
};

export const getPenggunaByUsernamenya = async (params: Pengguna["usernamenya"]) => {
    const data = await db.select().from(pengguna).where(eq(pengguna.usernamenya, params));
    return data[0];
};

export const getMyPengguna = async (id: Pengguna["id_pegawai"], tx=db) => {
    const [data] = await tx
        .select({
            usernamenya: pengguna.usernamenya,
            email: pegawai.email,
            id: pegawai.id,
            nama: pegawai.nama,
            fotonya: pegawai.fotonya,
            id_role: pengguna.role,
            role: role.role,
            jabatan: jabatan.jabatan,
        })
        .from(pengguna)
        .innerJoin(pegawai, eq(pengguna.id_pegawai, pegawai.id))
        .innerJoin(jabatan, eq(jabatan.id, pegawai.id_jabatan))
        .innerJoin(role, eq(pengguna.role, role.id))
        .where(eq(pengguna.id_pegawai, id));
    return data;
};

export const createPengguna = async (params: NewPengguna) => {
    const data = await db.insert(pengguna).values(params).returning();
    return data[0];
};

export const updatePengguna = async (params: UpdatePengguna["usernamenya"], form: UpdatePengguna) => {
    const data = await db.update(pengguna).set(form).where(eq(pengguna.usernamenya, params)).returning();
    return data[0];
};

export const deletePengguna = async (params: Pengguna["usernamenya"]) => {
    const data = await db.delete(pengguna).where(eq(pengguna.usernamenya, params)).returning();
    return data[0];
};

export const updatePassword = async (params: Pengguna["id_pegawai"], oldPassword: Pengguna["passwordnya"], newPassword: Pengguna["passwordnya"], tx = db) => {
    return tx.transaction(async (tx) => {
        const [check] = await tx.select().from(pengguna).where(eq(pengguna.id_pegawai, params!));
        const match = await bcrypt.compare(oldPassword, check.passwordnya);
        if (!match) {
            throw new Error("Password salah"); // Adjust based on your error handling strategy
        }
        const newHashedPassword = bcrypt.hashSync(newPassword, 10);
        const [data] = await tx
            .update(pengguna)
            .set({
                passwordnya: newHashedPassword,
            })
            .where(eq(pengguna.id_pegawai, params!))
            .returning();
        return data;
    });
};
