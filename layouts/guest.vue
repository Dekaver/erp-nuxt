<template>
    <slot />
</template>
<script>
useHead({
    bodyAttrs: { class: 'm-0' },
});
export default {
    layout: 'guest',
};
</script>
