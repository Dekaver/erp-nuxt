<template>
    <div class="login-body">
        <div class="bg-img">
            <img src="/layout/images/latar2.jpg" alt="" />
        </div>

        <div class="login-wrapper">
            <div class="login-panel">
                <Toast />
                <div class="card grid py-5 px-0">
                    <div class="col">
                        <div class="logo">
                            <img src="/layout/images/erp-ori-nocapt.png" alt="poseidon-layout" />
                        </div>
                        <p class="m-0">Selamat datang di ERP Nusantara</p>
                        <form class="login-form" @submit.prevent="login">
                            <InputText v-model="user.usernamenya" type="text" autocomplete="on" placeholder="Username" :class="{ 'p-invalid': isSubmitted && !user.usernamenya }" autofocus />
                            <InputText v-model="user.passwordnya" type="password" autocomplete="off" placeholder="Password" :class="{ 'p-invalid': isSubmitted && !user.passwordnya }" />
                            <!-- <Checkbox /> -->
                            <!-- <div class="g-recaptcha mb-4 mx-auto flex justify-content-center" :data-sitekey="siteKey" ref="recaptcha"></div> -->
                            <Button type="submit" class="w-100" :disabled="$isLoading.value" :loading="$isLoading.value">
                                <span v-if="!$isLoading.value" class="text-center w-full"> LOGIN </span>
                                <span v-if="$isLoading.value" class="text-center w-full">
                                    <i class="pi pi-spinner pi-spin"></i>
                                </span>
                            </Button>
                        </form>
                        <p class="m-0">Lupa password ? Hubungi admin</p>
                    </div>
                    <div class="col-4">
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

<script >
definePageMeta({
    layout: 'guest',
})
import apiAuthentication from './apiAuth.js';
import { useUserStore } from '../store/user';

export default {
    layout: 'guest',
    data() {
        return {
            userStore: useUserStore(),
            siteKey: import.meta.env.VITE_CAPTCHA_KEY || '6Le5nhIpAAAAAMFoIVPDYCX8nLLG-e5CK0f_MFQT',
            user: {
                usernamenya: '',
                passwordnya: '',
            },
            isSubmitted: false,
            redirect: '/',
        };
    },
    mounted() {
        // this.$auth = localStorage.getItem('user');
        this.getRedirect();
        this.isLogged();
        this.$isLoading.value = false;
        this.loadCaptcha();
    },
    methods: {
        handler(token) {
            this.user.recaptchaToken = token;
        },
        validateRecaptcha() {
            // Perform ReCAPTCHA validation using the response from the widget
            // eslint-disable-next-line no-unused-vars
            return new Promise((resolve, reject) => {
                // eslint-disable-next-line no-undef
                const recaptchaResponse = grecaptcha.getResponse();

                if (recaptchaResponse === '') {
                    // ReCAPTCHA not verified
                    resolve({ success: false });
                } else {
                    // ReCAPTCHA verified, include the response in your API call if needed
                    resolve({ success: true, response: recaptchaResponse });
                }
            });
        },

        async login() {
            try {
                if (this.user.usernamenya && this.user.passwordnya) {
                    this.$isLoading.value = true;
                    this.isSubmitted = true;
                    // const token = await this.$recaptcha("login");
                    // this.user.recaptchaToken = token;\
                    await apiAuthentication
                        .login(this.user)
                        .then((res) => {
                            console.log(res);
                            // this.$toast.add({ severity: 'success', summary: 'Success', detail: res.data.message, life: 3000 });
                            setTimeout(() => {
                                this.$router.replace(this.redirect);
                            }, 1000);
                        })

                        .catch((err) => {
                            this.user.passwordnya = null;
                            console.log(err);
                            // this.$toast.add({ severity: 'error', summary: 'Failed', detail: err.response.data.message, life: 3000 });
                        });
                } else if (!this.user.usernamenya && this.user.passwordnya) {
                    this.$toast.add({ severity: 'error', summary: 'Failed', detail: 'Username Required ', life: 3000 });
                } else if (this.user.usernamenya && !this.user.passwordnya) {
                    this.$toast.add({ severity: 'error', summary: 'Failed', detail: 'Password Required ', life: 3000 });
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Failed', detail: 'Username And Password Required ', life: 3000 });
                }
                return;
            } catch (error) {
                console.log(error);
                this.isSubmitted = false;
                // this.$toast.add({ severity: 'error', summary: 'Failed', detail: error.response.data.message, life: 3000 });
            } finally {
                this.isSubmitted = false;
                this.$timeoutLoading();
            }
        },
        async logout() {
            await apiAuthentication.logout().then(() => {
                localStorage.removeItem('user');
                this.userStore.clearUser();
            });
        },
        getRedirect() {
            let oldRoute = this.$route.redirectedFrom;
            if (oldRoute && oldRoute.fullPath !== '/login') {
                if (this.redirect == null) {
                    this.redirect = oldRoute.fullPath;
                } else {
                    this.redirect = '/';
                }
            } else {
                this.redirect = '/';
            }
        },
        async isLogged() {
            this.getRedirect();
            const res = await this.$auth.checkAuth();

            if (res) {
                this.$router.push(this.redirect);
            }
            return;
        },
        loadCaptcha() {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit';
            script.defer = true;
            script.async = true;

            script.onload = () => {
                // The ReCaptcha script has loaded
                // You can now use ReCaptcha API in your component
                // Initialize ReCAPTCHA widget
                // eslint-disable-next-line no-undef
                grecaptcha.ready(() => {
                    // eslint-disable-next-line no-undef
                    grecaptcha.render(this.$refs.recaptcha, {
                        sitekey: import.meta.env.VITE_CAPTCHA_KEY || '6Le5nhIpAAAAAMFoIVPDYCX8nLLG-e5CK0f_MFQT',
                        callback: this.handler,
                    });
                });
            };

            document.head.appendChild(script);
        },
    },
};
</script>
<style>
.login-body {
    background: transparent;
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

@media (max-width: 992px) {
    .login-body .login-wrapper .login-panel {
        width: 100%;
    }
}
</style>
