<template>
    <!-- DataTable -->
    <DataTable
        ref="dt"
        dataKey="id"
        v-model:selection="selectedRow"
        :value="value"
        :paginator="paginator"
        :rows="rows"
        :filters="filters"
        :size="option.size"
        :rowsPerPageOptions="rowPerPage"
        :rowClass="option.rowClass"
        selectionMode="single"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries."
        responsiveLayout="scroll"
        @page="onPage"
        @row-dblclick="onRowDblclick"
        @update:rows="onRowsChange"
        scrollable
    >
        <template v-if="showHeader" #header>
            <div class="flex flex-col md:flex-row justify-between items-center">
                <h5 class="m-0">{{ title }}</h5>
                <div class="flex gap-2 col-12 md:col-5 ml-auto">
                    <IconField iconPosition="left" class="block p-input-icon-left w-full">
                        <InputIcon class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Search..." class="w-full" />
                    </IconField>
                    <MultiSelect v-model="columnSelected" :options="columns" optionLabel="header" placeholder="Select Column" class="w-12" />
                </div>
            </div>
        </template>
        <template #empty>
            <div v-if="$isLoading.value" class="flex gap-2">
                <Skeleton width="10%" />
                <Skeleton v-for="(col, index) of columnSelected" :key="col.field + '_' + index" />
                <Skeleton width="10%" />
            </div>
            <div v-else class="flex flex-column align-items-center justify-content-center relative">
                <img src="~/assets/img/empty.png" alt="" width="200" height="200" />
            </div>
        </template>
        <Column v-if="rowNumber" header="No" headerStyle="width:1%;" style="text-align: right" frozen>
            <template #body="slotProps">
                {{ page * rows + slotProps.index + 1 }}
            </template>
        </Column>
        <Column
            v-for="(col, index) of columnSelected"
            :field="col.field"
            :header="col.header"
            :class="col.class"
            :key="col.field + '_' + index"
            :sortable="sortable"
            :footer="footer"
            :footerClass="footerClass"
        >
            <template #body="{ data, field }">
                <slot v-if="col.type == 'custom'" name="custom" :data="data" :field="field" :index="index">
                    <div>{{ data[field] }}</div>
                </slot>
                <div v-else-if="col.type == 'icon'">
                    <Button :icon="data[field]" class="p-button-rounded p-button-outlined p-button-icon" />
                </div>
                <div v-else-if="col.type == 'date'">
                    {{ formatDate(data[field]) }}
                </div>
                <div v-else-if="col.type == 'month'">
                    {{ formatDate(data[field], 'MM-YYYY') }}
                </div>
                <div v-else-if="col.type == 'time'">
                    {{ formatDate(data[field], 'LLL') }}
                </div>
                <div v-else-if="col.type == 'currency'" class="text-right">
                    {{ formatNumber(data[field]) }}
                </div>
                <div v-else-if="col.type == 'number'" class="text-right">{{ formatNumber(data[field]) }}</div>
                <div v-else-if="col.type == 'percent'" class="text-right">{{ formatNumber(data[field]) }}%</div>
                <div v-else-if="col.type == 'boolean'" class="text-center">
                    <Tag v-if="data[field]" severity="open" value="Yes" />
                    <Tag v-else severity="close" value="No" />
                </div>
                <div v-else-if="field == 'status'">
                    <Tag :value="getLabel(data[field])" :severity="getLabel(data[field])" />
                </div>
                <div v-else>{{ data[field] }}</div>
            </template>
        </Column>
        <Column v-if="showAction" header="Aksi" headerStyle="width:6%; max-width:2%;" alignFrozen="right" frozen>
            <template #body="{ data, index }">
                <slot name="action" :data="data" :index="index">
                    <ActionButton
                        :data="data"
                        :index="index"
                        :showEdit="showEdit(data)"
                        :showDelete="showDelete(data)"
                        :showPrint="showPrint(data)"
                        :showJurnal="showJurnal(data)"
                        :showDuplicate="showDuplicate(data)"
                        :menuItems="option.menuItems"
                    />
                </slot>
            </template>
        </Column>
        <ColumnGroup type="footer">
            <slot name="footer-group"></slot>
        </ColumnGroup>
    </DataTable>
    <!-- Confirm Dialog -->
    <Dialog v-model:visible="deleteDialog" style="width: 450px" header=" " :modal="true">
        <div class="flex flex-col gap-2 items-center justify-center">
            <img src="~/assets/img/confirm_delete.svg" alt="" width="250" />
            <span class="text-center">
                Are you sure you want to delete
                <br />
                <b class="text-xl">{{ item[option.primaryField] }}?</b>
            </span>
            <span class="text-red-500 font-bold">You can't undo this action.</span>
        </div>
        <template #footer>
            <div class="flex items-center justify-center w-full gap-2">
                <Button label="No" severity="secondary" @click="deleteDialog = false" class="flex-1" autofocus />
                <Button label="Yes" severity="danger" @click="FormDelete(item)" class="flex-1" />
            </div>
        </template>
    </Dialog>
</template>
<script>
export default {
    name: 'DataTableList',
    props: {
        value: {
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
        paginator: {
            type: Boolean,
            default: true,
        },
        sortable: {
            type: Boolean,
            default: true,
        },
        rowPerPage: {
            type: Array,
            default: [5, 10, 25, 50, 100, 500, 1000],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        showAction: {
            type: Boolean,
            default: true,
        },
        rowNumber: {
            type: Boolean,
            default: true,
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        footerClass: {
            type: String,
            default: null,
        },
        footer: {
            type: String,
            default: null,
        },
        options: {
            type: Object,
            default: () => {
                return {}
            },
        },
    },
    data() {
        return {
            item: {},
            selectedRow: null,
            deleteDialog: false,
            filters: {},
            page: 0,
            rows: 10,
            option: {
                size: 'small',
                // Show Action
                showDelete: true,
                showEdit: true,
                showPrint: false,
                showJurnal: false,
                showDuplicate: false,
                ...this.options,
                menuItems: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-pencil',
                        action: 'edit',
                        command: (data) => this.FormEdit(data),
                    },
                    {
                        label: 'Delete',
                        icon: 'pi pi-trash',
                        action: 'delete',
                        command: (data) => this.confirmDelete(data),
                    },
                    {
                        label: 'Print',
                        icon: 'pi pi-print',
                        action: 'print',
                        command: (data) => this.FormPrint(data),
                    },
                    {
                        label: 'Jurnal',
                        icon: 'pi pi-book',
                        action: 'jurnal',
                        command: (data) => this.FormJurnal(data),
                    },
                    {
                        label: 'Duplicate',
                        icon: 'pi pi-copy',
                        action: 'duplicate',
                        command: (data) => this.FormDuplicate(data),
                    },
                    ...(this.options.menuItems || []),
                ],
            },
            columnSelected: [],
        }
    },
    created() {
        this.initFilters()
    },
    mounted() {
        this.columnSelected = this.selectedColumns && this.selectedColumns.length > 0 ? this.columns.filter((item) => [...this.selectedColumns].includes(item.field)) : this.columns
    },
    watch: {
        columnSelected(val) {
            this.$emit(
                'update:selectedColumns',
                val.map((item) => item.field),
            )
        },
    },
    methods: {
        // Filter
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: 'contains' },
            }
        },

        // Pagination
        onPage(event) {
            this.page = event.page
        },
        onRowsChange(value) {
            this.rows = value
        },

        // Action Emit
        onRowDblclick(event) {
            this.FormEdit(event.data)
        },
        confirmDelete(data) {
            this.deleteDialog = true
            this.item = data
        },
        FormEdit(data) {
            this.$emit('edit', data)
        },
        FormDelete(data) {
            this.$emit('delete', data)
            this.item = {}
            this.deleteDialog = false
        },
        FormPrint(data) {
            this.$emit('print', data)
        },
        FormJurnal(data) {
            this.$emit('jurnal', data)
        },
        FormDuplicate(data) {
            this.$emit('duplicate', data)
        },
        // ActionButton
        /**
         * Determines whether to show the delete option based on the provided data and the options.
         *
         * @param {Object} data - The data used to determine if the delete option should be shown.
         * @return {boolean} Returns true if the delete option should be shown, otherwise false.
         */

        showDelete(data) {
            // this.columns.find((item) => item.field == this.option.showDelete.key)
            // cek status
            const status = typeof data.status == 'string'
            // cek draft
            const isDraft = data.status == 'D'
            return typeof this.option.showDelete == 'boolean'
                ? status
                    ? this.option.showDelete && isDraft
                    : this.option.showDelete
                : [...this.option.showDelete.value].includes(data[this.option.showDelete.key]) && this.option.showDelete.permission === true
        },
        showEdit(data) {
            return typeof this.option.showEdit == 'boolean' ? this.option.showEdit : [...this.option.showEdit.value].includes(data[this.option.showEdit.key])
        },
        showPrint(data) {
            return typeof this.option.showPrint == 'boolean' ? this.option.showPrint : [...this.option.showPrint.value].includes(data[this.option.showPrint.key])
        },
        showJurnal(data) {
            return typeof this.option.showJurnal == 'boolean' ? this.option.showJurnal : [...this.option.showJurnal.value].includes(data[this.option.showJurnal.key])
        },
        showDuplicate(data) {
            return typeof this.option.showDuplicate == 'boolean' ? this.option.showDuplicate : [...this.option.showDuplicate.value].includes(data[this.option.showDuplicate.key])
        },
    },
}
</script>
