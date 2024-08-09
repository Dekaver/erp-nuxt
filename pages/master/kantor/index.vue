<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <ToolBarList
          title="Kelola Kantor"
          @new="FormNew"
          :useFilter="false"
          :useNew="$can('create', 'master-kantor')"
        />

        <DataTableList
          title="Kelola Kantor"
          :value="items"
          v-model:selectedColumns="selectedColumns"
          :columns="columns"
          @edit="FormEdit"
          @delete="FormDelete"
          :options="{
            primaryField: 'satuan',
            showDelete: $can('delete', 'master-kantor'),
            showEdit: $can('update', 'master-kantor'),
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
          header="Detail Kantor"
          :modal="true"
          maximizable
          class="p-fluid"
        >
          <div class="formgrid">
            <div class="field w-full">
              <Label for="kode_kantor">Kode Kantor</Label>
              <InputText
                id="kode_kantor"
                v-model.trim="item.numbercode"
                autofocus
                :class="FormError?.numbercode && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.numbercode" />
            </div>
            <div class="field w-full">
              <Label for="nama_kantor">Kantor</Label>
              <InputText
                id="nama_kantor"
                v-model.trim="item.nama"
                autofocus
                :class="FormError?.nama && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.nama" />
            </div>
            <div class="field w-full">
              <label for="accountpenjualan">Akun Penjualan</label>
              <AutoCompleteAccount
                v-model="item.account_penjualan"
                :class="FormError?.account_penjualan && 'p-invalid'"
                :options="{ level: 4 }"
              />
              <ErrorMsg :error="FormError?.account_penjualan" />
            </div>
            <div class="field w-full">
              <label for="accounthutang">Akun Hutang</label>
              <AutoCompleteAccount
                v-model="item.account_hutang"
                :class="FormError?.account_hutang && 'p-invalid'"
                :options="{ level: 4 }"
              />
              <ErrorMsg :error="FormError?.account_hutang" />
            </div>
            <div class="field w-full">
              <label for="accountpiutang">Akun Piutang</label>
              <AutoCompleteAccount
                v-model="item.account_piutang"
                :class="FormError?.account_piutang && 'p-invalid'"
                :options="{ level: 4 }"
              />
              <ErrorMsg :error="FormError?.account_piutang" />
            </div>
            <div class="field w-full">
              <label for="telepon">Telepon</label>
              <InputText
                id="telepon"
                v-model="item.telepon"
                :class="FormError?.telepon && 'p-invalid'"
                autofocus
              />
              <ErrorMsg :error="FormError?.telepon" />
            </div>
            <div class="field w-full">
              <label for="email">Email</label>
              <InputText
                id="email"
                v-model="item.email"
                :class="FormError?.email && 'p-invalid'"
                autofocus
              />
              <ErrorMsg :error="FormError?.email" />
            </div>
            <div class="field w-full">
              <Label for="alamat_kantor">Alamat Kantor</Label>
              <InputText
                id="alamat_kantor"
                v-model.trim="item.alamat"
                autofocus
                :class="FormError?.alamat && 'p-invalid'"
              />
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
import { type kantor, insertKantorSchema, type Kantor } from './base';
const { item, items, isFetching, clearItemForm, fetchItems, createItem, updateItem, deleteItem } = useBaseCrud();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [
  { header: 'Kode', field: 'numbercode', class: 'w-20rem' },
  { header: 'Kantor', field: 'nama', class: 'w-20rem' },
  { header: 'Alamat', field: 'alamat', class: 'w-20rem' },
  { header: 'Telepon', field: 'telepon', class: 'w-20rem' },
  { header: 'Akun Penjualan', field: 'acc_ap', class: 'w-20rem' },
  { header: 'Akun Hutang', field: 'acc_hp', class: 'w-20rem' },
  { header: 'Akun Piutang', field: 'acc_hpp', class: 'w-20rem' },
];

const selectedColumns = reactive<string[]>(['numbercode', 'nama', 'alamat', 'telepon', 'acc_ap', 'acc_hp', 'acc_hpp']);

// Form Error
const FormSchema = insertKantorSchema.omit({ id: true, created_by: true, updated_by: true });

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
const FormDelete = (data: Kantor) => {
  deleteItem(data.id);
};

const Save = async () => {
  try {
      isClean.value = false;
      console.log('Value to send',item)
      console.log('isError',FormError.value)
      if (isError.value) return;
      if (isEdit.value) {
          console.log("on update");

          await updateItem(item.id as number, item as any).then(() => {
              isClean.value = true;
              formDialog.value = false;
          });
      } else {
        console.log("on insert");
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
