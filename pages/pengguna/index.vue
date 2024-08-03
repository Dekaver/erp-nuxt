<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar>
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="FormNew" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <MyExport :value="filteredItems" :selectedColumns="selectedColumns" title="Export Purchase Order" />
                    </template>
                </Toolbar>

                <DataTableList
                    title="Manage Pengguna"
                    :value="lItem"
                    v-model:selectedColumns="selectedColumns"
                    :columns="columns"
                    @edit="FormEdit"
                    @delete="Destroy"
                    @hak-akses="FormHakAkses"
                    :options="{
                        primaryField: 'usernamenya',
                        menuItems: [
                            {
                                label: 'Hak Akses.',
                                icon: 'pi pi-lock',
                                action: 'hak-akses',
                                command: (data) => FormHakAkses(data),
                            },
                        ],
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
                    <div class="formgrid grid">
                        <div class="field col-6">
                            <Label for="id">Username</Label>
                            <InputText id="id" v-model.trim="item.usernamenya" required="true" autofocus :class="FormError.usernamenya && 'p-invalid'" />
                            <ErrorMsg :error="FormError.usernamenya" />
                        </div>
                        <div class="field col-6">
                            <label for="id" v-if="isEdit">New Password</label>
                            <label for="id" v-else>Password</label>
                            <InputText id="id" v-model.trim="item.passwordnya" type="password" required="true" autofocus :class="FormError.passwordnya && 'p-invalid'" />
                            <ErrorMsg :error="FormError.passwordnya" />
                        </div>
                        <div class="field col-6">
                            <label for="pegawai">Pegawai</label>
                            <AutoCompletePegawai v-model="item.id_pegawai" :error="FormError.id_pegawai" />
                            <ErrorMsg :error="FormError.id_pegawai" />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Save" icon="pi pi-check" class="p-button-primary" @click="Save" />
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="HideDialog" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import api from './api';
import { z } from 'zod';

const BaseSchema = z.object({
    usernamenya: z.string(),
    passwordnya: z.string(),
    // id_pegawai: z.number(),
});

export default {
    data() {
        return {
            // data
            lItem: [],
            item: {},
            selectedItem: null,

            // table
            selectedColumns: ['usernamenya', 'jabatan', 'nama', 'enabled'],
            columns: [
                { header: 'Nama', field: 'nama', class: 'w-20rem' },
                { header: 'Jabatan', field: 'jabatan', class: 'w-20rem' },
                { header: 'Username', field: 'usernamenya', class: 'w-20rem' },
                { header: 'Email', field: 'email', class: 'w-20rem' },
                { header: 'Aktif', field: 'enabled', class: 'w-20rem' },
                { header: 'Di Buat', field: 'dibuat', class: 'w-20rem', type: 'date' },
                { header: 'Login Terakhir', field: 'loginterakhir', class: 'w-20rem', type: 'date' },
                { header: 'Is Customer', field: 'is_customer', class: 'w-20rem' },
            ],

            filters: {
                global: { value: null, matchMode: 'contains' },
            },

            // dialog
            isClean: true,
            isEdit: false,
            formDialog: false,
            deleteFormDialog: false,
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            await api.index().then((res) => {
                this.lItem = res.data.data;
            });
        },
        HideDialog() {
            this.selectedPegawai = null;
            this.item = {};
            this.formDialog = false;
        },
        FormNew() {
            this.item = {};
            this.formDialog = true;
            this.isEdit = false;
        },
        FormEdit(data) {
            this.oldUsernamenya = data.usernamenya;
            this.item = { ...data };
            this.formDialog = true;
            this.isEdit = true;
        },
        FormHakAkses(item) {
            this.$router.push({
                name: 'hak-akses',
                params: {
                    id: item.id,
                },
            });
        },
        onRowDblclick(event) {
            this.FormEdit(event.data);
        },
        FormHakAkses(data) {
            this.$router.push({ name: 'hak-akses', params: { id: data.id } });
        },
        FormDelete(data) {
            this.item = { ...data };
            this.deleteFormDialog = true;
        },
        async Save() {
            try {
                this.isClean = false;
                if (Object.keys(this.FormError).length > 0) {
                    return;
                }
                if (this.isEdit) {
                    await api.update(this.oldUsernamenya, this.item).then((res) => {
                        this.$toast.add({ severity: 'success', summary: 'Successful', detail: res.data.message, life: 3000 });
                        this.getData();
                        this.formDialog = false;
                    });
                } else {
                    await api.store(this.item).then((res) => {
                        this.$toast.add({ severity: 'success', summary: 'Successful', detail: res.data.message, life: 3000 });
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
        Destroy(data) {
            this.lItem = this.lItem.filter((val) => val.usernamenya !== data.usernamenya);
            api.destroy(data.id).then((res) => {
                this.$toast.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: res.data.message,
                    life: 3000,
                });
                this.getData();
                this.deleteFormDialog = false;
            });
        },
        searchRole(event) {
            if (this.lRole == null) return;
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.filteredRole = [...this.lRole];
                } else {
                    this.filteredRole = this.lRole.filter((Role) => {
                        return Role.role.toLowerCase().includes(event.query.toLowerCase());
                    });
                }
            }, 250);
        },
    },
    computed: {
        FormError() {
            if (this.isClean) {
                return {};
            }
            return BaseSchema.safeParse(this.item)?.error?.format() || {};
        },
    },
    watch: {
        selectedPegawai() {
            this.item.id_pegawai = this.selectedPegawai ? this.selectedPegawai.id_pegawai : null;
            this.item.jabatan = this.selectedPegawai ? this.selectedPegawai.jabatan : null;
        },
        selectedRole() {
            this.item.role = this.selectedRole ? this.selectedRole.id : null;
        },
        formDialog(val) {
            val || this.HideDialog();
        },
    },
};
</script>

<style lang="scss" scoped></style>
