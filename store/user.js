// store/user.ts
import { defineStore } from 'pinia'
import apiAuthentication from '../pages/apiAuth'
import { useAbilityStore } from './ability'

export const useUserStore = defineStore('user', {
    state: () => ({
        id: null,
        usernamenya: null,
        email: null,
        nama: null,
        id_role: null,
        role: null,
        accessToken: null,
        jabatan: null,
        permission: [],
        pegawai: null,
        iat: null,
        isLogedIn: false,
        id_departemen: null,
        fotonya: null,
        kas: null
    }),
    actions: {
        setUser(user) {
            this.id = user.id
            this.usernamenya = user.usernamenya
            this.email = user.email
            this.nama = user.nama
            this.jabatan = user.jabatan
            this.id_role = user.id_role
            this.role = user.role
            this.accessToken = user.accessToken
            this.permission = user.permission
            this.pegawai = user.pegawai
            this.iat = user.iat
            this.isLogedIn = true
            this.fotonya = user.fotonya
            this.id_departemen = user.id_departemen
            this.kas = user.kas
        },
        clearUser() {
            this.id = null
            this.usernamenya = null
            this.email = null
            this.nama = null
            this.jabatan = null
            this.id_role = null
            this.role = null
            this.accessToken = null
            this.permission = []
            this.pegawai = null
            this.iat = null
            this.isLogedIn = false
            this.fotonya = null
            this.kas = null
            this.id_departemen = null
        },
        setFotonya(foto) {
            this.fotonya = foto
        },
        async checkAuth() {
            try {
                const res = await apiAuthentication.checkAuth()
                const abilityStore = useAbilityStore()
                if (res) {
                    this.isLogedIn = true
                    this.setUser(res.data.data)
                    abilityStore.updatePermission(res.data.data.permission)
                    return res.data.data
                }
                this.isLogedIn = false
                return
            } catch (error) {
                return null
            }
        },
        async logOut() {
            return await apiAuthentication.logout().then(() => {
                this.clearUser()
            })
        },
    },
})
