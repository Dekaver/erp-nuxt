<script>
export default {
    name: 'BaseAutoComplete',
    props: {
        modelValue: {
            type: Number,
            default: null,
        },
        required: {
            type: Boolean,
            default: false,
        },
        error: {
            type: Object,
            default: () => {},
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        options: { // ! nanti watch
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            lItem: [],
            filteredItem: [],
            selectedItem: null,
            option: {
                type: 'option',
                // limit: 10,
                ...this.options,
            },
        };
    },
    watch: {
        modelValue(newValue) {
            this.selectedItem = this.lItem.find((item) => item.id == newValue);
            this.$emit('update:modelValue', this.selectedItem?.id);
        },
    },
    mounted() {
        this.getData().then(() => {
            this.selectedItem = this.lItem.find((item) => item.id == this.modelValue);
        });
    },
    methods:{
        selectItem(event) {
            // Child
            this.$emit('update:modelValue', this.selectedItem.id);
            // Parent
            this.$emit('selectItem', event);
        },
        clearItem() {
            // Child
            this.$emit('update:modelValue', null);
            this.selectedItem = null;
            // Parent
            this.$emit('clearItem');
        },
    }
};
</script>
