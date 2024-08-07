<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ToolBarList title="Manage Brand" @new="FormNew" :useFilter="false" :useNew="$can('create', 'brand-barang')" />

                <DataTableList
                    title="Manage Brand"
                    :value="items"
                    v-model:selectedColumns="selectedColumns"
                    :columns="columns"
                    @edit="FormEdit"
                    @delete="FormDelete"
                    :options="{
                        primaryField: 'nama',
                        showDelete: $can('delete', 'brand-barang'),
                        showEdit: $can('update', 'brand-barang'),
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
                            <Label for="nama_brand">Nama Brand</Label>
                            <InputText id="nama_brand" v-model.trim="item.nama" autofocus :class="FormError?.nama && 'p-invalid'" />
                            <ErrorMsg :error="FormError?.nama" />
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
import { type Brand, insertBrandSchema } from '@/databases/brand/schema';

const { item, items, isFetching, clearItemForm, fetchItems, createItem, updateItem, deleteItem } = useBrand();

const router = useRouter();

const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [{ header: 'Nama', field: 'nama', class: 'w-20rem' }];

const selectedColumns = reactive<string[]>(['nama']);

// Form Error
const FormSchema = insertBrandSchema.omit({ id: true, created_by: true, updated_by: true });

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
const FormDelete = (data: Brand) => {
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
