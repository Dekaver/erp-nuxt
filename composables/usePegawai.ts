import { ref, reactive } from 'vue';
import _, { method } from 'lodash';
import type { NewPegawai, Pegawai, UpdatePegawai } from '../server/api/pegawai/schema';

interface ApiResponse {
    data: Pegawai[];
}

interface ApiResponseData {
    data: Pegawai;
}

type Nullable<T> = {
    [K in keyof T]: T[K] | null;
  };

export default function PegawaiCRUD() {
    const lpegawai: Ref<Pegawai[]> = ref([]);

    // create null value
    function createEmptyFormTemplate<T>(): Nullable<T> {
        const template: Partial<Nullable<T>> = {};
        for (const key in {} as T) {
          if (Object.prototype.hasOwnProperty.call({} as T, key)) {
            template[key as keyof T] = null;
          }
        }
        return template as Nullable<T>;
      }

    const emptyFormTemplate = createEmptyFormTemplate<NewPegawai>();

    const pegawai = reactive(emptyFormTemplate);
    const errors = ref(null);
    const isFetching = ref(false);

    // Fetch all lpegawai
    async function fetchPegawai() {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status, refresh } = await useAsyncData('pegawai', () => $fetch('/api/pegawai'));
            // Type assertion after checking data
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponse;
                lpegawai.value = responseData.data;
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Create a new pegawai
    async function createPegawai(newPegawai: NewPegawai) {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status, refresh } = await useAsyncData('pegawai', () =>
                $fetch('/api/pegawai', {
                    method: 'POST',
                    body: newPegawai,
                })
            );
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponseData;
                lpegawai.value.push(responseData.data);
                clearPegawaiForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Update an existing pegawai
    async function updatePegawai(id: number, updatedPegawai: UpdatePegawai) {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status, refresh } = await useAsyncData('pegawai:id', () =>
                $fetch(`/api/pegawai/${id}`, {
                    method: 'PATCH',
                    body: updatedPegawai,
                })
            );

            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponseData;
                const pegawaiIndex = lpegawai.value.findIndex((u: any) => u.id === pegawai.id);
                lpegawai.value.splice(pegawaiIndex, 1, responseData.data); // Update pegawai in array
                clearPegawaiForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Delete a pegawai
    async function deletePegawai(id: number) {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status, refresh } = await useAsyncData('pegawai:id', () => $fetch(`/api/pegawai/${id}`, { method: 'DELETE' }));
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponseData;
                const pegawaiIndex = lpegawai.value.findIndex((u: any) => u.id === id);
                lpegawai.value.splice(pegawaiIndex, 1); // Remove pegawai from array
                clearPegawaiForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Clear pegawai form data
    function clearPegawaiForm() {
        pegawai.id = undefined;
        return pegawai;
    }

    return {
        lpegawai,
        pegawai,
        errors,
        isFetching,
        fetchPegawai,
        createPegawai,
        updatePegawai,
        deletePegawai,
        clearPegawaiForm,
    };
}
