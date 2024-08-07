<template>
  <div class="grid">
      <div class="col-12">
          <div class="card">
              <ToolBarList title="Kelola Kontak" @new="FormNew" :useFilter="false" :useNew="$can('create', 'master-kontak')" />

              <DataTableList
                  title="Kelola Kontak"
                  :value="items"
                  v-model:selectedColumns="selectedColumns"
                  :columns="columns"
                  @edit="FormEdit"
                  @delete="FormDelete"
                  :options="{
                      primaryField: 'satuan',
                      showDelete: $can('delete', 'master-kontak'),
                      showEdit: $can('update', 'master-kontak'),
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
              <Dialog v-model:visible="formDialog" :style="{ width: '720px' }" header="Detail Kontak" :modal="true" maximizable class="p-fluid">
                  <div class="formgrid flex">
                    <div class="field w-full">
                          <Label for="nama_kontak">Nama Kontak</Label>
                          <InputText id="nama_kontak" v-model.trim="item.kontak" autofocus :class="FormError?.kontak && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.kontak" />
                    </div>
                    <div class="field w-full">
                          <Label for="inisial_kontak">Inisial</Label>
                          <InputText id="inisial_kontak" v-model.trim="item.inisial" autofocus :class="FormError?.inisial && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.inisial" />
                    </div>
                    
                    <div class="field w-full">
                          <Label for="TOP">TOP</Label>
                          <AutoCompleteTop v-model="item.id_top" :class="FormError?.id_top && 'p-invalid'" />
                          <!-- <InputTop v-model:top="item.top" v-model:id="item.id_top" :error="FormError.id_top" /> -->
                          <!-- <InputText id="TOP" v-model.trim="item.id_top" autofocus :class="FormError?.id_top && 'p-invalid'" /> -->
                          <ErrorMsg :error="FormError?.id_top" />
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
import { type kontak, insertKontakSchema, type Kontak } from './base';
const { item, items, isFetching, clearItemForm, fetchItems, createItem, updateItem, deleteItem } = useBaseCrud();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [
  { header: 'Nama', field: 'satuan', class: 'w-20rem' },
  { header: 'Keterangan', field: 'keterangan', class: 'w-20rem' },
];

const selectedColumns = reactive<string[]>(['satuan', 'keterangan']);

// Form Error
const FormSchema = insertKontakSchema.omit({ id: true });

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
const FormDelete = (data: Kontak) => {
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
