<template>
    <Toolbar>
        <template v-slot:start>
            <div v-if="useNew" class="my-2" >
                <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="FormNew" />
            </div>
            <Button v-if="useFilter"
                icon="pi pi-filter"
                class="p-button mx-2"
                label="Filter"
                @click="filter = !filter"
                :class="{
                    'p-button-block': filter,
                    'p-button-outlined': !filter,
                }"
            />
            <slot name="start" />
        </template>

        <template v-slot:end>
            <MyExport :value="lItem" :selectedColumns="selectedColumns" :title="title" />
            <slot name="end" />
        </template>
    </Toolbar>

    <div class="card fadein" :class="{ hidden: !filter }">
        <h5 class="mbe-4">Filter Surat Pesanan</h5>
        <div class="p-fluid formgrid flex gap-2">
            <div v-if="usePeriode" class="field w-1/5">
                <Label>Start Date</Label>
                <Calendar v-model="f.awal" dateFormat="dd-mm-yy" :maxDate="f.akhir" />
            </div>
            <div v-if="usePeriode" class="field w-1/5">
                <Label>End Date</Label>
                <Calendar ref="calendar" v-model="f.akhir" :minDate="f.awal" />
            </div>
            <slot name="filter" :f="f" />
            <div v-if="useStatus" class="field w-1/5">
                <Label for="status">Status</Label>
                <Dropdown id="status" v-model="f.selectedStatus" :options="statuses" optionLabel="label" placeholder="All"> </Dropdown>
            </div>

            <div class="field col-auto" style="display: flex; align-items: flex-end; align-content: flex-end">
                <Button label="Search" @click="getData" />
            </div>
        </div>
    </div>
</template>
<script>
import Calendar from './Calendar.vue';
export default {
    components: {
        Calendar,
    },
    name: 'ToolBarList',
    props: {
        useNew: {
            type: Boolean,
            default: true,
        },
        usePeriode: {
            type: Boolean,
            default: false,
        },
        useStatus: {
            type: Boolean,
            default: false,
        },
        useFilter: {
            type: Boolean,
            default: true,
        },

        // export
        lItem: {
            type: Array,
            default: [],
        },
        selectedColumns: {
            type: Array,
            default: [],
        },
        columns: {
            type: Array,
            default: [],
        },
        title: {
            type: String,
            default: 'Data Table List',
        },
    },
    data() {
        return {
            filter: false,
            f: {
                awal: null,
                akhir: null,
                selectedStatus: null,
            },
            statuses: [
                { label: 'Draft', value: 'draft' },
                { label: 'Send', value: 'send' },
                { label: 'Close', value: 'close' },
            ],
        };
    },
    methods: {
        FormNew() {
            this.$emit('new');
        },
        getData() {
            this.$emit('search', this.f);
        },
    },
};
</script>
