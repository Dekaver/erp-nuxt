<template>
    <div>
        <Menu :ref="`menu_${index}`" :popup="true" :model="generateMenuItems(data)">
            <template #item="{ label, props }">
                <a class="flex" v-bind="props.action">
                    <span v-bind="props.icon" />
                    <span v-bind="props.label">{{ label }}</span>
                </a>
            </template>
        </Menu>
        <Button icon="pi pi-ellipsis-v" class="p-button-secondary p-button-outlined h-2rem w-2rem" @click="$refs[`menu_${index}`].toggle($event)"></Button>
    </div>
</template>

<script>
export default {
    name: 'ActionButton',
    props: {
        data: {
            type: Object,
            default: () => {},
        },
        index: {
            type: Number,
            default: 0,
        },
        showEdit: {
            type: Boolean,
            default: true,
        },
        showDelete: {
            type: Boolean,
            default: true,
        },
        showPrint: {
            type: Boolean,
            default: false,
        },
        showJurnal: {
            type: Boolean,
            default: false,
        },
        showDuplicate: {
            type: Boolean,
            default: false,
        },
        menuItems: {
            type: Array,
            default: () => [
                {
                    label: 'Edit',
                    icon: 'pi pi-pencil',
                    action: 'edit',
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                    action: 'delete',
                },
                {
                    label: 'Print',
                    icon: 'pi pi-print',
                    action: 'print',
                },
                {
                    label: 'Jurnal',
                    icon: 'pi pi-book',
                    action: 'jurnal',
                },
            ],
        },
    },
    data() {
        return {
            defaultMenuItems: [
                {
                    label: 'Edit',
                    icon: 'pi pi-pencil',
                    action: 'edit',
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-trash',
                    action: 'delete',
                },
                {
                    label: 'Print',
                    icon: 'pi pi-print',
                    action: 'print',
                },
                {
                    label: 'Jurnal',
                    icon: 'pi pi-book',
                    action: 'jurnal',
                },
            ],
        };
    },
    methods: {
        generateMenuItems(data) {
            let menu = this.menuItems;

            menu = this.showEdit ? menu : menu.filter((item) => item.action != 'edit');

            menu = this.showDelete ? menu : menu.filter((item) => item.action != 'delete');

            menu = this.showPrint ? menu : menu.filter((item) => item.action != 'print');

            menu = this.showJurnal ? menu : menu.filter((item) => item.action != 'jurnal');

            menu = this.showDuplicate ? menu : menu.filter((item) => item.action != 'duplicate');

            return menu.map((item) => ({
                ...item,
                command: () => (item.command ? item.command(this.data) : this.$emit(item.action, data)),
            }));
            // command: () => this.$emit(item.action, data),
        },
    },
};
</script>
