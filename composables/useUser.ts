import { type NewUsers, type UpdateUsers, type Users } from './../server/databases/user/schema';
import { ref, reactive, type Reactive } from 'vue';
import _ from 'lodash';

export default function userCrud() {
    const users: Ref<Users[]> = ref([]);

    const emptyFormTemplate: { [K in keyof NewUsers]: NewUsers[K] | null } = {
        username: null,
        email: null,
        password: null,
        avatar: null,
        id: undefined,
        created_at: undefined,
    };

    const user = reactive(emptyFormTemplate);
    const errors = ref(null);
    const isFetching = ref(false);

    // Fetch all users
    async function fetchUsers() {
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
    async function createUser(newUser: NewUsers) {
        isFetching.value = true;
        errors.value = null;
        try {
            user.created_at = undefined
            const response: any = await $fetch('/api/user', {
                method: 'POST',
                body: newUser,
            });
            users.value.push(response.data);
            user.id = undefined; // Clear form data after creation
            user.username = '';
            user.email = '';
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Update an existing user
    async function updateUser(id: number, updatedUser: UpdateUsers) {
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
        user.username = '';
        user.email = '';
        user.password = '';
        return user;
    }

    return {
        users,
        user,
        errors,
        isFetching,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        clearUserForm,
    };
}
