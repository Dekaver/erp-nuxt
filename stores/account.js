// store/akun.ts
import { defineStore } from 'pinia'

export const useAkunStore = defineStore('account', {
    state: () => ({
        list: [],
        akun: null,
        count: 0,
    }),
    actions: {
        setAkun(akun) {
            this.akun = akun
        },
        setListAkun(list) {
            this.list = list
            this.count = list.length
        },
        getAkunById(id){
            return this.list.find(a => a.id === id)
        },
        clearAkun() {
            this.akun = null
        },
        clearAll() {
            this.list = []
            this.akun = null
            this.count = 0
        },
        selectAkun(id) {
            const selectedAkun = this.list.find((g) => g.id === id)
            if (selectedAkun) {
                this.akun = selectedAkun
            }
        },
    },
})
