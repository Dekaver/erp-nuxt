// store/gudang.ts
import { defineStore } from 'pinia'

export const useGudangStore = defineStore('gudang', {
    state: () => ({
        list: [],
        gudang: null,
        count: 0,
    }),
    actions: {
        setGudang(gudang) {
            this.gudang = gudang
        },
        setListGudang(list) {
            this.list = list
            this.count = list.length
            this.selectFirstGudangIfCountIsOne()
        },
        getGudangById(id){
            return this.list.find(a => a.id == id)
        },
        clearGudang() {
            this.gudang = null
        },
        clearAll() {
            this.list = []
            this.gudang = null
            this.count = 0
        },
        selectGudang(id) {
            const selectedGudang = this.list.find((g) => g.id === id)
            if (selectedGudang) {
                this.gudang = selectedGudang
            }
        },
        selectFirstGudangIfCountIsOne() {
            if (this.count === 1 && this.list.length > 0) {
                this.gudang = this.list[0]
            }
        },
    },
})
