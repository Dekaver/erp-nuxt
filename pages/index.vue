<template>
    <div v-can="'setting'">Hello world</div>
    {{ usePermissions().value.includes('setting') }}
    <br />
    {{ $can('read', 'barang') }}
    <AutoCompletePegawai ref="autoCompletePegawai"></AutoCompletePegawai>
    <Can ref="can" I="read" a="barang"> Baca Barang </Can>
</template>
<script setup lang="ts">
const ability = useAbilityStore();
definePageMeta({
    middleware: ['nuxt-permissions'],
    permissions: ['setting'],
});
</script>
