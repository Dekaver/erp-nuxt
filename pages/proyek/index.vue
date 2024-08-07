<template>
  <div class="grid">
      <div class="col-12">
          <div class="card">
              <ToolBarList title="Manage Proyek" @new="FormNew" :useFilter="false" :useNew="$can('create', 'proyek')" />

              <DataTableList
                  title="Manage Proyek"
                  :value="items"
                  v-model:selectedColumns="selectedColumns"
                  :columns="columns"
                  @edit="FormEdit"
                  @delete="FormDelete"
                  :options="{
                      primaryField: 'kode',
                      showDelete: $can('delete', 'proyek'),
                      showEdit: $can('update', 'proyek'),
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
              <Dialog v-model:visible="formDialog" :style="{ width: '720px' }" header="Detail Pengguna" :modal="true" maximizable class="p-fluid">
                  <div class="formgrid flex">
                    <div class="field w-full">
                          <Label for="nama_proyek">Nama Proyek</Label>
                          <InputText id="nama_proyek" v-model.trim="item.proyek" autofocus :class="FormError?.proyek && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.proyek" />
                      </div>
                      <div class="field w-full">
                          <Label for="kode_proyek">Kode Proyek</Label>
                          <InputText id="kode_proyek" v-model.trim="item.kode" autofocus :class="FormError?.kode && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.kode" />
                      </div>
                      <div class="field w-full">
                          <Label for="lokasi_proyek">Lokasi Proyek</Label>
                          <InputText id="lokasi_proyek" v-model.trim="item.lokasi" autofocus :class="FormError?.lokasi && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.lokasi" />
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
import { type Proyek, type proyek, insertProyekSchema } from '@/databases/proyek/schema';
import useBaseCrud from './base';
const { item, items, isFetching, clearItemForm, fetchItems, createItem, updateItem, deleteItem } = useBaseCrud();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [
  { header: 'Kode', field: 'kode', class: 'w-20rem' },
  { header: 'Nama', field: 'proyek', class: 'w-20rem' },
  { header: 'Lokasi', field: 'lokasi', class: 'w-20rem' },
];

const selectedColumns = reactive<string[]>(['proyek', 'kode', 'lokasi']);

// Form Error
const FormSchema = insertProyekSchema.omit({ id: true, created_by: true, updated_by: true });

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
const FormDelete = (data: Proyek) => {
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
