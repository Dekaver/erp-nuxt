import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { pengguna, Pengguna, NewPengguna, UpdatePengguna } from './schema';
import { ValidationError } from '../../../libs/errors';
import { pegawai } from '../pegawai/schema';
import { jabatan } from '../jabatan/schema';

export const getPengguna = async () => {
    const data = await db
        .select({
            id: pengguna.id,
			id_pegawai: pengguna.id_pegawai,
			email: pegawai.email,
            nama: pegawai.nama,
            usernamenya: pengguna.usernamenya,
			jabatan: jabatan.jabatan,
            dibuat: pengguna.dibuat,
            loginterakhir: pengguna.loginterakhir,
            enabled: pengguna.enabled,
            jmlogin: pengguna.jmlogin,
            loginterbaru: pengguna.loginterbaru,
        })
        .from(pengguna)
        .leftJoin(pegawai, eq(pengguna.id_pegawai, pegawai.id))
		.leftJoin(jabatan, eq(pegawai.id_jabatan, jabatan.id));
    return data;
};

export const getPenggunaById = async (params: Pengguna['id']) => {
    const [data] = await db.select().from(pengguna).where(eq(pengguna.id, params));
    return data;
};

export const createPengguna = async (params: NewPengguna) => {
    const [data] = await db.insert(pengguna).values(params).returning();
    return data;
};

export const updatePengguna = async (params: Pengguna['id'], form: UpdatePengguna) => {
    const [data] = await db.update(pengguna).set(form).where(eq(pengguna.id, params)).returning();
    return data;
};

export const deletePengguna = async (params: Pengguna['id']) => {
    const [data] = await db.delete(pengguna).where(eq(pengguna.id, params)).returning();
    return data;
};

export const updatePassword = async (params: Pengguna['id_pegawai'], oldPassword: Pengguna['passwordnya'], newPassword: Pengguna['passwordnya'], tx = db) => {
    return tx.transaction(async (tx) => {
        const [check] = await tx.select().from(pengguna).where(eq(pengguna.id_pegawai, params!));

        if (!bcrypt.compareSync(oldPassword, check.passwordnya)) {
            throw ValidationError('Password Lama salah');
        }
        if (bcrypt.compareSync(newPassword, check.passwordnya)) {
            throw ValidationError('Password baru tidak boleh sama dengan password lama');
        }
        const [data] = await tx
            .update(pengguna)
            .set({
                passwordnya: bcrypt.hashSync(newPassword, 10),
            })
            .where(eq(pengguna.id_pegawai, params!))
            .returning();
        return data;
    });
};
