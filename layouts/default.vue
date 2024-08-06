<template>
    <div class="layout-wrapper layout-horizontal layout-menu-dim layout-topbar-light">
        <Menubar :model="menubar" style="background-color: #fff; z-index: 999" class="fixed top-0 w-full px-4 text-sm">
            <template #start>
                <NuxtLink to="/">
                    <img id="app-logo" alt="poseidon-layout" :src="'layout/images/logo-poseidon.png'" class="mr-4" style="width: auto; height: 40px" />
                </NuxtLink>
                <NuxtLink to="/">
                    <img
                        id="app-logo2"
                        alt="poseidon-layout"
                        :src="'/layout/images/tw-logo.jpg'"
                        class="mr-4"
                        style="width: auto; height: 40px; border-left: 1px solid lightgrey; padding-left: 1rem"
                    />
                </NuxtLink>
            </template>
            <template #end>
                <div class="flex align-items-center gap-2">
                    <span class="hidden lg:inline text-right">{{ userStore.nama }}</span>
                    <Avatar
                        image="/layout/images/avatar1.png"
                        shape="circle"
                        size="large"
                        @click="toggle"
                        aria-haspopup="true"
                        aria-controls="overlay_menu"
                        class="cursor-pointer"
                        style="aspect-ratio: 1/1; object-fit: cover"
                    />
                    <Menu ref="menu" id="overlay_menu" :model="avatar_items" :popup="true" />
                </div>
                <!-- <NuxtLink to="/me">
                </NuxtLink> -->
            </template>
        </Menubar>
        <div class="layout-main">
            <!-- <ProgressBar v-if="" :showValue="false" style="height: 6px" :value="loadingState.progress" ></ProgressBar> -->
            <AppBreadcrumb></AppBreadcrumb>
            <Toast />

            <!-- <button @click="sendMessage">Kirim Pesan</button> -->
            <div class="layout-content">
                <slot />
            </div>

            <AppFooter></AppFooter>
        </div>
    </div>
</template>
<script>
const userPermissions = usePermissions();

const router = useRouter();

useHead({
    bodyAttrs: { class: 'main-body' },
});

export default {
    layout: 'default',
    setup() {
        const userStore = useUserStore();
        const abilityStore = useAbilityStore();
        return { userStore, abilityStore };
    },
    data() {
        return {
            menubar: null,
            userStore: useUserStore(),
            avatar_items: [
                { label: 'Profile', icon: 'pi pi-user', url: '/profil' },
                { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logOut() },
            ],
        };
    },
    mounted() {
        this.getPengguna().then(() => {
            this.getMenu();
        });
    },
    methods: {
        async getPengguna() {
            try {
                const { data } = await useAsyncData('user', () => this.userStore.checkAuth());
                this.abilityStore.updatePermission(data.value.permission.split(','));
                userPermissions.value = data.value.permission.split(',');
            } catch (error) {
                router.replace('/login');
            }
        },
        getMenu() {
            this.menubar = [
                {
                    label: 'Sales',
                    icon: 'pi pi-shopping-bag',
                    url: null,
                    items: [
                        {
                            url: '/sales-order',
                            icon: 'pi pi-shopping-cart',
                            label: 'Sales Order',
                        },
                        {
                            url: '/delivery-order',
                            icon: 'pi pi-car',
                            label: 'Delivery Order',
                        },
                        {
                            url: '/invoice',
                            icon: 'pi pi-book',
                            label: 'Invoice',
                        },
                        {
                            url: '/tanda-terima-invoice',
                            icon: 'pi pi-bookmark',
                            label: 'Tanda Terima Invoice',
                        },
                    ],
                },
                {
                    label: 'Purchase',
                    icon: 'pi pi-shopping-cart',
                    url: null,
                    items: [
                        {
                            url: '/purchase-request',
                            icon: 'pi pi-cart-plus',
                            label: 'Purchase Request',
                        },
                        {
                            url: '/rfq',
                            icon: 'pi pi-file-edit',
                            label: 'Request for Quotation',
                        },
                        {
                            url: '/purchase-order',
                            icon: 'pi pi-book',
                            label: 'Purchase Order',
                        },
                        {
                            url: '/penerimaan-barang',
                            icon: 'pi pi-inbox',
                            label: 'Good Receive',
                        },
                        {
                            url: '/account-payable',
                            icon: 'pi pi-clone',
                            label: 'AP',
                        },
                        {
                            url: '/material-request',
                            icon: 'pi pi-box',
                            label: 'Material Request',
                        },
                        {
                            url: '/purchase-return',
                            icon: 'pi pi-book',
                            label: 'Purchase Return',
                        },
                    ],
                },
                {
                    label: 'Finance',
                    icon: 'pi pi-dollar',
                    url: null,
                    items: [
                        {
                            url: '/kas/masuk',
                            icon: 'pi pi-arrow-left',
                            label: 'Cash In',
                        },
                        {
                            url: '/kas/keluar',
                            icon: 'pi pi-arrow-right',
                            label: 'Cash Out',
                        },
                        {
                            url: '/#payment-proposal',
                            icon: 'pi pi-arrows-alt',
                            label: 'Payment Proposal',
                        },
                        {
                            url: '/payment-ap',
                            icon: 'pi pi-briefcase',
                            label: 'Payment AP',
                        },
                        {
                            url: '/internal-cash-request',
                            icon: 'pi pi-briefcase',
                            label: 'Petty Cash',
                        },
                        {
                            url: '/petty-cash',
                            icon: 'pi pi-dollar',
                            label: 'Top Up Petty Cash',
                        },
                        {
                            url: '/#approval-internal-cash-request',
                            icon: 'pi pi-check-square',
                            label: 'Approval Petty Cash',
                        },
                        {
                            url: '/debit-note',
                            icon: 'pi pi-book',
                            label: 'Debit Note',
                        },
                        {
                            url: '/#jurnal-umum',
                            icon: 'pi pi-caret-down',
                            label: 'Journal',
                        },
                        {
                            url: '/finance/ar/payment',
                            icon: 'pi pi-money-bill',
                            label: 'Payment AR',
                        },
                    ],
                },
                {
                    label: 'Report',
                    icon: 'pi pi-chart-bar',
                    url: null,
                    items: [
                        {
                            url: '/report/history-stok',
                            icon: 'pi pi-inbox',
                            label: 'Kartu Stok',
                        },
                        {
                            url: '/report/stok-barang',
                            icon: 'pi pi-box',
                            label: 'Stock',
                        },
                        {
                            url: '/report/penjualan-produk',
                            icon: 'pi pi-folder-open',
                            label: 'Sales Report',
                        },
                        {
                            url: '/report/buku-besar',
                            icon: 'pi pi-book',
                            label: 'General Ledger',
                        },
                        {
                            url: '/report/piutang',
                            icon: 'pi pi-box',
                            label: 'Accounts Receivable',
                        },
                        {
                            url: '/report/penjualan-produk',
                            icon: 'pi pi-bolt',
                            label: 'Product Sales',
                        },
                        {
                            url: '/report/neraca',
                            icon: 'pi pi-chart-bar',
                            label: 'Balance Sheet',
                        },
                        {
                            url: '/report/purchase-order',
                            icon: 'pi pi-book',
                            label: 'Report Purchase Order',
                        },
                        {
                            url: '/report/petty-cash',
                            icon: 'pi pi-book',
                            label: 'Petty Cash',
                        },
                        {
                            url: '/report/jurnal',
                            icon: 'pi pi-book',
                            label: 'Journal History',
                        },
                        {
                            url: '/report/laba-rugi',
                            icon: 'pi pi-chart-line',
                            label: 'Profit & Loss',
                        },
                        {
                            url: '/report/umur-invoice-ar',
                            icon: 'pi pi-bitcoin',
                            label: 'Age Invoice AR',
                        },
                        {
                            url: '/report/umur-invoice-ap',
                            icon: 'pi pi-money-bill',
                            label: 'Age Invoice AP',
                        },
                        {
                            url: '/report/outstanding-po',
                            icon: 'pi pi-download',
                            label: 'Outstanding PO',
                        },
                        {
                            url: '/report/outstanding-so',
                            icon: 'pi pi-building',
                            label: 'Outstanding SO',
                        },
                        {
                            url: '/report/operation-cost',
                            icon: 'pi pi-money-bill',
                            label: 'Operation Cost',
                        },
                        {
                            url: '/report/hutang',
                            icon: 'pi pi-book',
                            label: 'Accounts Payable',
                        },
                        {
                            url: '/report/hutang-supplier',
                            icon: 'pi pi-book',
                            label: 'Supplier Payables',
                        },
                    ],
                },
                {
                    label: 'Master Data',
                    icon: 'pi pi-database',
                    url: null,
                    items: [
                        {
                            url: '/master/akun',
                            icon: 'pi pi-id-card',
                            label: 'COA',
                        },
                        {
                            url: '/master/satuan',
                            icon: 'pi pi-bookmark',
                            label: 'UOM',
                        },
                        {
                            url: '/brand',
                            icon: 'pi pi-tag',
                            label: 'Brand',
                        },
                        {
                            url: '/master/kontak',
                            icon: 'pi pi-calculator',
                            label: 'Contact',
                        },
                        {
                            url: '/part',
                            icon: 'pi pi-box',
                            label: 'Part',
                        },
                        {
                            url: '/proyek',
                            icon: 'pi pi-discord',
                            label: 'Project',
                        },
                        {
                            url: '/unit',
                            icon: 'pi pi-car',
                            label: 'Unit',
                        },
                        {
                            url: '/master/gudang',
                            icon: 'pi pi-home',
                            label: 'Warehouse ',
                        },
                        {
                            url: '/unit-part-kategori',
                            icon: 'pi pi-book',
                            label: 'Part Category',
                        },
                        {
                            url: '/unit-type',
                            icon: 'pi pi-book',
                            label: 'Unit Type',
                        },
                        {
                            url: '/unit-kategori',
                            icon: 'pi pi-book',
                            label: 'Unit Category',
                        },
                        {
                            url: '/top',
                            icon: 'pi pi-calendar-times',
                            label: 'TOP',
                        },
                        {
                            url: '/bin-location',
                            icon: 'pi pi-box',
                            label: 'Bin Location',
                        },
                        {
                            url: '/master/departemen',
                            icon: 'pi pi-chart-pie',
                            label: 'Departement',
                        },
                        {
                            url: '/jabatan',
                            icon: 'pi pi-briefcase',
                            label: 'Position',
                        },
                        {
                            url: '/master/icr/divisi',
                            icon: 'pi pi-book',
                            label: 'Divisi ICR',
                        },
                        {
                            url: '/master/icr/departemen',
                            icon: 'pi pi-book',
                            label: 'Departemen ICR',
                        },
                        {
                            url: '/pajak',
                            icon: 'pi pi-credit-card',
                            label: 'Tax',
                        },
                        {
                            url: '/hrd/pegawai',
                            icon: 'pi pi-user',
                            label: 'Employee',
                        },
                        {
                            url: '/master/icr/expense-type',
                            icon: 'pi pi-book',
                            label: 'Expense Type',
                        },
                        {
                            url: '/bank',
                            icon: 'pi pi-building',
                            label: 'Bank',
                        },
                        {
                            url: '/point-of-delivery',
                            icon: 'pi pi-flag',
                            label: 'Point of Delivery',
                        },
                        {
                            url: '/purchase-request-kategori',
                            icon: 'pi pi-book',
                            label: 'Purchase Request Category',
                        },
                        {
                            url: '/purchase-order-kategori',
                            icon: 'pi pi-align-justify',
                            label: 'Purchase Order Category',
                        },
                    ],
                },
                {
                    label: 'Setting',
                    icon: 'pi pi-cog',
                    url: null,
                    items: [
                        {
                            url: '/setting/saldo-awal',
                            icon: 'pi pi-dollar',
                            label: 'Initial Account Balance',
                        },
                        {
                            url: '/saldo-awal-ar',
                            icon: 'pi pi-dollar',
                            label: 'Initial AR Balance',
                        },
                        {
                            url: '/saldo-awal-ap',
                            icon: 'pi pi-dollar',
                            label: 'Initial AP Balance',
                        },
                        {
                            url: '/setting',
                            icon: 'pi pi-sitemap',
                            label: 'Approval Setting',
                        },
                        {
                            url: '/setting/menu',
                            icon: 'pi pi-bars',
                            label: 'Menu',
                        },
                        {
                            url: '/setting/role',
                            icon: 'pi pi-lock',
                            label: 'Role',
                        },
                        {
                            url: '/setting/permission',
                            icon: 'pi pi-shield',
                            label: 'Permission',
                        },
                        {
                            url: '/setting/klasifikasi-akun',
                            icon: 'pi pi-book',
                            label: 'Account Classification ',
                        },
                        {
                            url: '/hrd/pengguna',
                            icon: 'pi pi-user',
                            label: 'User',
                        },
                        {
                            url: '/setting/stok-awal-barang',
                            icon: 'pi pi-box',
                            label: 'Initial Stock Balance',
                        },
                    ],
                },
            ];
        },
        toggle(event) {
            this.$refs.menu.toggle(event);
        },
    },
};
</script>
<style>
@import '@/assets/css/layout-light.css';
</style>
<style>
* {
    font-family: 'nunito', sans-serif;
}

.field input {
    width: 100%;
}
.field .p-autocomplete {
    width: 100%;
}
.field .p-component {
    width: 100%;
}

.p-menuitem-active .p-submenu-list {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
}
.p-datatable-wrapper table.p-datatable-table tr th.right .p-column-header-content {
    flex-direction: row-reverse;
    flex-wrap: wrap;
    justify-content: space-between;
}

.p-datatable-wrapper table.p-datatable-table tr th.left .p-column-header-content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
}

.p-datatable-wrapper table.p-datatable-table tr th.center .p-column-header-content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}

/* Responsive layout */
@media (min-width: 768px) {
    .p-menuitem-active .p-submenu-list {
        grid-template-columns: repeat(2, 1fr); /* Two columns on screens wider than 768px */
    }
}

@media (min-width: 1200px) {
    .p-menuitem-active .p-submenu-list {
        grid-template-columns: repeat(2, max-content); /* Three columns on screens wider than 1200px */
    }
}
</style>
