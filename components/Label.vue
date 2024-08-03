<template>
    <label class="block mb-2 text-sm font-medium">
        {{ value }}
        <slot></slot>
        <small class="text-red-500 ml-1" v-if="required">*</small>
    </label>
</template>

<script>
export default {
    name: 'Label',
    props: {
        value: null,
        required: Boolean,
        labelClass: String,
    },
};
</script>

<style lang="scss" scoped></style>
