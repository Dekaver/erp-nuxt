<template>
  <AutoComplete
      v-model="selectedItem"
      :placeholder="`Pilih ${prop.endpoint}`"
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
                <div class="flex">
                  <span class="mr-4" v-for="(opt, index) in prop.option" :key="index">
                    <Image v-if="opt == 'logo'" :src="option[index]" alt="logo" width="20" height="20" />
                    <Badge v-if="opt == 'badge'" :value="option[index]" severity="info" />
                    <span v-else>
                    {{ option[index] }}
                    </span>
                  </span>
                </div>
              </div>
          </div>
      </template>
  </AutoComplete>
  <ErrorMsg :error="error" />
</template>

<script setup>
import _ from 'lodash';

const lItem = ref([])
const filteredItem = ref([])

const prop = defineProps({
    endpoint: {
        type: String,
        default: '',
    },
    error: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
    option: {
        type: Object,
    },
    query: {
        type: Object,
    }
});

async function getData() {
    await $fetch(`/api/${prop.endpoint}`, {
        method: 'GET',
        query: { ...prop.option },
    }).then((res) => {
        lItem.value = res.data;
    });
}
function searchItem(event) {
    const debounceSearch = _.debounce(async (query) => {
        const res = await $fetch(`/api/${prop.endpoint}`, {
            method: 'GET',
            query: { ...prop.query },
        });
        filteredItem.value = res.data;
    }, 500);

    debounceSearch(event.query);
}
</script>
