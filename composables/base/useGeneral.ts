import { ref, reactive } from 'vue';

type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

interface ApiResponse<T> {
    data: T[];
}

interface ApiResponseData<T> {
    data: T;
}

function createEmptyFormTemplate<T>(): Nullable<T> {
    const template: Partial<Nullable<T>> = {};
    for (const key in {} as T) {
        if (Object.prototype.hasOwnProperty.call({} as T, key)) {
            template[key as keyof T] = null;
        }
    }
    return template as Nullable<T>;
}

export default function useCrud<T, NewT = T, UpdateT = T>(baseUrl: string) {
    const items: Ref<T[]> = ref([]);
    const emptyFormTemplate = createEmptyFormTemplate<NewT>();

    const item = reactive({ ...emptyFormTemplate });
    const errors = ref<any>(null);
    const status = ref<any>(null);
    const isFetching = ref(false);

    // Fetch all items
    async function fetchItems(extraendpoint?: string, query?: object) {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status: responseStatus } = await useAsyncData('items', () => $fetch(`/${baseUrl}${extraendpoint}`, {
                query
            }));
            errors.value = error;
            status.value = responseStatus;
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponse<T>;
                items.value = responseData.data;
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Create a new item
    async function createItem(newItem: NewT) {
        isFetching.value = true;
        errors.value = null;
        try {
            const {
                data,
                error,
                status: responseStatus,
            } = await useAsyncData('item', () =>
                $fetch(`/${baseUrl}`, {
                    method: 'POST',
                    body: JSON.parse(JSON.stringify(newItem)),
                })
            );
            errors.value = error;
            status.value = responseStatus;
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponseData<T>;
                items.value.push(responseData.data);
                clearItemForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Update an existing item
    async function updateItem(id: number, updatedItem: UpdateT) {
        isFetching.value = true;
        errors.value = null;
        try {
            const {
                data,
                error,
                status: responseStatus,
            } = await useAsyncData('item:id', () =>
                $fetch(`/${baseUrl}/${id}`, {
                    method: 'PATCH',
                    body: JSON.parse(JSON.stringify(updatedItem)),
                })
            );
            errors.value = error;
            status.value = responseStatus;
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const responseData = data.value as ApiResponseData<T>;
                const itemIndex = items.value.findIndex((u: any) => u.id === id);
                items.value.splice(itemIndex, 1, responseData.data);
                clearItemForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Delete an item
    async function deleteItem(id: number) {
        isFetching.value = true;
        errors.value = null;
        try {
            const { data, error, status: responseStatus } = await useAsyncData('item:id', () => $fetch(`/${baseUrl}/${id}`, { method: 'DELETE' }));
            errors.value = error;
            status.value = responseStatus;
            if (data.value && typeof data.value === 'object' && 'data' in data.value) {
                const itemIndex = items.value.findIndex((u: any) => u.id === id);
                items.value.splice(itemIndex, 1);
                clearItemForm();
            }
        } catch (err: any) {
            errors.value = err;
        } finally {
            isFetching.value = false;
        }
    }

    // Clear item form data
    function clearItemForm() {
        Object.keys(item).forEach((key) => {
            (item as Record<string, any>)[key] = null;
        });
        return item;
    }

    return {
        items,
        item,
        errors,
        status,
        isFetching,
        fetchItems,
        createItem,
        updateItem,
        deleteItem,
        clearItemForm,
    };
}
