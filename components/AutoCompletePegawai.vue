<template>
    <AutoComplete
        v-model="selectedItem"
        placeholder="Pilih Pegawai"
        class="min-w-max"
        optionLabel="nama"
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
            <div class="flex">
                <div class="w-full">
                    {{ option.nama }}
                </div>
            </div>
        </template>
    </AutoComplete>
    <ErrorMsg :error="error" />
</template>

<script>
import _ from 'lodash';
import BaseAutoComplete from './base/BaseAutoComplete.vue';

export default {
    name: 'AutoCompletePegawai',
    extends: BaseAutoComplete,
    methods: {
        // INIT
        async getData() {
            await $fetch(`/api/pegawai`, {
                method: 'GET',
                query: { ...this.option },
            }).then((res) => {
                this.lItem = res.data;
            });
        },
        searchItem(event) {
            const debounceSearch = _.debounce(async (query) => {
                const res = await $fetch(`/api/pegawai`, {
                    method: 'GET',
                    query: { ...this.option, search: query },
                });
                this.filteredItem = res.data;
            }, 500);

            debounceSearch(event.query);
        },
    },
};
</script>
