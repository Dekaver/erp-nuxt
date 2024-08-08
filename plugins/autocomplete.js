import AutoCompleteTemplate from '../components/base/AutoCompleteTemplate.vue';

const list = [
    {
        name: 'Barang',
        placeholder: 'Pilih Barang',
        url: 'brand',
        key: 'id',
        label: 'nama',
        option: [
            {
                position: 'left', // left, right, center
                width: 'half', // quarter, half, three-quarter, full
                color: 'blue',
                key: 'nama' // value from object
            },
            {
                position: 'right', // left, right, center
                width: 'half', // quarter, half, three-quarter, full
                color: 'red',
                key: 'nama' // value from object
            }
        ],
    },
    {
        name: 'Top',
        placeholder: 'Pilih Top',
        url: 'top',
        key: 'id_top',
        label: 'id',
        option: [
            {
                position: 'left', // left, right, center
                width: 'half', // quarter, half, three-quarter, full
                color: 'blue',
                key: 'top' // value from object
            },
            {
                position: 'right', // left, right, center
                width: 'half', // quarter, half, three-quarter, full
                color: 'red',
                key: 'keterangan' // value from object
            }
        ],
    },
    {
        name: 'Kantor',
        placeholder: 'Pilih Kantor',
        url: 'kantor',
        key: 'id_kantor',
        label: 'Nama',
        option: [
            {
                position: 'left', // left, right, center
                width: 'half', // quarter, half, three-quarter, full
                color: 'blue',
                key: 'nama' // value from object
            },
            {
                position: 'right', // left, right, center
                width: 'half', // quarter, half, three-quarter, full
                color: 'red',
                key: 'keterangan' // value from object
            }
        ],
    },
    {
        name: 'Klasifikasi',
        placeholder: 'Pilih Kategori',
        url: 'account/category',
        key: 'id_kantor',
        label: 'Nama',
        option: [
            {
                position: 'left', // left, right, center
                width: 'half', // quarter, half, three-quarter, full
                color: 'blue',
                key: 'nama' // value from object
            },
            {
                position: 'right', // left, right, center
                width: 'half', // quarter, half, three-quarter, full
                color: 'red',
                key: 'keterangan' // value from object
            }
        ],
    }

]

export default defineNuxtPlugin(({ vueApp }) => {
    for (const fitur of list) {
        vueApp.component(`AutoComplete${fitur.name}`, {
            extends: AutoCompleteTemplate,
            props: {
                baseUrl: {
                    type: String,
                    default: fitur.url
                },
                key: {
                    type: String,
                    default: fitur.key
                },
                optionLabel: {
                    type: String,
                    default: fitur.label
                },
                optionView: {
                    type: Array,
                    default: fitur.option
                },
                placeholder: {
                    type: String,
                    default: fitur.placeholder
                }
            }
        });
    }
});
