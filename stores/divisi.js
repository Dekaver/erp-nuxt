// store/divisi.ts
import { defineStore } from 'pinia'

export const useDivisiStore = defineStore('divisi', {
    state: () => ({
        list: [],
        divisi: null,
        count: 0,
    }),
    actions: {
        setDivisi(divisi) {
            this.divisi = divisi
        },
        setListDivisi(list) {
            this.list = list
            this.count = list.length
            this.selectFirstDivisiIfCountIsOne()
        },
        getDivisiById(id){
            return this.list.find(a => a.id == id)
        },
        clearDivisi() {
            this.divisi = null
        },
        clearAll() {
            this.list = []
            this.divisi = null
            this.count = 0
        },
        selectDivisi(id) {
            const selectedDivisi = this.list.find((g) => g.id === id)
            if (selectedDivisi) {
                this.divisi = selectedDivisi
            }
        },
        selectFirstDivisiIfCountIsOne() {
            if (this.count === 1 && this.list.length > 0) {
                this.divisi = this.list[0]
            }
        },
    },
})
