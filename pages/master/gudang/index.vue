<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <ToolBarList
          title="Kelola Gudang"
          @new="FormNew"
          :useFilter="false"
          :useNew="$can('create', 'master-gudang')"
        />

        <DataTableList
          title="Kelola Gudang"
          :value="items"
          v-model:selectedColumns="selectedColumns"
          :columns="columns"
          @edit="FormEdit"
          @delete="FormDelete"
          :options="{
            primaryField: 'satuan',
            showDelete: $can('delete', 'master-gudang'),
            showEdit: $can('update', 'master-gudang'),
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
          header="Detail Gudang"
          :modal="true"
          maximizable
          class="p-fluid"
        >
          <div class="formgrid flex">
            <div class="field w-full">
              <Label for="inisial_gudang">Inisial</Label>
              <InputText
                id="inisial_gudang"
                v-model.trim="item.inisial"
                autofocus
                :class="FormError?.inisial && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.inisial" />
            </div>
            <div class="field w-full">
              <Label for="nama_gudang">Nama Gudang</Label>
              <InputText
                id="nama_gudang"
                v-model.trim="item.gudang"
                autofocus
                :class="FormError?.gudang && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.gudang" />
            </div>
          </div>
          <div class="formgrid flex">
            <div class="field w-full">
              <Label for="telepon_gudang">Telepon</Label>
              <InputText
                id="telepon_gudang"
                v-model.trim="item.telepon"
                autofocus
                :class="FormError?.telepon && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.telepon" />
            </div>
            <div class="field w-full">
              <Label for="nama_kantor">Nama Kantor</Label>
              <AutoCompleteKantor
                v-model="item.id_kantor"
                :class="FormError?.id_kantor && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.id_kantor" />
            </div>
          </div>
          <div class="formgrid flex">
            <div class="field w-full">
              <Label required for="accountpersediaan">Akun Persediaan</Label>
              <AutoCompleteAccount
                id="accountpersediaan"
                v-model="item.account_persediaan"
                :class="FormError?.account_persediaan && 'p-invalid'"
                :options="{ level: 4 }"
              />
              <ErrorMsg :error="FormError?.account_persediaan" />
            </div>
            <div class="field w-full">
              <Label required for="accounthpp">Akun Hpp</Label>
              <AutoCompleteAccount
                id="accounthpp"
                v-model="item.account_hpp"
                :class="FormError?.account_hpp && 'p-invalid'"
                :options="{ level: 4 }"
              />
              <ErrorMsg :error="FormError?.account_hpp" />
            </div>
          </div>
          <div class="formgrid flex">
            <div class="field w-full">
              <Label for="alamat">Alamat</Label>
              <Textarea id="alamat" v-model="item.alamat" :autosize="true" />
              <ErrorMsg :error="FormError?.alamat" />
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
import { type gudang, insertGudangSchema, type Gudang } from './base';
const { item, items, isFetching, clearItemForm, fetchItems, createItem, updateItem, deleteItem } = useBaseCrud();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [
  { header: 'Inisial', field: 'inisial', class: 'w-20rem' },
  { header: 'Gudang', field: 'gudang', class: 'w-20rem' },
  { header: 'Alamat', field: 'alamat', class: 'w-20rem' },
  { header: 'Telepon', field: 'telepon', class: 'w-20rem' },
  { header: 'Akun Penjualan', field: 'acc_penjualan', class: 'w-20rem' },
  { header: 'Akun Pembelian', field: 'acc_pembelian', class: 'w-20rem' },

];

const selectedColumns = reactive<string[]>(['inisial', 'gudang', 'alamat', 'telepon', 'acc_penjualan', 'acc_pembelian' ]);

// Form Error
const FormSchema = insertGudangSchema.omit({ id: true, created_by: true, updated_by: true });

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
const FormDelete = (data: Gudang) => {
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
