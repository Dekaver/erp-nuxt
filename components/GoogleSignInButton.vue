<template>
    <GoogleSignInButton theme="filled_blue" @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton>
</template>
<script setup lang="ts">
const { registerUser, loginUserWithGoogle, form } = useAuth();

const props = defineProps({
    type: {
        type: String,
        default: 'login',
    },
});
import { GoogleSignInButton, type CredentialResponse, decodeCredential } from 'vue3-google-signin';

const router = useRouter();

// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
    try {
        const { credential } = response;

        if (credential) {
            if (props.type == 'login') {
                const payload = decodeCredential(credential);
                form.email = payload.email;
                form.id_google = payload.id;
                await loginUserWithGoogle(form as any).then((res) => {
                    setTimeout(() => {
                        router.push('/');
                    }, 500);
                });
            } else {
                const payload = decodeCredential(credential);
                form.email = payload.email;
                form.username = payload.given_name;
                form.id_google = payload.id;
                form.password = '-';
                form.avatar = payload.picture;
                await registerUser(form as any).then(() => {
                    setTimeout(() => {
                        router.push('/');
                    }, 500);
                });
            }
        } else {
            // console.log('failed');
        }
    } catch (error) {
        console.error(error);
    }
};

// handle an error event
const handleLoginError = () => {
    console.error('Login failed');
};
</script>
