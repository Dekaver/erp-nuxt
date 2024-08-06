// store/akun.ts
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
    state: () => ({
        pembelian: {
            diskon_per_baris: false,
            diskon_total: false,
            pajak: null,
            id_pajak: [],
            proyek: false,
            persetujuan: {
                material_request: {},
                permintaan: {},
                pesanan: {},
                penerimaan: {},
                faktur: {},
                payment: {},
            },
        },
        penjualan: {
            diskon_per_baris: false,
            diskon_total: false,
            pajak: null,
            id_pajak: [],
            proyek: false,
            persetujuan: {
                quotation: {},
                salesorder: {},
                deliveryorder: {},
                invoice: {},
                payment: {},
            },
        },
        umum: {},
    }),
    actions: {
        // set pembelian
        setPembelian(data) {
            this.pembelian.diskon_per_baris = data.diskon_per_baris
            this.pembelian.diskon_total = data.diskon_total
            this.pembelian.pajak = data.pajak
            this.pembelian.id_pajak = data.id_pajak
            this.pembelian.proyek = data.proyek
        },

        // penjualan
        setPenjualan(data) {
            this.penjualan.diskon_per_baris = data.diskon_per_baris
            this.penjualan.diskon_total = data.diskon_total
            this.penjualan.pajak = data.pajak
            this.penjualan.id_pajak = data.id_pajak
            this.penjualan.proyek = data.proyek
        },

        //persetujuan
        setPersetujuan(module, data) {
            this.pembelian.persetujuan[module] = data
        },
    },
})
