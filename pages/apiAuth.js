export default {
    async login(form) {
        return $fetch('/api/auth/login', {
            method: 'POST',
            body: form,
        });
    },
};
