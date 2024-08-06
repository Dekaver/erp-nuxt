<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ToolBarList @new="FormNew" use-periode use-status />
                <br />
                <DataTableList
                    title="Manage Pengguna"
                    :value="lpengguna"
                    v-model:selectedColumns="selectedColumns"
                    :columns="columns"
                    @edit="FormEdit"
                    @delete="FormDelete"
                    @hak-akses="FormHakAkses"
                    :options="{
                        primaryField: 'usernamenya',
                        menuItems: [
                            {
                                label: 'Hak Akses.',
                                icon: 'pi pi-lock',
                                action: 'hak-akses',
                                command: (data : Pengguna) => FormHakAkses(data),
                            },
                        ],
                    }"
                >
                    <template #columns="{ columns }">
                        <Column v-if="columns.some((col: any) => col.field === 'is_customer')" header="IS Customer" field="is_customer">
                            <template #body="{ data }">
                                <Tag icon="pi pi-check" v-if="data.is_customer" severity="success" value="Yes" />
                                <Tag icon="pi pi-times" v-else severity="danger" value="No" />
                            </template>
                        </Column> </template
                ></DataTableList>
                || {{ status }} ||

                <!-- Dialog -->
                <Dialog v-model:visible="formDialog" :style="{ width: '720px' }" header="Detail Pengguna" :modal="true" maximizable class="p-fluid">
                    <div class="formgrid grid">
                        <div class="field col-6">
                            <Label for="id">Username</Label>
                            <InputText id="id" v-model.trim="pengguna.usernamenya" required="true" autofocus :class="FormError?.usernamenya && 'p-invalid'" />
                            <ErrorMsg :error="FormError?.usernamenya" />
                        </div>
                        <div class="field col-6">
                            <label for="id" v-if="isEdit">New Password</label>
                            <label for="id" v-else>Password</label>
                            <InputText id="id" v-model.trim="pengguna.passwordnya" type="password" required="true" autofocus :class="FormError?.passwordnya && 'p-invalid'" />
                            <ErrorMsg :error="FormError?.passwordnya" />
                        </div>
                        <div class="field col-6">
                            <label for="pegawai">Pegawai</label>
                            <AutoCompletePegawai v-model="pengguna.id_pegawai!" :error="FormError?.id_pegawai" :options="{ module: 'pengguna' }" />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Save" icon="pi pi-check" class="p-button-primary" @click="Save" :loading="isFetching" />
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="formDialog = false" :loading="isFetching" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { lpengguna, pengguna, errors, status, isFetching, fetchPengguna, createPengguna, updatePengguna, deletePengguna, clearPenggunaForm } = usePengguna();
import { type Pengguna } from '@/server/api/pengguna/schema';
import { z } from 'zod';

const router = useRouter();
// helper
const isClean = ref(true);
const isEdit = ref(false);
const formDialog = ref(false);

const columns = [
    { header: 'Nama', field: 'nama', class: 'w-20rem' },
    { header: 'Jabatan', field: 'jabatan', class: 'w-20rem' },
    { header: 'Username', field: 'usernamenya', class: 'w-20rem' },
    { header: 'Email', field: 'email', class: 'w-20rem' },
    { header: 'Aktif', field: 'enabled', class: 'w-20rem' },
    { header: 'Di Buat', field: 'dibuat', class: 'w-20rem', type: 'date' },
    { header: 'Login Terakhir', field: 'loginterakhir', class: 'w-20rem', type: 'date' },
    { header: 'Is Customer', field: 'is_customer', class: 'w-20rem' },
];

const selectedColumns = reactive<string[]>(['nama', 'jabatan', 'usernamenya', 'email']);

// Form Error
const FormSchema = z
    .object({
        id_pegawai: z.string().nullish(),
        usernamenya: z.string().min(1, { message: 'Username is required' }),
        email: z.string().email({ message: 'Email is not valid' }),
    })
    .extend({
        passwordnya: z.string().nullish(),
    });

const FormError = computed(() => {
    if (isClean.value) {
        return;
    }
    return FormSchema.safeParse(pengguna).error?.format();
});
const isError = computed(() => {
    return Object.keys(FormError.value || {}).length > 0;
});

// mounted
onMounted(() => {
    getData();
});

const getData = async () => {
    await fetchPengguna();
};

// Form
const FormNew = () => {
    setLoading(true);
    clearPenggunaForm();
    isClean.value = true;
    formDialog.value = true;
    isEdit.value = false;
};

const FormEdit = (data: Pengguna) => {
    Object.assign(pengguna, {
        ...data,
        passwordnya: null,
    });
    isClean.value = true;
    formDialog.value = true;
    isEdit.value = true;
};

const FormDelete = (data: Pengguna) => {
    deletePengguna(data.id);
};

const FormHakAkses = (data: Pengguna) => {
    router.push(`/pengguna/${data.usernamenya}/hak-akses`);
};

const Save = async () => {
    try {
        isClean.value = false;
        if (isError.value) {
            return;
        }
        if (isEdit.value) {
            await updatePengguna(pengguna.id as number, pengguna as any).then(() => {
                isClean.value = true;
                formDialog.value = false;
            });
        } else {
            await createPengguna(pengguna as any).then(() => {
                isClean.value = true;
            });
        }
        await fetchPengguna();
    } catch (error) {}
};
</script>

<style lang="scss" scoped></style>
