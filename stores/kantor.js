// store/kantor.ts
import { defineStore } from 'pinia'

export const useKantorStore = defineStore('kantor', {
    state: () => ({
        list: [],
        kantor: {
            id: null,
            numbercode: null,
            nama: null,
            telepon: null,
            email: null,
            alamat: null,
            account_penjualan: null,
            account_piutang: null,
            account_hutang: null,
        },
        count: 0,
    }),
    actions: {
        setKantor(kantor) {
            this.kantor = kantor
        },
        setListKantor(kantor) {
            this.list = kantor
            this.count = kantor.length
            this.selectFirstKantorIfCountIsOne()
        },
        getKantorById(id) {
            return this.list.find((a) => a.id == id)
        },
        clearKantor() {
            this.kantor = {
                id: null,
                numbercode: null,
                nama: null,
                telepon: null,
                email: null,
                alamat: null,
                account_penjualan: null,
                account_piutang: null,
                account_hutang: null,
            }
        },
        clearAll() {
            this.list = []
            this.kantor = {
                id: null,
                numbercode: null,
                nama: null,
                telepon: null,
                email: null,
                alamat: null,
                account_penjualan: null,
                account_piutang: null,
                account_hutang: null,
            }
            this.count = 0
        },
        selectKantor(id) {
            const selectedKantor = this.list.find((g) => g.id === id)
            if (selectedKantor) {
                this.kantor = selectedKantor
            }
        },
        getKantor(id) {
            return this.list.find((i) => i.id === id)
        },
        selectFirstKantorIfCountIsOne() {
            if (this.count === 1 && this.list.length > 0) {
                this.kantor = this.list[0]
            }
        },
        getId(){
            return this.kantor?.id
        }
    },
})
