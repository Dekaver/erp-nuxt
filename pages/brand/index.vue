<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ToolBarList title="Manage Brand" @new="FormNew" :useFilter="false" :useNew="$can('create', 'brand-barang')" />

                <DataTableList
                    title="Manage Brand"
                    :value="lItem"
                    v-model:selectedColumns="selectedColumns"
                    :columns="columns"
                    @edit="FormEdit"
                    @delete="Destroy"
                    :options="{
                        primaryField: 'nama',
                        showDelete: $can('delete', 'brand-barang'),
                        showEdit: $can('update', 'brand-barang'),
                    }"
                >
                    <template #columns="{ columns }">
                        <Column v-if="columns.some((col) => col.field === 'is_customer')" header="IS Customer" field="is_customer">
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
                            <InputText id="nama_brand" v-model.trim="item.nama" autofocus :class="FormError.nama && 'p-invalid'" />
                            <ErrorMsg :error="FormError.nama" />
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
<script setup>
definePageMeta({
    middleware: ['auth'],
});
</script>
<script>
import api from './api';
import { z } from 'zod';

const BaseSchema = z.object({
    nama: z.string(),
});

export default {
    data() {
        return {
            // data
            lItem: [],
            item: {},
            selectedItem: null,

            // table
            selectedColumns: [],
            columns: [{ header: 'Nama', field: 'nama', class: 'w-20rem' }],

            // helper
            isClean: true,
            isEdit: false,
            formDialog: false,
        };
    },
    computed: {
        FormError() {
            if (this.isClean) {
                return {};
            }
            return BaseSchema.safeParse(this.item)?.error?.format() || {};
        },
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            await api.index().then((res) => {
                this.lItem = res.data;
            });
        },
        async Save() {
            try {
                this.isClean = false;
                if (Object.keys(this.FormError).length > 0) {
                    return;
                }
                if (this.isEdit) {
                    await api.update(this.item.id, this.item).then((res) => {
                        this.$toast.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
                        this.getData();
                        this.formDialog = false;
                    });
                } else {
                    await api.store(this.item).then((res) => {
                        this.$toast.add({ severity: 'success', summary: 'Successful', detail: res.message, life: 3000 });
                        this.getData();
                        this.formDialog = false;
                    });
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    this.$toast.add({ severity: 'error', summary: 'Failed', detail: error.response.data.message, life: 3000 });
                }
            } finally {
                this.$timeoutLoading();
            }
        },
        FormNew() {
            this.item = {};
            this.formDialog = true;
            this.isEdit = false;
        },
        FormEdit(data) {
            if (!$can('update', 'brand-barang')) return;
            this.item = { ...data };
            this.formDialog = true;
            this.isEdit = true;
        },
        onRowDblclick(event) {
            this.FormEdit(event.data);
        },
        async Destroy(data) {
            await api.destroy(data.id).then((res) => {
                this.lItem = this.lItem.filter((val) => val.nama !== data.nama);
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: res.data.message, life: 3000 });
                this.getData();
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
