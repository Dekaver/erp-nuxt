export const $isLoading = ref(false);

export const setLoading = (loading: boolean) => {
    $isLoading.value = loading;
};

export const $timeoutLoading = () => {
    setTimeout(() => {
        $isLoading.value = false;
    }, 1200);
};
