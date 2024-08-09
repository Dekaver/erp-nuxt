<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <ToolBarList
          title="Kelola Account"
          @new="FormNew"
          :useFilter="false"
          :useNew="$can('create', 'master-account')"
        />

        <DataTableList
          title="Kelola Account"
          :value="items"
          v-model:selectedColumns="selectedColumns"
          :columns="columns"
          @edit="FormEdit"
          @delete="FormDelete"
          :options="{
            primaryField: 'satuan',
            showDelete: $can('delete', 'master-account'),
            showEdit: $can('update', 'master-account'),
          }"
        >
          <template #columns="{ columns }">
            <Column
              v-if="columns.some((col:any) => col.field === 'is_customer')"
              header="IS Customer"
              field="is_customer"
            >
              <template #body="{ data }">
                <Tag
                  icon="pi pi-check"
                  v-if="data.is_customer"
                  severity="success"
                  value="Yes"
                />
                <Tag icon="pi pi-times" v-else severity="danger" value="No" />
              </template>
            </Column>
          </template>
        </DataTableList>

        <!-- Dialog -->
        <Dialog
          v-model:visible="formDialog"
          :style="{ width: '720px' }"
          header="Detail Account"
          :modal="true"
          maximizable
          class="p-fluid"
        >
          <div class="formgrid flex">
            <div class="field w-full">
              <Label for="category">Category</Label>
              <AutoCompleteKlasifikasi
                v-model="item.id_category"
                :class="FormError?.id_category && 'p-invalid'"
                :options="{ level: 1 }"
              />
              <!-- <InputText id="category" v-model.trim="item.account" autofocus :class="FormError?.account && 'p-invalid'" /> -->
              <ErrorMsg :error="FormError?.id_category" />
            </div>
            <div class="field w-full">
              <Label for="subklasifikasi">Sub Klasifikasi</Label>
              <AutoCompleteKlasifikasi
                v-model="item.parent"
                :class="FormError?.parent && 'p-invallid'"
                :options="{ level: 2 }"
              />
              <ErrorMsg :error="FormError?.parent" />
            </div>
            <div class="field w-full">
              <Label for="code">Kode</Label>
              <InputText
                v-model="item.code"
                :class="FormError?.code && 'p-invallid'"
                :options="{ level: 2 }"
              />
              <ErrorMsg :error="FormError?.code" />
            </div>
            <div class="field w-full">
              <Label for="Nama">Nama</Label>
              <InputText
                v-model="item.name"
                :class="FormError?.name && 'p-invallid'"
                :options="{ level: 2 }"
              />
              <ErrorMsg :error="FormError?.name" />
            </div>

            <div class="field w-full">
              <Label for="cash">Cash</Label>
              <!-- <InputText v-model="item.name" :class="FormError?.name && 'p-invallid'" :options="{ level:2 }" /> -->
              <ToggleSwitch v-model="item.is_cash as boolean" />
              <ErrorMsg :error="FormError?.name" />
            </div>
          </div>
          <template #footer>
            <Button
              label="Save"
              icon="pi pi-check"
              class="p-button-primary"
              @click="Save"
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-text"
              @click="formDialog = false"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBaseCrud from './base';
import { insertAccountSchema, type Account } from './base';
const { item, items, isFetching, clearItemForm, fetchItems, createItem, updateItem, deleteItem } = useBaseCrud();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [
  { header: 'Kode Akun', field: 'code', class: 'w-20rem' },
  { header: 'Nama Akun', field: 'name', class: 'w-20rem' },
  { header: 'Subklasifikasi', field: 'subklasifikasi', class: 'w-20rem' },
  { header: 'Aktif', field: 'is_active', class: 'w-20rem' },

];

const selectedColumns = reactive<string[]>(['code', 'name', 'is_active', 'subklasifikasi']);

// Form Error
const FormSchema = insertAccountSchema.omit({ id: true, created_by: true, updated_by: true });

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
  await fetchItems('', { "type": 'option', 'level': '4' });
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
const FormDelete = (data: Account) => {
  deleteItem(data.id);
};

const Save = async () => {
  item.level = 4
  try {
    isClean.value = false;
    console.table(FormError)
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
