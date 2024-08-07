<template>
  <div class="grid">
      <div class="col-12">
          <div class="card">
              <ToolBarList title="Kelola Top" @new="FormNew" :useFilter="false" :useNew="$can('create', 'master-top')" />

              <DataTableList
                  title="Kelola Top"
                  :value="items"
                  v-model:selectedColumns="selectedColumns"
                  :columns="columns"
                  @edit="FormEdit"
                  @delete="FormDelete"
                  :options="{
                      primaryField: 'top',
                      showDelete: $can('delete', 'master-top'),
                      showEdit: $can('update', 'master-top'),
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
              <Dialog v-model:visible="formDialog" :style="{ width: '720px' }" header="Detail Top" :modal="true" maximizable class="p-fluid">
                  <div class="formgrid flex">
                    <div class="field w-full">
                          <Label for="top">Top</Label>
                          <InputNumber id="top" inputId="integeronly" fluid v-model.trim="item.top" autofocus :class="FormError?.top && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.top" />
                    </div>
                    <div class="field w-full">
                          <Label for="keterangan_top">Keterangan</Label>
                          <InputText id="keterangan_top" v-model.trim="item.keterangan" autofocus :class="FormError?.keterangan && 'p-invalid'" />
                          <ErrorMsg :error="FormError?.keterangan" />
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
import { type top, insertTopSchema, type Top } from './base';
const { item, items, isFetching, clearItemForm, fetchItems, createItem, updateItem, deleteItem } = useBaseCrud();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [
  { header: 'TOP', field: 'top', class: 'w-20rem' },
  { header: 'Keterangan', field: 'keterangan', class: 'w-20rem' },
];

const selectedColumns = reactive<string[]>(['top', 'keterangan']);

// Form Error
const FormSchema = insertTopSchema.omit({ id: true, created_by: true, updated_by: true });

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
const FormDelete = (data: Top) => {
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
