<template>
    <Toast />
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5 class="my-4 ml-3">Absen {{ name }}, Periode {{ month_name }} {{ year }}</h5>

                <div class="p-fluid formgrid grid mt-4 mx-2">
                    <div class="col-12 my-5">
                        <DataTable :value="detail" tableClass="editable-cells-table p-datatable-small" tableStyle="table-layout: auto;">
                            <template #empty>
                                <div class="text-center">Empty</div>
                            </template>
                            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :headerStyle="col.width" :class="col.class">
                                <template #body="{ data, field }">
                                    <div v-if="!data['is_libur']">
                                        <div v-if="data['selected']">
                                            <div v-if="col.field == 'tanggal'">
                                                {{ `${data['nama_waktu']}, ${$h.formatDate(data[field], 'DD MMM YYYY')}` }}
                                            </div>
                                            <div v-else-if="col.field == 'time_in' || col.field == 'time_out'">
                                                {{ $h.formatTime(data[field], 'HH:mm A') }}
                                            </div>
                                            <div v-else-if="col.field == 'keterangan'">{{ data['keterangan'] }}</div>
                                            <div v-else-if="col.field == 'catatan'">{{ data['catatan'] }}</div>
                                        </div>
                                        <div v-else>
                                            <div v-if="col.field == 'tanggal'">
                                                {{ `${data['nama_waktu']}, ${$h.formatDate(data[field], 'DD MMM YYYY')}` }}
                                            </div>
                                            <div v-else-if="col.field == 'time_in'">
                                                <span class="text-red-500 font-bold">Libur</span>
                                            </div>
                                            <div v-else-if="col.field == 'keterangan'">{{ data['keterangan'] }}</div>
                                            <div v-else-if="col.field == 'catatan'">{{ data['catatan'] }}</div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div v-if="col.field == 'tanggal'">
                                            {{ `${data['nama_waktu']}, ${$h.formatDate(data[field], 'DD MMM YYYY')}` }}
                                        </div>
                                        <div v-else-if="col.field == 'time_in'">
                                            <span class="text-red-500 font-bold">{{ data['nama_hari_libur'] }}</span>
                                        </div>
                                        <div v-else-if="col.field == 'keterangan'">{{ data['keterangan'] }}</div>
                                        <div v-else-if="col.field == 'catatan'">{{ data['catatan'] }}</div>
                                    </div>
                                </template>
                            </Column>

                            <!-- action -->
                            <Column header="Ubah Status" class="ml-auto" headerStyle="width:14%;min-width:10rem">
                                <template #body="slotProps">
                                    <div v-if="slotProps.data.is_absen">
                                        <Button icon="pi pi-pencil" class="p-button p-button-primary mr-2" @click="edit(slotProps.data)" />
                                        <Button icon="pi pi-times" class="p-button p-button-danger mr-2" @click="confirmDelete(slotProps.data)" />
                                    </div>
                                    <div v-else>
                                        <Button icon="pi pi-check" class="p-button p-button-success mr-2" @click="check(slotProps.data)" />
                                        <Button icon="pi pi-plus" class="p-button p-button-success mr-2" @click="add(slotProps.data)" />
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>

                <!-- EDIT DIALOG -->
                <Dialog v-model:visible="formDialog" :style="{ width: '450px' }" header="Form Item" :modal="true" class="p-fluid">
                    <div class="formgrid grid">
                        <div class="field col-12">
                            <Label required for="tanggal">Tanggal</Label>
                            <InputText id="tanggal" v-model.trim="item.tanggal" required="true" autofocus :class="FormError.nama && 'p-invalid'" disabled />
                            <ErrorMsg :error="FormError.nama" />
                        </div>
                        <div class="field col-12">
                            <Label required for="status">Status Absen</Label>
                            <Dropdown v-model="item.selectedStatus" id="status" :options="lStatusAbsen" optionLabel="nama" class="min-w-max" />
                            <ErrorMsg :error="FormError.latitude" />
                        </div>
                        <div class="field col-12">
                            <Label required for="keterangan">Keterangan</Label>
                            <InputText id="keterangan" v-model.trim="item.catatan" required="true" autofocus :class="FormError.nama && 'p-invalid'" />
                            <ErrorMsg :error="FormError.nama" />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="HideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="Save" />
                    </template>
                </Dialog>

                <!-- DELETE DIALOG -->
                <Dialog v-model:visible="deleteFormDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="item"
                            >Are you sure you want to delete ?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteFormDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="Destroy()" />
                    </template>
                </Dialog>
                <br />
                <div class="grid mx-2 mt-2 mb-5">
                    <div class="col-6">
                        <div class="flex flex-wrap gap-3 justify-content-start">
                            <Button label="Back" severity="secondary" iconPos="left" icon="pi pi-arrow-left" @click="this.$router.back()" />
                        </div>
                    </div>
                    <!-- <div class="col-6">
                        <div class="flex flex-wrap gap-3 justify-content-end">
                            <Button label="Save" icon="pi pi-save" @click="submitForm()" />
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '../../../assets/custom/product-autocomplete.css'
import apiAbsensi from '../../../service/api/hrd/absensi.js'

export default {
    data() {
        return {
            item: {
                id: null,
                tanggal: null,
                catatan: null,
                selectedTanggal: null,
                selectedStatus: null,
            },
            lStatusType: [
                { nama: 'Harian', kode: 'h' },
                { nama: 'Mingguan', kode: 'm' },
            ],
            columns: [
                { field: 'tanggal', header: 'Tanggal', class: 'left' },
                { field: 'time_in', header: 'Jam Masuk', class: 'left' },
                { field: 'time_out', header: 'Jam Keluar', class: 'left' },
                { field: 'keterangan', header: 'Status Absen', class: 'left' },
                { field: 'catatan', header: 'Keterangan', class: 'left' },
            ],
            filters: {},

            lStatusAbsen: [{ nama: 'Masuk Tepat Waktu' }, { nama: 'Masuk Terlambat' }, { nama: 'Cuti Tahunan' }, { nama: 'Sakit' }, { nama: 'Izin' }],
            detail: [],

            isDone: false,
            isEdit: false,
            isClean: true,
            isSubmit: false,
            name: null,
            month: null,
            month_name: null,
            year: null,
            formDialog: false,
            deleteFormDialog: false,
        }
    },
    computed: {
        invalid: function () {
            return !(this.item.start_date != null)
        },
    },
    mounted() {
        this.item.id = this.$route.query.id
        this.isEdit = !!this.$route.params.id
        this.name = this.$route.query.name
        this.month = this.$route.query.month
        this.month_name = this.$route.query.bulan
        this.year = this.$route.query.year

        this.getData()
    },
    methods: {
        async Save() {
            try {
                if (this.isEdit) {
                    apiAbsensi
                        .update({
                            ...this.item,
                            tanggal: this.item.selectedTanggal,
                            keterangan: this.item.selectedStatus.nama,
                        })
                        .then((res) => {
                            this.formDialog = false
                            this.$toast.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: res.data.message,
                                life: 3000,
                            })
                            this.getData()
                        })
                        .catch((err) => {
                            this.$toast.add({
                                severity: 'error',
                                summary: 'Failed',
                                detail: err.response.data.message,
                                life: 3000,
                            })
                        })
                } else {
                    apiAbsensi
                        .create({
                            ...this.item,
                            tanggal: this.item.selectedTanggal,
                            keterangan: this.item.selectedStatus.nama,
                        })
                        .then((res) => {
                            this.formDialog = false
                            this.$toast.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: res.data.message,
                                life: 3000,
                            })
                            this.getData()
                        })
                        .catch((err) => {
                            this.$toast.add({
                                severity: 'error',
                                summary: 'Failed',
                                detail: err.response.data.message,
                                life: 3000,
                            })
                        })
                }
            } catch (err) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Failed',
                    detail: err.response.data.message,
                    life: 3000,
                })
            }
        },
        async Destroy() {
            apiAbsensi
                .destroy({
                    id: this.$route.query.id,
                    tanggal: this.item.selectedTanggal,
                })
                .then((res) => {
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: res.data.message,
                        life: 3000,
                    })
                    this.deleteFormDialog = false
                    this.getData()
                })
                .catch((err) => {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: err.response.data.message,
                        life: 3000,
                    })
                })
},
        async getData() {
            await apiAbsensi
                .aktivitasAbsen(this.item.id, this.month, this.year)
                .then((res) => {
                    this.detail = res.data.data
                })
                .catch(() => {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: 'Load Data Aktivitas Absen ',
                        life: 3000,
                    })
                })
        },
        add(data) {
            this.FormError = {}
            this.item.tanggal = this.$h.formatDate(data.tanggal, 'DD-MM-YYYY')
            this.item.selectedTanggal = data.tanggal
            this.item.catatan = data.catatan ?? ''
            this.item.selectedStatus = this.lStatusAbsen[0]

            this.formDialog = true
            this.isEdit = false
            this.isClean = true
        },
        edit(data) {
            this.FormError = {}
            this.item.tanggal = this.$h.formatDate(data.tanggal, 'DD-MM-YYYY')
            this.item.selectedTanggal = data.tanggal
            this.item.catatan = data.catatan ?? ''
            const keterangan = data.keterangan.toLowerCase().split(' , ');
            this.item.selectedStatus = this.lStatusAbsen.find((status) => status.nama.toLowerCase() === keterangan[0]) ?? this.lStatusAbsen[0]

            this.formDialog = true
            this.isEdit = true
            this.isClean = true
        },
        check(data) {
            this.FormError = {}
            this.item.tanggal = this.$h.formatDate(data.tanggal, 'DD-MM-YYYY')
            this.item.selectedTanggal = data.tanggal
            this.item.catatan = ''
            this.item.selectedStatus = this.lStatusAbsen[0]

            this.isEdit = false
            this.isClean = true

            this.Save()
        },
        confirmDelete(data) {
            this.FormError = {}
            this.item.tanggal = this.$h.formatDate(data.tanggal, 'DD-MM-YYYY')
            this.item.selectedTanggal = data.tanggal

            this.isEdit = false
            this.deleteFormDialog = true
            this.isClean = true
        },
        HideDialog() {
            this.formDialog = false
        },
    },
}
</script>

<style scoped></style>
