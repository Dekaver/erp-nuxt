import { ref, reactive } from 'vue';
import _, { method } from 'lodash';
import type { NewPengguna, Pengguna, UpdatePengguna } from '../server/api/pengguna/schema';

interface ApiResponse {
    data: Pengguna[];
}

interface ApiResponseData {
    data: Pengguna;
}

export default function PenggunaCRUD() {
    const lpengguna: Ref<Pengguna[]> = ref([]);

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

    const pengguna = reactive(emptyFormTemplate);
    const errors = ref();
    const status = ref();
    const isFetching = ref(false);

    // Fetch all lpengguna
    async function fetchPengguna() {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status, refresh } = await useAsyncData('pengguna', () => $fetch('/api/pengguna'));
            errors.value = error;
            status.value = status.value;
            // Type assertion after checking data
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponse;
                lpengguna.value = responseData.data;
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Create a new pengguna
    async function createPengguna(newPengguna: NewPengguna) {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status, refresh } = await useAsyncData('pengguna', () =>
                $fetch('/api/pengguna', {
                    method: 'POST',
                    body: newPengguna,
                })
            );

            errors.value = error;
            status.value = status.value;
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponseData;
                lpengguna.value.push(responseData.data);
                clearPenggunaForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Update an existing pengguna
    async function updatePengguna(id: number, updatedPengguna: UpdatePengguna) {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status, refresh } = await useAsyncData('pengguna:id', () =>
                $fetch(`/api/pengguna/${id}`, {
                    method: 'PATCH',
                    body: updatedPengguna,
                })
            );
            console.log(data, error, status);
            

            errors.value = error;
            status.value = status.value;

            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponseData;
                const penggunaIndex = lpengguna.value.findIndex((u: any) => u.id === pengguna.id);
                lpengguna.value.splice(penggunaIndex, 1, responseData.data); // Update pengguna in array
                clearPenggunaForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Delete a pengguna
    async function deletePengguna(id: number) {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status, refresh } = await useAsyncData('pengguna:id', () => $fetch(`/api/pengguna/${id}`, { method: 'DELETE' }));
            errors.value = error;
            status.value = status.value;
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponseData;
                const penggunaIndex = lpengguna.value.findIndex((u: any) => u.id === id);
                lpengguna.value.splice(penggunaIndex, 1); // Remove pengguna from array
                clearPenggunaForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Clear pengguna form data
    function clearPenggunaForm() {
        pengguna.id = undefined;
        pengguna.usernamenya = '';
        pengguna.passwordnya = '';
        pengguna.id_pegawai = null;
        return pengguna;
    }

    return {
        lpengguna,
        pengguna,
        errors,
        status,
        isFetching,
        fetchPengguna,
        createPengguna,
        updatePengguna,
        deletePengguna,
        clearPenggunaForm,
    };
}
