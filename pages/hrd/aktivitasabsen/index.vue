<template>
    <div class="grid crud-demo">
        <div class="col-12">
            <div class="card">
                <Toast />

                <!-- FILTER SECTION -->
                <div class="p-fluid formgrid grid my-4">
                    <div class="field col-2">
                        <label for="bulan" class="mb-2">Bulan<small class="text-red-500">*</small></label>
                        <Dropdown id="bulan" v-model="f.selectedBulan" :options="f.bulan" optionLabel="nama"> </Dropdown>
                    </div>
                    <div class="field col-2">
                        <label for="tahun" class="mb-2">Tahun<small class="text-red-500">*</small></label>
                        <InputText id="tahun" type="text" v-model="f.tahun" />
                    </div>
                </div>
                <!-- FILTER SECTION END -->

                <DataTable
                    ref="dt"
                    :value="lItem"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    rowGroupMode="rowspan"
                    groupRowsBy="id"
                    sortMode="single"
                    sortField="id"
                    :sortOrder="1"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Daftar Aktivitas Absen</h5>
                            <MultiSelect v-model="selectedColumns" :options="Columns" optionLabel="header" placeholder="Select Column" class="w-full md:w-20rem ml-auto" />
                            <span class="block mt-2 ml-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>
                    <template #empty>
                        <div class="text-center">Empty</div>
                    </template>
                    <Column header="#" headerStyle="width:10px">
                        <template #body="slotProps">
                            {{ slotProps.index + 1 }}
                        </template>
                    </Column>

                    <Column v-for="(col, index) of selectedColumns" :field="col.field" :header="col.header" :class="col.class" :key="col.field + '_' + index" :sortable="true">
                        <template #body="{ data, field }">
                            <div>{{ data[field] }}</div>
                        </template>
                    </Column>

                    <!-- action -->
                    <Column header="Aksi" headerStyle="width:6%; max-width:1rem;">
                        <template #body="{ data, _ }">
                            <Button icon="pi pi-eye" class="p-button p-button-primary mr-2" @click="FormEdit(data)" />
                        </template>
                    </Column>

                </DataTable>

                <!-- Dialog -->
                <Dialog v-model:visible="formDialog" :style="{ width: '450px' }" header="Form Item" :modal="true" class="p-fluid">
                    <div class="formgrid grid">
                        <div class="field col-12">
                            <Label required for="item">Nama</Label>
                            <InputText id="item" v-model.trim="item.nama" required="true" autofocus :class="FormError.nama && 'p-invalid'" />
                            <ErrorMsg :error="FormError.nama" />
                        </div>
                        <div class="field col-12">
                            <Label required for="item">Latitude</Label>
                            <InputText id="item" v-model.trim="item.latitude" required="true" autofocus :class="FormError.latitude && 'p-invalid'" type="number" />
                            <ErrorMsg :error="FormError.latitude" />
                        </div>
                        <div class="field col-12">
                            <Label required for="item">Longitude</Label>
                            <InputText id="item" v-model.trim="item.longitude" required="true" autofocus :class="FormError.longitude && 'p-invalid'" type="number" />
                            <ErrorMsg :error="FormError.longitude" />
                        </div>
                        <div class="field col-4">
                            <Label required for="item">Jarak Absen</Label>
                            <InputNumber id="item" v-model="item.jarak_absen" :min="0" required="true" autofocus :class="FormError.jarak_absen && 'p-invalid'" />
                            <ErrorMsg :error="FormError.jarak_absen" />
                        </div>
                        <div class="field col-4 md:col-1 align-self-center mt-4">
                            <span class="font-bold">Meter</span>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="HideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="Save" />
                    </template>
                </Dialog>
                <Dialog v-model:visible="deleteFormDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="item"
                            >Are you sure you want to delete <b>{{ item.nama }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteFormDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="Destroy(item)" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { AxiosError } from 'axios'
import { FilterMatchMode } from 'primevue/api'
import z from '../../../Helpers/custom-zod'
import apiAbsenTempat from '../../../service/api/hrd/absentempat.js'
import apiPegawai from "../../../service/api/master/hrd/pegawai";

const BaseSchema = z.object({
    nama: z.string().min(1).max(255),
    jarak_absen: z.number(),
})
export default {
    data() {
        return {
            lItem: [],
            item: {
                nama: null,
                latitude: null,
                longitude: null,
                jarak_absen: null,
            },
            selectedItem: null,

            filters: {},
            f: {
                selectedBulan: null,
                bulan: [
                    { id: 1, nama: "Januari" },
                    { id: 2, nama: "February" },
                    { id: 3, nama: "Maret" },
                    { id: 4, nama: "April" },
                    { id: 5, nama: "Mei" },
                    { id: 6, nama: "Juni" },
                    { id: 7, nama: "Juli" },
                    { id: 8, nama: "Agustus" },
                    { id: 9, nama: "September" },
                    { id: 10, nama: "Oktober" },
                    { id: 11, nama: "November" },
                    { id: 12, nama: "Desember" },
                ],
                tahun: null,
            },

            // table
            selectedColumns: [
                { field: 'nama', header: 'Nama', class: 'w-20rem' },
                { field: 'jabatan', header: 'Jabatan', class: 'w-20rem' },
                { field: 'departemen', header: 'Departemen', class: 'w-20rem' },
            ],
            Columns: [
                { field: "nama", header: "Nama", class: "w-20rem" },
                { field: 'jabatan', header: 'Jabatan', class: 'w-20rem' },
                { field: "departemen", header: "Departemen", class: "w-20rem" },
            ],

            // dialog
            isClean: true,
            isEdit: false,
            formDialog: false,
            deleteFormDialog: false,
        }
    },
    created() {
        this.initFilters()
    },
    mounted() {
        this.f.selectedBulan = this.f.bulan.find((b) => b.id == new Date().getMonth() + 1);
        this.f.tahun = new Date().getFullYear();

        this.getData()
    },
    computed: {
        FormError() {
            return (!this.isClean && BaseSchema.safeParse(this.item)?.error?.format()) || {}
        },
    },
    methods: {
        async getData() {
            await apiPegawai.index().then((res) => {
                this.lItem = res.data.data
            })
        },
        async Save() {
            try {
                this.$isLoading.value = true
                this.isClean = false
                if (Object.keys(this.FormError).length > 0) {
                    return
                }

                if (this.isEdit) {
                    await apiAbsenTempat
                        .update(this.item.id, {
                            ...this.item,
                            latitude: Number(this.item.latitude),
                            longitude: Number(this.item.longitude),
                        })
                        .then((res) => {
                            this.$toast.add({ severity: 'success', summary: 'Successful', detail: res.data.message, life: 3000 })
                            this.lItem[this.lItem.findIndex((val) => val.id === this.item.id)] = this.item
                            this.formDialog = false
                        })
                } else {
                    await apiAbsenTempat
                        .store({
                            ...this.item,
                            latitude: Number(this.item.latitude),
                            longitude: Number(this.item.longitude),
                        })
                        .then((res) => {
                            this.$toast.add({ severity: 'success', summary: 'Successful', detail: res.data.message, life: 3000 })
                            this.lItem.push(res.data.data)
                            this.formDialog = false
                        })
                }
            } catch (error) {
                console.log(error)
                if (error instanceof z.ZodError) {
                    this.FormError = error.format()
                } else if (error instanceof AxiosError) {
                    this.$toast.add({ severity: 'error', summary: 'Failed', detail: error.response.data.message, life: 3000 })
                }
            } finally {
                this.$timeoutLoading()
            }
        },
        async Destroy(data) {
            this.lItem = this.lItem.filter((val) => val.id !== data.id)
            await apiAbsenTempat.destroy(data.id).then((res) => {
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: res.data.message, life: 3000 })
                this.getData()
                this.deleteFormDialog = false
            })
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            }
        },
        exportCSV() {
            this.$refs.dt.exportCSV()
        },
        FormNew() {
            this.item = {}
            this.FormError = {}
            this.formDialog = true
            this.isClean = true
        },
        FormEdit(data) {
            this.$router.push({
                name: "aktivitas-absen.edit",
                query: {
                    id: data.id,
                    name: data.nama,
                    month: this.f.selectedBulan.id,
                    bulan: this.f.selectedBulan.nama,
                    year: this.f.tahun,
                },
            });
        },
        confirmDelete(data) {
            this.item = { ...data }
            this.deleteFormDialog = true
        },
        HideDialog() {
            this.formDialog = false
        },
    },
}
</script>

<style lang="scss" scoped></style>
