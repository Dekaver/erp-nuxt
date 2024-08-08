<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <ToolBarList
          title="Kelola Hari Libur"
          @new="FormNew"
          :useFilter="false"
          :useNew="$can('create', 'hari-libur')"
        />

        <DataTableList
          title="Kelola Hari Libur"
          :value="items"
          v-model:selectedColumns="selectedColumns"
          :columns="columns"
          @edit="FormEdit"
          @delete="FormDelete"
          :options="{
            primaryField: 'hari-libur',
            showDelete: $can('delete', 'hari-libur'),
            showEdit: $can('update', 'hari-libur'),
          }"
        >
        </DataTableList>

        <!-- Dialog -->
        <Dialog
          v-model:visible="formDialog"
          :style="{ width: '720px' }"
          header="Detail Hari Libur"
          :modal="true"
          maximizable
          class="p-fluid"
        >
          <div class="formgrid flex">
            <div class="field w-full">
              <Label for="nama_hari">Nama Hari</Label>
              <InputText
                id="nama_hari"
                v-model.trim="item.nama"
                autofocus
                :class="FormError?.nama && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.nama" />
            </div>
            <div class="field w-full">
              <Label for="keterangan_satuan">Tanggal</Label>
              <Calendar v-model="tanggal" @date-select="selectTanggal" />
              <ErrorMsg :error="FormError?.tanggal" />
            </div>
            <div class="field w-full">
              <Label for="keterangan_satuan">Tipe</Label>
              <AutoCompleteHariLiburTipe
                v-model="item.hari_libur_tipe_id"
                :error="FormError?.hari_libur_tipe_id"
              />
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
import useBaseCrud from "./base";
import { type HariLibur, insertHariLiburSchema } from "./base";
const {
  item,
  items,
  isFetching,
  clearItemForm,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} = useBaseCrud();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const tanggal = ref();

const columns = [
  { header: "Nama", field: "nama", class: "w-20rem" },
  { header: "Tanggal", field: "tanggal", class: "w-20rem" },
];

const selectedColumns = reactive<string[]>(["nama", "tanggal"]);

// Form Error
const FormSchema = insertHariLiburSchema.omit({
  id: true,
  created_by: true,
  updated_by: true,
});

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

const selectTanggal = (event: any) => {
  item.tanggal = new Date(event).toISOString();
};

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
const FormDelete = (data: HariLibur) => {
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
