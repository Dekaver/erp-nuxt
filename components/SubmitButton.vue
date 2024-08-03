<template>
    <SplitButton :label="label" :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-save'" :model="generateMenuItems(data)" :disabled="loading || isError" :loading="loading" v-if="generateMenuItems(data)" :severity="isError ? 'danger' : 'primary'"/>
    <Button :label="label" :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-save'" @click="click()" :disabled="loading || isError" :loading="loading" v-else :severity="isError ? 'danger' : 'primary'"/>
</template>

<script>
export default {
    name: 'SubmitButton',
    props: {
        label: {
            type: String,
            default: 'Save',
        },
        data: {
            type: Object,
            default: () => {},
        },
        showDraft: {
            type: Boolean,
            default: false,
        },
        showSend: {
            type: Boolean,
            default: false,
        },
        showClose: {
            type: Boolean,
            default: false,
        },
        showEstimate: {
            type: Boolean,
            default: false,
        },
        menuItems: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        click: {
            type: Function,
            default: () => {},
        },
        isError: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            defaultMenuItems: [
                {
                    label: 'Save as Draft',
                    icon: 'pi pi-pencil',
                    action: 'draft',
                },
                {
                    label: 'Request Approval',
                    icon: 'pi pi-send',
                    action: 'send',
                },
                {
                    label: 'Save Permanent',
                    icon: 'pi pi-lock',
                    action: 'close',
                },
                {
                    label: 'Save as Estimate',
                    icon: 'pi pi-send',
                    action: 'estimate',
                },
            ],
        }
    },
    methods: {
        generateMenuItems(data) {
            let menu = this.defaultMenuItems

            if (this.menuItems.length > 0) {
                menu = [...menu, ...this.menuItems]
            }

            menu = this.showDraft ? menu : menu.filter((item) => item.action != 'draft')

            menu = this.showSend ? menu : menu.filter((item) => item.action != 'send')

            menu = this.showClose ? menu : menu.filter((item) => item.action != 'close')
            
            menu = this.showEstimate ? menu : menu.filter((item) => item.action != 'estimate')

            if (menu.length > 0) {
                return menu.map((item) => ({
                    ...item,
                    command: () => this.$emit(item.action, data),
                }))
            } else {
                return
            }
        },
        handleItemClick(item) {
            if (item.command) {
                item.command()
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
