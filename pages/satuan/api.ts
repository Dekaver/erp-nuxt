const baseUrl = '/api/satuan';
import qs from 'qs';

export default {
    index(query={}) {
        return $fetch(`/${baseUrl}?${qs.stringify(query)}`);
    },
    store(form: RequestInit) {
        return $fetch(`/${baseUrl}/`, {
            method: 'POST',
            body: form,
        });
    },
    update(usernamenya: string, form: RequestInit) {
        return $fetch(`/${baseUrl}/${usernamenya}`, {
            method: 'PATCH',
            body: form,
        });
    },
    show(usernamenya: string) {
        return $fetch(`/${baseUrl}/${usernamenya}`);
    },
    destroy(usernamenya: string) {
        return $fetch(`/${baseUrl}/${usernamenya}`);
    },
};
