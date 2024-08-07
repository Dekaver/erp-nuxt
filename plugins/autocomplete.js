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
                label: {
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
