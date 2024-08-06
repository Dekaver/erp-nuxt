<template>
  <div class="grid">
        <div class="col-12">
            <div class="card">
                tes autocomplete
                <AutoCompompleteAPI v-model="item.nama" :error="FormError?.id_pegawai" endpoint="brand" :option="{ 'id': 'badge', 'nama' : 'text' }" />
                <Toolbar>
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="FormNew" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <MyExport :value="filteredItems" :selectedColumns="selectedColumns" title="Export Brand" />
                    </template>
                </Toolbar>
                <DataTableList
                    title="Test Using Comsumeable API Manage Brand"
                    :value="lItem"
                    v-model:selectedColumns="selectedColumns"
                    :columns="columns"
                    @edit="FormEdit"
                    @delete="Destroy"
                    :options="{
                        primaryField: 'nama',
                    }"
                >
                    <template #columns="{ columns }">
                        <Column v-if="columns.some((col: any) => col.field === 'is_customer')" header="IS Customer" field="is_customer">
                            <template #body="{ data }">
                                <Tag icon="pi pi-check" v-if="data.is_customer" severity="success" value="Yes" />
                                <Tag icon="pi pi-times" v-else severity="danger" value="No" />
                            </template>
                        </Column>
                    </template>
                </DataTableList>
                <Dialog v-model:visible="formDialog" :style="{ width: '720px' }" header="Detail Pengguna" :modal="true" maximizable class="p-fluid">
                    <div class="formgrid flex">
                        <div class="field w-full">
                            <Label for="nama_brand">Nama Brand</Label>
                            <InputText id="nama_brand" v-model.trim="item.nama" autofocus :class="FormError.nama && 'p-invalid'" />
                            <ErrorMsg :error="FormError.nama" />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Save" icon="pi pi-check" class="p-button-primary" @click="isEdit?Edit():Save()" />
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="formDialog = false" />
                    </template>
                </Dialog>
                <DevOnly>
                  <div class="flex">
                    <pre>{{ data }}</pre>
                    <pre>{{ data2 }}</pre>
                    <pre>{{ FormError }}</pre>
                  </div>
                </DevOnly>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import AutoCompompleteAPI from '@/components/AutoCompompleteAPI.vue';
import { z } from 'zod';

// API

const { data, fetchData, loading }: any = useApi('/api/brand')
const { data: data2, insertData, updateData, deleteData } = useApi('/api/brand')

// INTERFACE & Schema

interface Data {
  id?: number;
  nama?: string
}
const BaseSchema = z.object({
    nama: z.string(),
});

// DATA
const filteredItems = ref([])
const lItem = ref([])
const selectedColumns: any[] = []
const columns = [{ header: 'Nama', field: 'nama', class: 'w-20rem' }]

let item:Data = {}

const formDialog = ref(false)
const isEdit = ref(false)
const isClean = ref(true)

// Method
async function getData(){
  await fetchData()
  lItem.value = data.value
}
function FormNew(){
  item = {
    nama: ''
  }
}
function FormEdit(data: any) {
  item = { ...data };
  formDialog.value = true;
  isEdit.value = true;
}
async function Destroy(){

}
function onRowDblclick(event: any) {
  FormEdit(event.data)
}
async function Save() {
  console.log('Value to send',item)
  await insertData(item)
  await fetchData()
}
async function Edit() {
  await updateData(parseInt(`${item.id}`),item)
  await fetchData()
}

onMounted(async () => {
  await getData()
  console.log('data',data.value)
  console.log('item', lItem)
})
const FormError: any  = computed(() => {
  if (isClean.value) {
    return {}
  }
  return BaseSchema.safeParse(item)?.error?.format() || {};
});

</script>

<style>

</style>