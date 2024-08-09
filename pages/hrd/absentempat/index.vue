<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <ToolBarList
          title="Kelola Absen Tempat"
          @new="FormNew"
          :useFilter="false"
          :useNew="$can('create', 'absen_tempat')"
        />

        <DataTableList
          title="Kelola Absen Tempat"
          :value="items"
          v-model:selectedColumns="selectedColumns"
          :columns="columns"
          @edit="FormEdit"
          @delete="FormDelete"
          :options="{
            primaryField: 'absen_tempat',
            showDelete: $can('delete', 'absen_tempat'),
            showEdit: $can('update', 'absen_tempat'),
          }"
        >
        </DataTableList>

        <!-- Dialog -->
        <Dialog
          v-model:visible="formDialog"
          :style="{ width: '720px' }"
          header="Tambahkan Absen Tempat"
          :modal="true"
          maximizable
          class="p-fluid"
        >
          <div class="formgrid flex">
            <div class="field w-full">
              <Label for="nama_tempat">Nama Tempat</Label>
              <InputText
                id="nama_tempat"
                v-model.trim="item.nama"
                autofocus
                :class="FormError?.nama && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.nama" />
            </div>
            <div class="field w-full">
              <Label for="latitude">Latitude</Label>
              <InputText id="latitude" v-model="item.latitude" autofocus />
              <ErrorMsg :error="FormError?.latitude" />
            </div>
            <div class="field w-full">
              <Label for="longitude">Longitude</Label>
              <InputText id="longitude" v-model="item.longitude" autofocus />
              <ErrorMsg :error="FormError?.longitude" />
            </div>
            <div class="field w-full">
              <Label for="jarak">Jarak Absen</Label>
              <InputNumber
                id="jarak"
                v-model="item.jarak_absen"
                autofocus
                :class="FormError?.jarak_absen && 'p-invalid'"
              />
              <ErrorMsg :error="FormError?.jarak_absen" />
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
import { double } from "drizzle-orm/mysql-core";
import useBaseCrud from "./base";
import { type AbsenTempat, insertAbsenTempatSchema } from "./base";
import { doublePrecision } from "drizzle-orm/pg-core";
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

const columns = [
  { header: "Nama", field: "nama", class: "w-20rem" },
  { header: "Latitude", field: "latitude", class: "w-20rem" },
  { header: "Longitude", field: "longitude", class: "w-20rem" },
  { header: "Jarak", field: "jarak_absen", class: "w-20rem" },
];

const selectedColumns = reactive<string[]>([
  "nama",
  "latitude",
  "longitude",
  "jarak_absen",
]);

// Form Error
const FormSchema = insertAbsenTempatSchema.omit({
  id: true,
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
const FormDelete = (data: AbsenTempat) => {
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
