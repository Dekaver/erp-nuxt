<template>
    <div class="login-body">
        <div class="bg-img">
            <img src="/layout/images/latar2.jpg" alt="" />
        </div>

        <div class="login-wrapper">
            <div class="login-panel">
                <Toast />
                <div class="card flex">
                    <div class="col-6 p-2">
                        <div class="logo">
                            <img src="/layout/images/erp-ori-nocapt.png" alt="poseidon-layout" />
                        </div>
                        <p class="m-0">Selamat datang di ERP Nusantara</p>
                        <form class="login-form" @submit.prevent="login">
                            <InputText v-model="form.usernamenya" type="text" autocomplete="on" placeholder="Username" :class="FormError?.usernamenya && 'p-invalid'" autofocus />
                            <InputText v-model="form.passwordnya" type="password" autocomplete="off" placeholder="Password" :class="FormError?.passwordnya" />
                            <!-- <Checkbox /> -->
                            <!-- <div class="g-recaptcha mb-4 mx-auto flex justify-content-center" :data-sitekey="siteKey" ref="recaptcha"></div> -->
                            <Button type="submit" class="w-100" :disabled="$isLoading" :loading="$isLoading">
                                <span v-if="!$isLoading" class="text-center w-full"> LOGIN </span>
                                <span v-if="$isLoading" class="text-center w-full">
                                    <i class="pi pi-spinner pi-spin"></i>
                                </span>
                            </Button>
                        </form>
                        <p class="m-0">Lupa password ? Hubungi admin</p>
                    </div>
                    <div class="col-4 p-2">
                        <!-- <div class="bg-blue-100 flex border-round justify-content-center align-items-center h-full p-4">
                            <img class="logo-client max-h-9rem max-w-15rem" src="/layout/images/kata.png" alt="poseidon-layout" />
                        </div> -->
                        <div class="flex border-round justify-content-center align-items-center h-full p-3" style="border-left: 1px solid lightgrey">
                            <img class="logo-client max-h-12rem max-w-20rem" src="/layout/images/tw-logo.jpg" alt="poseidon-layout" />
                        </div>
                    </div>
                </div>

                <!-- <p>A problem? <router-link to="/">Click here</router-link> and let us help you.</p> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/user';
const { loginSchema, form, errors, isFetching, loginUser, clearUserForm } = useAuth();
//use guest layout
definePageMeta({
    layout: 'guest',
});
useHead({
    title: 'Nuxt 3 Minimal Starter',
});

const userStore = useUserStore();
const router = useRouter();
const isClean = ref(true);
const $isLoading = ref(false);

const FormSchema = loginSchema;

const FormError = computed(() => {
    if (isClean.value) {
        return;
    }
    return FormSchema.safeParse(form).error?.format();
});

const isError = computed(() => {
    return Object.keys(FormError.value || {}).length > 0;
});

const login = async () => {
    await loginUser(form as any)
        .then((res: any) => {
            userStore.setUser(res.data.user);
            userStore.setPermission(res.data.permission);
            router.replace('/');
        })
        .catch((err) => {});
};
</script>

<style scoped>
.p-field {
    margin-bottom: 1rem;
}
</style>

<style scoped>
.p-field {
    margin-bottom: 1rem;
}
</style>

<style>
.login-body {
    background-size: cover;
    background-position: center;

    color: #c3ccdd;
    height: 100vh;
}
.login-body .bg-img img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}
.login-body .login-wrapper {
    position: relative;
    z-index: 2;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 100vh;
}
.login-body .login-wrapper .login-panel {
    width: 50vw;
    height: 100%;
    text-align: center;
    /* padding: 40px 20px; */
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: center;
    -ms-flex-direction: column;
    flex-direction: column;
}
.login-body .login-wrapper .login-panel .col {
    height: inherit;
}
.login-body .login-wrapper .login-panel .logo img {
    height: 45px;
}
.login-body .login-wrapper .login-panel .login-form {
    margin: 1.75rem 0 2.5rem;
}
.login-body .login-wrapper .login-panel .login-form > p {
    font-weight: normal;
    margin: 0;
    color: #4a4c51;
}
.login-body .login-wrapper .login-panel .login-form > p > a {
    color: #f4f7f9;
    cursor: pointer;
}
.login-body .login-wrapper .login-panel .login-form > input {
    width: 100%;
    /* max-width: 310px; */
    margin-bottom: 20px;
    background-color: #f6f9fe;
    color: #515c66;
}
.login-body .login-wrapper .login-panel .login-form > input::placeholder {
    color: #515c66;
}
.login-body .login-wrapper .login-panel .login-form > button {
    width: 100%;
    /* max-width: 310px; */
}
.login-body .login-wrapper .login-panel p {
    font-weight: normal;
    color: #4a4c51;
}
.login-body .login-wrapper .login-panel p > a {
    color: #f4f7f9;
}

.login-body .card {
    background-color: #f6f9fe;
    border: none;
    padding: 30px;
    border-radius: 10px;
}

@media (max-width: 992px) {
    .login-body .login-wrapper .login-panel {
        width: 100%;
    }
}
</style>
