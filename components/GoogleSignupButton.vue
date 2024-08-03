<template>
    <GoogleSignInButton type="signup" shape="pill" text="signup_with" @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton>
</template>
<script setup lang="ts">
import { GoogleSignInButton, type CredentialResponse, decodeCredential } from 'vue3-google-signin';

// handle success event
const handleLoginSuccess = (response: CredentialResponse) => {
    const { credential } = response;

    // if (credential) {
    //     console.log('Access Token', decodeCredential(credential));
    // }else{
    //     console.log('failed');
    // }
};

// handle an error event
const handleLoginError = () => {
    console.error('Login failed');
};
</script>
