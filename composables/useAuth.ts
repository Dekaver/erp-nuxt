import { ref, reactive } from 'vue';
import _ from 'lodash';
import z from 'zod';

type FormAuth = {
    usernamenya: string;
    passwordnya: string;
};
export default function authCrud() {
    const loginSchema = z.object({
        usernamenya: z.string().min(3),
        passwordnya: z.string().min(1),
    });

    const emptyFormTemplate: { [K in keyof FormAuth]: FormAuth[K] | null } = {
        usernamenya: null,
        passwordnya: null,
    };

    const form = reactive(emptyFormTemplate);
    const errors = ref(null);
    const isFetching = ref(false);

    // login user
    async function loginUser(newUser: FormAuth) {
        isFetching.value = true;
        errors.value = null;
        return await $fetch('/api/auth/login', {
            method: 'POST',
            body: newUser,
        });
    }

    // Clear form form data
    function clearUserForm() {
        form.usernamenya = '';
        form.passwordnya = '';
        return form;
    }

    return {
        loginSchema,
        form,
        errors,
        isFetching,
        loginUser,
        clearUserForm,
    };
}
