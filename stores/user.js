// store/user.ts
import { useAbilityStore } from "./ability";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        id: null,
        usernamenya: null,
        email: null,
        nama: null,
        jabatan: null,
        iat: null,
        isLogedIn: false,
        id_departemen: null,
        fotonya: null,
        pegawai: null,
        permission: [],
    }),
    actions: {
        setUser(user) {
            this.id = user.id;
            this.usernamenya = user.usernamenya;
            this.email = user.email;
            this.nama = user.nama;
            this.iat = user.iat;
            this.isLogedIn = true;
            this.fotonya = user.fotonya;
            this.pegawai = user.pegawai;
            this.id_departemen = user.id_departemen;
            this.jabatan = user.jabatan;
        },
        clearUser() {
            this.id = null;
            this.usernamenya = null;
            this.email = null;
            this.nama = null;
            this.jabatan = null;
            this.iat = null;
            this.isLogedIn = false;
            this.fotonya = null;
            this.id_departemen = null;
            this.pegawai = null;
            this.permission = [];
        },
        setFotonya(foto) {
            this.fotonya = foto;
        },
        setPermission(permission) {
            this.permission = permission;
        },
        async checkAuth() {
            const { user, permission } = await $fetch('/api/auth/check', {
                method: 'POST',
            });
            this.setUser(user);
            this.setPermission(permission);
            const abilityStore = useAbilityStore()
            abilityStore.updatePermission(permission.split(','))
            return { user, permission };
        },
        async logOut() {
            return await $fetch('/api/auth/logout', {
                method: 'POST',
            }).then(() => {
                this.clearUser();
            });
        },
    },
});
