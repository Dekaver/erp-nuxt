import { ref, reactive } from 'vue';
import _ from 'lodash';
import type { NewPengguna, Pengguna, UpdatePengguna } from '../server/api/pengguna/schema';

export default function userCrud() {
    const users: Ref<Pengguna[]> = ref([]);

    const emptyFormTemplate: { [K in keyof NewPengguna]: NewPengguna[K] | null } = {
        usernamenya: null,
        passwordnya: null,
        id: undefined,
        id_pegawai: null,
        dibuat: undefined,
        loginterakhir: undefined,
        enabled: true,
        jmlogin: 0,
        loginterbaru: undefined,
        pinnya: null,
    };

    const user = reactive(emptyFormTemplate);
    const errors = ref(null);
    const isFetching = ref(false);

    // Fetch all users
    async function fetchPengguna() {
        isFetching.value = true;
        errors.value = null;
        try {
            const response: any = await $fetch('/api/user');
            users.value = response.data;
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Create a new user
    async function createUser(newUser: NewPengguna) {
        isFetching.value = true;
        errors.value = null;
        try {
            const response: any = await $fetch('/api/user', {
                method: 'POST',
                body: newUser,
            });
            users.value.push(response.data);
            user.id = undefined; // Clear form data after creation
            user.usernamenya = '';
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Update an existing user
    async function updateUser(id: number, updatedUser: UpdatePengguna) {
        isFetching.value = true;
        errors.value = null;
        try {
            const response: any = await $fetch(`/api/user/${id}`, {
                method: 'PATCH',
                body: updatedUser,
            });
            const userIndex = users.value.findIndex((u: any) => u.id === user.id);
            users.value.splice(userIndex, 1, response.data); // Update user in array
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Delete a user
    async function deleteUser(id: number) {
        isFetching.value = true;
        errors.value = null;
        try {
            await $fetch(`/api/user/${id}`, {
                method: 'DELETE',
            });
            const userIndex = users.value.findIndex((u: any) => u.id === id);
            users.value.splice(userIndex, 1); // Remove user from array
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Clear user form data
    function clearUserForm() {
        user.id = undefined;
        user.usernamenya = '';
        user.passwordnya = '';
        return user;
    }

    return {
        users,
        user,
        errors,
        isFetching,
        fetchPengguna,
        createUser,
        updateUser,
        deleteUser,
        clearUserForm,
    };
}
