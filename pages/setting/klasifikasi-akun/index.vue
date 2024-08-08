<template>
	<div class="grid crud-demo">
		<div class="col-12">
			<div class="card">
				<div class="card-body">
					<TreeTable :value="lItem">
						<!-- <Column :columnKey="id" field="name" header="Name" expander></Column> -->
						<Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" :expander="col.expander"></Column>
						<Column header="Action" headerStyle="width:14%; min-width:10rem;">
							<template #body="slotProps">
								<Button v-if="slotProps.node.data.parent < 10" icon="pi pi-plus" class="p-button-rounded p-button-success mr-2" @click="FormNew(slotProps.node)" />
								<Button v-if="slotProps.node.data.id > 9" icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2" @click="FormEdit(slotProps.node)" />
								<Button v-if="slotProps.node.data.id > 9" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="FormDelete(slotProps.node.data)" />
							</template>
							<!-- <template #footer>
                                <Badge :value="totalDebit == totalKredit ? 'Saldo balance' : 'Saldo tidak balance'" :severity="totalDebit == totalKredit ? 'success' : 'danger'"></Badge>
                            </template> -->
						</Column>
					</TreeTable>
				</div>
			</div>
			<Toast />

			<Dialog v-model:visible="FormDialog" :style="{ width: '400px' }" header="Form Klasifikasi Akun" :modal="true" class="p-fluid">
				<div class="formgrid grid">
					<div class="field col-12">
						<Label required>Code</Label>
						<InputText disabled id="code" v-model.trim="item.code" required="true" :class="{ 'p-invalid': !!FormError.code }" />
						<ErrorMsg :error="FormError.code" />
					</div>
					<div class="field col-12 d-flex justifiy-content-center align-items-end">
						<Label for="name">Account </Label>
						<InputText id="name" v-model.trim="item.name" required="true" :class="{ 'p-invalid': !!FormError.name }" />
						<ErrorMsg :error="FormError.name" />
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
						>Are you sure you want to delete <b>{{ item.name }}</b
						>?</span
					>
				</div>
				<template #footer>
					<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteFormDialog = false" />
					<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="Destroy(item)" />
				</template>
			</Dialog>
			
			<DevOnly>
				<pre>{{ lItem }}</pre>
			</DevOnly>
		</div>
	</div>
</template>

<script>
// TODO : Ganti jadi composition api
// import { FilterMatchMode } from "primevue/api";
// import apiAkun from "../../../service/api/master/account";

import z from "zod";

// TODO: bedain edit sama create validation
const FormSchema = z.object({
	id: z.number().optional(),
	name: z.string().nonempty(),
	code: z.string().optional(),
	parent: z.number(),
});

export default {
	data() {
		return {
			expandedRowGroups: null,
			expandedKeys: {},
			columns: [
				{ field: "name", header: "Name", expander: true },
				{ field: "code", header: "Code" },
			],
			lItem: [],
			item: {
				id: null,
				name: null,
				code: null,
				category: null,
				debit: null,
				kredit: null,
			},
			lAccount: null,
			selectedAccount: null,
			filteredAccount: null,
			FormDialog: false,
			deleteFormDialog: false,
			filters: {},
			FormError: {},
			isSubmitted: false,
			isEdit: false,
		};
	},
	mounted() {
		this.getData();
	},
	computed: {
		totalDebit() {
			return this.lItem && this.lItem.reduce((total, item) => parseFloat(total) + parseFloat(item.debit), 0);
		},
		totalKredit() {
			return this.lItem && this.lItem.reduce((total, item) => parseFloat(total) + parseFloat(item.kredit), 0);
		},
	},
	methods: {
		onRowGroupExpand(event) {
			this.$toast.add({
				severity: "info",
				summary: "Row Group Expanded",
				detail: "Value: " + event.data,
				life: 3000,
			});
		},
		onRowGroupCollapse(event) {
			this.$toast.add({
				severity: "success",
				summary: "Row Group Collapsed",
				detail: "Value: " + event.data,
				life: 3000,
			});
		},
		async getData() {
			await $fetch('/api/account')
				.then((res) => {
					this.lItem = res.data;
				})
				.catch(() => {
					this.$toast.add({
						severity: "error",
						summary: "Failed",
						detail: "Failed Load Data Saldo Awal",
						life: 3000,
					});
				});
			await $fetch(`/api/account`,{
				method: 'GET',
				query: {
					category: "1,2,3",
				}
			})
				.then((res) => {
					this.lAccount = res.data;
					this.filteredAccount = res.data;
				})
				.catch(() => {
					this.$toast.add({
						severity: "error",
						summary: "Failed",
						detail: "Failed Load Data Akun",
						life: 3000,
					});
				});
		},
		Save() {
			this.isSubmitted = true;
			let valid = FormSchema.safeParse(this.item);
			if (valid.success === false) {
				this.FormError = valid.error.format();
				return;
			}
			if (this.isEdit) {
				$fetch(`/api/account/${this.item.id}`, { 
					method: 'PUT', 
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(this.item)
				})
					.then((res) => {
						this.$toast.add({
							severity: "success",
							summary: "Success",
							detail: res.message,
							life: 3000,
						});
						this.getData();
						this.HideDialog();
						this.isEdit = false;
					})
					.catch((err) => {
						this.$toast.add({
							severity: "error",
							summary: "Failed",
							detail: err.response.data.message,
							life: 3000,
						});
					});
			} else {
				$fetch(`/api/account`, {
					method: 'POST',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(this.item)
				})
					.then((res) => {
						this.$toast.add({
							severity: "success",
							summary: "Success",
							detail: res.data.message,
							life: 3000,
						});
						this.getData();
						this.HideDialog();
					})
					.catch((err) => {
						this.$toast.add({
							severity: "error",
							summary: "Failed",
							detail: err.response.data.message,
							life: 3000,
						});
					});
			}
			this.isSubmitted = false;
		},
		Destroy(item) {
			$fetch(`/api/account/${item.id}`, {
				method: 'DELETE',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(this.item)
			})
				.then((res) => {
					this.$toast.add({
						severity: "success",
						summary: "Success",
						detail: res.data.message,
						life: 3000,
					});
					this.getData();
					this.deleteFormDialog = false;
				})
				.catch((err) => {
					this.$toast.add({
						severity: "error",
						summary: "Failed",
						detail: err.response.data.message,
						life: 3000,
					});
				});
		},
		HideDialog() {
			this.FormDialog = false;
			this.isSubmitted = false;
			this.item = {};
			this.selectedAccount = null;
			this.FormError = {};
		},
		FormNew(parent) {
			this.item = {
				grandparent: parent ? parent.data.parent : null,
				parent_level: parent ? parent.data.level : 0,
				parent: parent ? parent.data.id : null,
				id_category: parent ? parent.data.id_category : null,
				code: "",
				level: parent ? parent.data.level + 1 : 1
			};
			this.FormError = {};
			this.isSubmitted = false;
			this.FormDialog = true;
		},
		FormEdit(item) {
			this.FormError = {};
			this.item = {
				...item.data,
			};
			this.selectedAccount = this.lAccount.find((account) => account.id === item.id);
			this.isEdit = true;
			this.isSubmitted = false;
			this.FormDialog = true;
		},
		FormDelete(item) {
			this.item = item;
			this.deleteFormDialog = true;
		},
		searchAccount(event) {
			setTimeout(() => {
				if (!event.query.trim().length) {
					this.filteredAccount = [...this.lAccount];
				} else {
					this.filteredAccount = this.lAccount.filter((account) => {
						return account.name.toLowerCase().includes(event.query.toLowerCase()) || account.code.toLowerCase().includes(event.query.toLowerCase());
					});
				}
			}, 250);
		},
		selectAccount(event) {
			this.item.id = event.value.id;
			this.item.category = event.value.id_category;
			this.item.name = event.value.name;
			this.item.code = event.value.code;
		},
		// exportCSV() {
		//     this.$refs.dt.exportCSV();
		// },
	},
};
</script>

<style scoped lang="scss">
</style>