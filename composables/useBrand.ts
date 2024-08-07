import useCrud from './base/useGeneral';
import type { NewBrand, Brand, UpdateBrand } from '../databases/brand/schema';

export default function useBrandCrud() {
  return useCrud<Brand, NewBrand, UpdateBrand>('api/brand');
}


// import { ref, reactive } from 'vue';
// import type { NewBrand, Brand, UpdateBrand } from '../databases/brand/schema';

// interface ApiResponse {
//     data: Brand[];
// }

// interface ApiResponseData {
//     data: Brand;
// }

// const baseUrl = 'api/brand';

// type Nullable<T> = {
//     [K in keyof T]: T[K] | null;
// };

// export default function BrandCRUD() {
//     const lItem: Ref<Brand[]> = ref([]);

//     function createEmptyFormTemplate<T>(): Nullable<T> {
//         const template: Partial<Nullable<T>> = {};
//         for (const key in {} as T) {
//             if (Object.prototype.hasOwnProperty.call({} as T, key)) {
//                 template[key as keyof T] = null;
//             }
//         }
//         return template as Nullable<T>;
//     }

//     const emptyFormTemplate = createEmptyFormTemplate<NewBrand>();

//     const item = reactive(emptyFormTemplate);
//     const errors = ref();
//     const status = ref();
//     const isFetching = ref(false);

//     // Fetch all lItem
//     async function fetchItem() {
//         isFetching.value = true;
//         errors.value = null;
//         try {
//             const { data, error, status, refresh } = await useAsyncData('item', () => $fetch(`/${baseUrl}`));
//             errors.value = error;
//             status.value = status.value;
//             // Type assertion after checking data
//             if (data.value && typeof data.value === 'object' && 'data' in data.value) {
//                 const responseData = data.value as ApiResponse;
//                 lItem.value = responseData.data;
//             }
//         } catch (err: any) {
//             errors.value = err;
//         } finally {
//             isFetching.value = false;
//         }
//     }

//     // Create a new item
//     async function createItem(newItem: NewBrand) {
//         isFetching.value = true;
//         errors.value = null;
//         try {
//             const { data, error, status, refresh } = await useAsyncData('item', () =>
//                 $fetch(`/${baseUrl}}`, {
//                     method: 'POST',
//                     body: newItem,
//                 })
//             );

//             errors.value = error;
//             status.value = status.value;
//             if (data.value && typeof data.value === 'object' && 'data' in data.value) {
//                 const responseData = data.value as ApiResponseData;
//                 lItem.value.push(responseData.data);
//                 clearItemForm();
//             }
//         } catch (err: any) {
//             errors.value = err;
//         } finally {
//             isFetching.value = false;
//         }
//     }

//     // Update an existing item
//     async function updateItem(id: number, updatedItem: UpdateBrand) {
//         isFetching.value = true;
//         errors.value = null;
//         try {
//             const { data, error, status, refresh } = await useAsyncData('item:id', () =>
//                 $fetch(`/${baseUrl}/${id}`, {
//                     method: 'PATCH',
//                     body: updatedItem,
//                 })
//             );
//             console.log(data, error, status);

//             errors.value = error;
//             status.value = status.value;

//             if (data.value && typeof data.value === 'object' && 'data' in data.value) {
//                 const responseData = data.value as ApiResponseData;
//                 const itemIndex = lItem.value.findIndex((u: any) => u.id === item.id);
//                 lItem.value.splice(itemIndex, 1, responseData.data); // Update item in array
//                 clearItemForm();
//             }
//         } catch (err: any) {
//             errors.value = err;
//         } finally {
//             isFetching.value = false;
//         }
//     }

//     // Delete a item
//     async function deleteItem(id: number) {
//         isFetching.value = true;
//         errors.value = null;
//         try {
//             const { data, error, status, refresh } = await useAsyncData('item:id', () => $fetch(`/${baseUrl}/${id}`, { method: 'DELETE' }));
//             errors.value = error;
//             status.value = status.value;
//             if (data.value && typeof data.value === 'object' && 'data' in data.value) {
//                 const itemIndex = lItem.value.findIndex((u: any) => u.id === id);
//                 lItem.value.splice(itemIndex, 1); // Remove item from array
//                 clearItemForm();
//             }
//         } catch (err: any) {
//             errors.value = err;
//         } finally {
//             isFetching.value = false;
//         }
//     }

//     // Clear item form data
//     function clearItemForm() {
//         Object.assign(item, emptyFormTemplate);
//         return item;
//     }

//     return {
//         lItem,
//         item,
//         errors,
//         status,
//         isFetching,
//         fetchItem,
//         createItem,
//         updateItem,
//         deleteItem,
//         clearItemForm,
//     };
// }
