<template>
    <AutoComplete
        v-model="selectedItem"
        class="min-w-max"
        :optionLabel="optionLabel"
        :placeholder="placeholder"
        :suggestions="filteredItem"
        :class="error && 'p-invalid'"
        :required="required"
        @complete="searchItem"
        @clear="clearItem"
        @itemSelect="selectItem"
        forceSelection
        dropdown
    >
        <template #option="{ option }">
            <div class="w-full">
                <div class="flex w-full">
                    <div v-for="(opt, index) in optionView" :key="index" :class="generateTailwindClasses(opt)">
                        {{ option[opt.key] }}
                    </div>
                </div>
            </div>
        </template>
    </AutoComplete>
    <ErrorMsg :error="error" />
</template>

<script>
import _ from 'lodash';
import BaseAutoComplete from './BaseAutoComplete.vue';

export default {
    name: 'AutoCompletePegawai',
    extends: BaseAutoComplete,
    props: {
        placeholder: {
            type: String,
            default: 'Pilih',
        },
        optionView: {
            type: Array,
            default: [],
        },
        optionLabel: {
            type: String,
            default: 'nama',
        },
        baseUrl: {
            type: String,
            default: 'pegawai',
        },
    },
    methods: {
        // INIT
        async getData() {
            await $fetch(`/api/${this.baseUrl}`, {
                method: 'GET',
                query: { ...this.option },
            }).then((res) => {
                this.lItem = res.data;
            });
        },
        searchItem(event) {
            const debounceSearch = _.debounce(async (query) => {
                const res = await $fetch(`/api/${this.baseUrl}`, {
                    method: 'GET',
                    query: { ...this.option, search: query },
                });
                this.filteredItem = res.data;
            }, 500);

            debounceSearch(event.query);
        },
        generateTailwindClasses(designObject) {
            let positionClass = '';
            let widthClass = '';
            const colorClass = designObject.color ? `text-${designObject.color}-500` : '';

            // Menentukan posisi
            switch (designObject.position) {
                case 'left':
                    positionClass = 'self-start';
                    break;
                case 'right':
                    positionClass = 'self-end';
                    break;
                case 'center':
                    positionClass = 'self-center';
                    break;
                default:
                    positionClass = '';
            }

            // Menentukan lebar
            switch (designObject.width) {
                case 'quarter':
                    widthClass = 'w-1/4';
                    break;
                case 'half':
                    widthClass = 'w-1/2';
                    break;
                case 'three-quarters':
                    widthClass = 'w-3/4';
                    break;
                case 'full':
                    widthClass = 'w-full';
                    break;
                default:
                    widthClass = '';
            }

            return `${positionClass} ${widthClass} ${colorClass}`;
        },
    },
};
</script>
