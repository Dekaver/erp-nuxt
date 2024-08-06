/**
 * Best Usage
 * const { data, loading, fetchData, } = useApi('/api/brand')
 * const { data: NewData, insertData, updateData, deleteData } = useApi('/api/brand')
 * 
 */


interface ApiResponse {
  message?: string
  data: any
}
interface Data {
  [key: string]: any
}
const nullData: Data = {}

export const useApi = (endpoint: string, extraendpoint?: string, query?: object) => {
  const data = ref<Data | Data[]>(nullData)
  const error = ref()
  const loading = ref(true)
  async function fetchData(){
    const {data: datafetch, error: errorfetch} = await useFetch<ApiResponse>(`${endpoint}${extraendpoint??''}`, {
      query
    })
    if (errorfetch.value){
      error.value = errorfetch.value
    }
    if (!datafetch.value){
      return;
    }
    data.value = datafetch.value.data
    loading.value = false
  }
  async function insertData(body: object) {
    const {data:datafetch,error: errorfetch} = await useFetch<ApiResponse>(`${endpoint}${extraendpoint??''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    if (errorfetch.value){
      error.value = errorfetch.value
    }

    if (!datafetch.value){
      return;
    }
    data.value = datafetch.value.data
    loading.value = false
  }
  async function updateData(id: number, body:object){
    console.log('im here brother')
    const { data:datafetch, error:errorfetch } = await useFetch<ApiResponse>(`${endpoint}${extraendpoint??''}/${id}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    if (errorfetch.value){
      error.value = errorfetch.value
    }

    if (!datafetch.value){
      return;
    }
    data.value = datafetch.value.data
  }
  async function deleteData(id: number){
    const { data:datafetch, error:errorfetch } = await useFetch<ApiResponse>(`${endpoint}${extraendpoint??''}/${id}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    
    if (errorfetch.value){
      error.value = errorfetch.value
    }

    if (!datafetch.value){
      return;
    }
    data.value = datafetch.value.data
  }

  return {
    data,
    loading,
    fetchData,
    insertData,
    updateData,
    deleteData,
  }
}
