const baseUrl = '/api/brand'

export default {
    index() {
        return $fetch(`${baseUrl}/`)
    },
    store(form: RequestInit) {
        return $fetch(`${baseUrl}/`, {
            method: 'POST',
            body: form
        })
    },
    update(usernamenya: string, form: RequestInit) {
        return $fetch(`${baseUrl}/${usernamenya}`, {
            method: 'PATCH',
            body: form
        })
    },
    show(usernamenya: string) {
        return $fetch(`${baseUrl}/${usernamenya}`)
    },
    destroy(usernamenya: string) {
        return $fetch(`${baseUrl}/${usernamenya}`, {
            method: 'DELETE'
        })
    },
    availablePegawai() {
        return $fetch(`${baseUrl}/pegawai`)
    },
    attachPermission(id: number, form: RequestInit) {
        return $fetch(`${baseUrl}/permission/${id}`, {
            method: 'POST',
            body: form
        })
    },
}
