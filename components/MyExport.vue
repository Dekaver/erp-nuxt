<template>
    <div>
        <SplitButton
            :label="generateMenuItems()[0].label"
            :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
            :model="generateMenuItems()"
            :disabled="loading || isError || $isLoading.value"
            :loading="$isLoading.value"
            v-if="generateMenuItems().length > 0"
            :severity="isError ? 'danger' : 'help'"
            @click="isTree ? exportToExcelFromTree() : exportToExcel()"
        >
            <span class="">
                <span class="pi" :class="$isLoading.value || loading ? 'pi-spin pi-spinner' : 'pi-file-excel'"></span>
                <span class="ml-2">
                    {{ label }}
                </span>
            </span>
        </SplitButton>
        <Button
            :label="label"
            :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-file-excel'"
            @click="isTree ? exportToExcelFromTree() : exportToExcel()"
            :disabled="loading || isError || $isLoading.value"
            :loading="loading || $isLoading.value"
            v-else
            :severity="isError ? 'danger' : 'help'"
        />
        <div id="content" class="hidden">
            <h3 class="text-center">{{ title }}</h3>
            <table>
                <thead>
                    <tr>
                        <th>NO</th>
                        <th v-for="column in selectedColumns" :key="column.field">
                            {{ column.header }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in value" :key="data">
                        <td class="text-center">{{ index + 1 }}</td>
                        <td v-for="column in selectedColumns" :key="column.field">
                            <span v-if="column.type == 'html'" v-html="data[column.field]"></span>
                            <span v-else-if="column.type == 'status'" class="capitalize">{{ this.$h.getLabel(data[column.field]) }}</span>
                            <span v-else>{{ formatData(data, column) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Excel from 'exceljs'
import { usePDF } from 'vue3-pdfmake'
import { htmlToText } from 'html-to-text'
import * as FileSaver from 'file-saver'

export default {
    props: {
        label: {
            type: String,
            default: 'Export XLSX',
        },
        showPDF: {
            type: Boolean,
            default: false,
        },
        isError: {
            type: Boolean,
            default: false,
        },
        isUrut: {
            type: Boolean,
            default: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Array,
            required: true,
        },
        selectedColumns: {
            type: Array,
            required: [],
        },
        columns: {
            type: Array,
            default: [],
        },
        title: {
            type: String,
            default: 'exported_data',
        },
        optionsPDF: {
            type: Object,
            default: () => {},
        },
        orientation: {
            type: String,
            default: 'portrait',
        },
        isTree: {
            type: Boolean,
            default: false,
        },
        filter: {
            type: Object,
            default: () => {},
        },
        filterColumns: {
            type: Array,
            required: false,
        },
    },
    data() {
        return {
            pdfmake: usePDF({
                autoInstallVFS: true,
            }),
            defaultMenuItems: [
                {
                    label: 'Export to PDF',
                    icon: 'pi pi-file-pdf',
                    action: 'pdf',
                    command: () => {
                        this.withLoading()
                    },
                },
            ],
            option: {},
            dummy: [],
        }
    },
    methods: {
        generateMenuItems() {
            let menu = this.defaultMenuItems

            menu = this.showExcel ? menu : menu.filter((item) => item.action != 'excel')

            menu = this.showPDF ? menu : menu.filter((item) => item.action != 'pdf')

            return menu
        },
        handleItemClick(item) {
            if (item.command) {
                item.command()
            }
        },
        exportToExcel() {
            const data = this.value
            const selectedColumns = this.selectedColumns.length > 0 ? this.columns.filter((item) => [...this.selectedColumns].includes(item.field)) : this.columns

            // Create a new Excel workbook
            const workbook = new Excel.Workbook()
            const worksheet = workbook.addWorksheet('Sheet1')

            // Add a title row
            worksheet.addRow([this.title])
            const titleRow = worksheet.getRow(1)
            titleRow.font = { bold: true, size: 16 }
            titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
            titleRow.height = 30 // Adjust as needed

            // Merge title row cells
            const totalColumns = selectedColumns.length + 1 // Including the 'No' column
            worksheet.mergeCells(1, 1, 1, totalColumns)

            // Add a separator row
            worksheet.addRow(Array(selectedColumns.length + 1).fill(''))
            const separatorRow = worksheet.getRow(2)
            separatorRow.height = 15 // Adjust as needed

            // Add a header row
            const headerRowValues = ['No', ...selectedColumns.map((column) => column.header)]
            worksheet.addRow(headerRowValues)
            const headerRow = worksheet.getRow(3)
            headerRow.font = { bold: true, size: 12 } // Adjust font size and bold

            // Add data rows
            data.forEach((item, index) => {
                const rowData = [index + 1, ...selectedColumns.map((column) => this.formatData(item, column))]
                worksheet.addRow(rowData)
            })

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const length = cell.value ? cell.value.toString().length : 10 // Default width
                    if (length > maxLength) {
                        maxLength = length
                    }
                })
                column.width = maxLength < 10 ? 10 : maxLength + 2 // Set minimum width
            })

            // Apply borders
            const lastRowNumber = worksheet.rowCount
            for (let i = 3; i <= lastRowNumber; i++) {
                const row = worksheet.getRow(i)
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    }
                })
            }

            // Save workbook as Excel file
            workbook.xlsx
                .writeBuffer()
                .then((buffer) => FileSaver.saveAs(new Blob([buffer]), `${this.title}_by ${this.$auth.pegawai.nama}_${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()}.xlsx`))
                .catch((err) => console.log('Error writing excel export', err))
        },
        exportToExcelFromTree() {
            console.log('tree')
            const data = this.value
            const selectedColumns = this.selectedColumns

            // Create a new Excel workbook
            const workbook = new Excel.Workbook()
            const worksheet = workbook.addWorksheet('Sheet1')

            // Add a title row
            worksheet.addRow([this.title])
            const titleRow = worksheet.getRow(1)
            titleRow.font = { bold: true, size: 16 }
            titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
            titleRow.height = 30 // Adjust as needed

            // Merge title row cells
            const totalColumns = selectedColumns.length + 1 // Including the 'No' column
            worksheet.mergeCells(1, 1, 1, totalColumns)

            // Add a separator row
            worksheet.addRow(Array(selectedColumns.length + 1).fill(''))
            const separatorRow = worksheet.getRow(2)
            separatorRow.height = 15 // Adjust as needed

            // Add a filter row
            worksheet.addRow([...this.filterColumns.map((column) => column.header)])
            worksheet.addRow([...this.filterColumns.map((column) => this.filter[column.field])])
            worksheet.addRow(Array(selectedColumns.length + 1).fill(''))
            const filterRow = worksheet.getRow(3)
            filterRow.font = { bold: true, size: 12 } // Adjust font size and bold

            // Add a header row
            const headerRowValues = [...selectedColumns.map((column) => column.header)]
            worksheet.addRow(headerRowValues)
            const headerRow = worksheet.getRow(6)
            headerRow.font = { bold: true, size: 12 } // Adjust font size and bold

            data.forEach((item, index) => {
                const header = [...selectedColumns.map((column) => this.formatData(item.data, column))]
                this.dummy.push(header)
                worksheet.addRow(header)
                item.children.forEach((child) => {
                    const row = [...selectedColumns.map((column) => this.formatData(child.data, column))]
                    this.dummy.push(row)
                    worksheet.addRow(row)
                })
            })

            // Auto-fit columns
            worksheet.columns.forEach((column) => {
                let maxLength = 0
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const length = cell.value ? cell.value.toString().length : 10 // Default width
                    if (length > maxLength) {
                        maxLength = length
                    }
                })
                column.width = maxLength < 10 ? 10 : maxLength + 2 // Set minimum width
            })

            // Apply borders
            const lastRowNumber = worksheet.rowCount
            for (let i = 3; i <= lastRowNumber; i++) {
                const row = worksheet.getRow(i)
                row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    }
                })
            }

            // Save workbook as Excel file
            workbook.xlsx
                .writeBuffer()
                .then((buffer) => FileSaver.saveAs(new Blob([buffer]), `${this.title}_${new Date().getTime()}.xlsx`))
                .catch((err) => console.log('Error writing excel export', err))
        },

        exportToPDF() {
            try {
                const doc = {
                    pageSize: 'A4',
                    pageOrientation: this.orientation,
                    pageMargins: [40, 60, 40, 60],
                    content: [
                        { text: this.title, style: 'header', alignment: 'center' },
                        {
                            style: 'tableExample',
                            table: {
                                headerRows: 1,
                                widths: [],
                                body: [],
                            },
                        },
                    ],
                    footer(currentPage, pageCount) {
                        return {
                            style: 'tableExample',
                            table: {
                                widths: '*',
                                body: [[{ text: 'Page ' + currentPage.toString() + ' of ' + pageCount, alignment: 'right', style: 'normalText', margin: [0, 20, 50, 0], aligment: 'left' }]],
                            },
                            layout: 'noBorders',
                        }
                    },
                    styles: {
                        header: {
                            fontSize: 18,
                            bold: true,
                            margin: [0, 0, 0, 10],
                        },
                        tableExample: {
                            fontSize: 8,
                        },
                    },
                }

                const widths = this.isUrut ? ['auto'] : []
                const header = this.isUrut ? ['No.'] : []

                const longestHeader = this.selectedColumns.reduce((longest, current) => {
                    return current.header.length > longest.length ? current.header : longest
                }, '')
                this.selectedColumns.map((column) => {
                    if (column.header == longestHeader) {
                        widths.push('*')
                    } else {
                        widths.push('auto')
                    }
                    header.push(column.header)
                })

                doc.content[1].table.widths = widths
                doc.content[1].table.body.push(header)

                this.value.forEach((item, i) => {
                    const row = this.isUrut ? [i + 1] : []
                    this.selectedColumns.map((column) => {
                        row.push(this.formatData(item, column))
                    })
                    doc.content[1].table.body.push(row)
                })
                this.pdfmake.createPdf(doc).download(`${this.title}-${new Date()}.pdf`)
            } catch (error) {
                console.error(error)
            } finally {
                this.$timeoutLoading()
            }
        },
        formatData(item, column) {
            switch (column.type) {
                case 'date':
                    return this.$h.formatDate(item[column.field]) !== 'Invalid date' ? this.$h.formatDate(item[column.field]) : item[column.field]
                case 'currency':
                    return this.$h.formatNumber(item[column.field])
                case 'number':
                    return this.$h.formatNumber(item[column.field])
                case 'html':
                    return htmlToText(item[column.field])
                case 'status': {
                    const string = this.$h.getLabel(item[column.field])
                    return string.charAt(0).toUpperCase() + string.slice(1)
                }
                default:
                    return item[column.field]
            }
        },
        /**
         * Executes the export to PDF process after setting the loading state to true.
         * This is done to ensure that the loading state is updated before the PDF export is called.
         */
        withLoading() {
            // Set the loading state to true
            this.$isLoading.value = true
            // Delay the PDF export by 100 milliseconds to ensure the loading state is updated in the HTML
            setTimeout(() => {
                // Call the method to export PDF after a short delay
                this.exportToPDF()
            }, 100)
        },
    },
}
</script>

<style scoped>
/* Your component's styles here */
table,
td,
th {
    border-collapse: collapse;
    border: 1px solid black;
}
table {
    width: 100%;
}
th,
td {
    padding: 5px 10px;
}
</style>
