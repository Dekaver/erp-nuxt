<template>
	<p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium">Oops! </span>{{ error._errors[0] }}</p>
	<p v-else="error" class="mt-2 text-sm text-red-600 dark:text-red-500"><slot/></p>
</template>

<script>
export default {
	name: "ErrorMsg",
	props: {
		error: Object,
	},
};
</script>

<style lang="scss" scoped></style>
