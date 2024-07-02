// store/departemen.ts
import { defineStore } from 'pinia'

export const useDepartemenStore = defineStore('departemen', {
    state: () => ({
        list: [],
        departemen: null,
        count: 0,
    }),
    actions: {
        setDepartemen(departemen) {
            this.departemen = departemen
        },
        setListDepartemen(list) {
            this.list = list
            this.count = list.length
            this.selectFirstDepartemenIfCountIsOne()
        },
        getDepartemenById(id){
            return this.list.find(a => a.id == id)
        },
        clearDepartemen() {
            this.departemen = null
        },
        clearAll() {
            this.list = []
            this.departemen = null
            this.count = 0
        },
        selectDepartemen(id) {
            const selectedDepartemen = this.list.find((g) => g.id === id)
            if (selectedDepartemen) {
                this.departemen = selectedDepartemen
            }
        },
        selectFirstDepartemenIfCountIsOne() {
            if (this.count === 1 && this.list.length > 0) {
                this.departemen = this.list[0]
            }
        },
    },
})
