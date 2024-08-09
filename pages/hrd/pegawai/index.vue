<template>
  <div class="grid">
      <div class="col-12">
          <div class="card">
              <ToolBarList title="Kelola Pegawai" @new="FormNew" :useFilter="false" :useNew="$can('create', 'master-pegawai')" />

              <DataTableList
                  title="Kelola Pegawai"
                  :value="items"
                  v-model:selectedColumns="selectedColumns"
                  :columns="columns"
                  @edit="FormEdit"
                  @delete="FormDelete"
                  :options="{
                      primaryField: 'pegawai',
                      showDelete: $can('delete', 'master-pegawai'),
                      showEdit: $can('update', 'master-pegawai'),
                  }"
              >
                  <template #columns="{ columns }">
                      <Column v-if="columns.some((col:any) => col.field === 'is_customer')" header="IS Customer" field="is_customer">
                          <template #body="{ data }">
                              <Tag icon="pi pi-check" v-if="data.is_customer" severity="success" value="Yes" />
                              <Tag icon="pi pi-times" v-else severity="danger" value="No" />
                          </template>
                      </Column>
                  </template>
              </DataTableList>

              <!-- Dialog -->
              <Dialog v-model:visible="formDialog" :style="{ width: '720px' }" header="Detail Pegawai" :modal="true" maximizable class="p-fluid">
                  <div class="formgrid flex">
                    <div class="field w-full">
                          <Label for="nama_pegawai">Nama Pegawai</Label>
                          <InputText id="nama_pegawai" v-model.trim="item.nama" autofocus :class="FormError?.nama && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.nama" />
                    </div>
                    <div class="field w-full">
                          <Label for="nik_pegawai">NIK Pegawai</Label>
                          <InputText id="nik_pegawai" v-model.trim="item.nik_ktp" autofocus :class="FormError?.nik_ktp && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.nik_ktp" />
                    </div>
                    <div class="field w-full">
                          <Label for="nip_pegawai">NIP Pegawai</Label>
                          <InputText id="nip_pegawai" v-model.trim="item.nip" autofocus :class="FormError?.nip && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.nip" />
                    </div>
                    <div class="field w-full">
                          <Label for="kantor">Kantor</Label>
                          <AutoCompleteKantor v-model="item.id_kantor" :class="FormError?.id_kantor && 'p-invalid'" />
                          <!-- <InputText id="kantor" v-model.trim="item.id_kantor" autofocus :class="FormError?.id_kantor && 'p-invalid'" /> -->
                          <ErrorMsg :error="FormError?.id_kantor" />
                    </div>
                    <div class="field w-full">
                          <Label for="panggilan_pegawai">Nama Panggilan</Label>
                          <InputText id="panggilan_pegawai" v-model.trim="item.nama_panggilan" autofocus :class="FormError?.nama_panggilan && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.nama_panggilan" />
                    </div>
                  </div>
                  <template #footer>
                      <Button label="Save" icon="pi pi-check" class="p-button-primary" @click="Save" />
                      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="formDialog = false" />
                  </template>
              </Dialog>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import useBaseCrud from './base';
import { type pegawai, insertPegawaiSchema, type Pegawai } from './base';
const { item, items, isFetching, clearItemForm, fetchItems, createItem, updateItem, deleteItem } = useBaseCrud();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [
  { header: 'Nama', field: 'pegawai', class: 'w-20rem' },
  { header: 'Keterangan', field: 'keterangan', class: 'w-20rem' },
];

const selectedColumns = reactive<string[]>(['pegawai', 'keterangan']);

// Form Error
const FormSchema = insertPegawaiSchema.omit({ id: true, created_by: true, updated_by: true });

const FormError = computed(() => {
  if (isClean.value) {
      return;
  }
  return FormSchema.safeParse(item)?.error?.format();
});

const isError = computed(() => {
  return Object.keys(FormError.value || {}).length > 0;
});

// mounted
onMounted(() => {
  getData();
});

const getData = async () => {
  await fetchItems();
};

// Form
const FormNew = () => {
  clearItemForm();
  isClean.value = true;
  formDialog.value = true;
  isEdit.value = false;
};

const FormEdit = (data: any) => {
  Object.assign(item, { ...data });
  isClean.value = true;
  formDialog.value = true;
  isEdit.value = true;
};
const FormDelete = (data: Pegawai) => {
  deleteItem(data.id);
};

const Save = async () => {
  try {
      isClean.value = false;
      if (isError.value) return;
      if (isEdit.value) {
          await updateItem(item.id as number, item as any).then(() => {
              isClean.value = true;
              formDialog.value = false;
          });
      } else {
          await createItem(item as any).then(() => {
              isClean.value = true;
              formDialog.value = false;
          });
      }
      await fetchItems();
  } catch (error) {}
};
</script>
<style lang="scss" scoped></style>
