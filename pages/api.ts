export default {
    login: async (email: string, password: string) => {
        return await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email,
                password,
            },
        });
    },
};
