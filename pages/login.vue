<script lang="ts" setup>
    import { useIsLoadingStore } from "~/store/loading.store"
    import { useAuthStore } from "~/store/auth.store"

    useSeoMeta({
        title: "Login | CRM System"
    })

    const email = ref('')
    const password = ref('')
    const name = ref('')
    const authMode = ref('login')

    const isLoadingStore = useIsLoadingStore();
    const authStore = useAuthStore();

    const handleAuthButton = () => {
        (authMode.value === 'login') ? login() : register()
    };

    const login = async () => {
        isLoadingStore.set(true);
        
        await authStore.login(email.value, password.value);

        email.value = '';
        password.value = '';

        isLoadingStore.set(false);
    };

    const register = async () => {
        isLoadingStore.set(true);

        await authStore.register(email.value, password.value, name.value);

        email.value = '';
        password.value = '';
        name.value = '';

        isLoadingStore.set(false);
    };
</script>

<template>
    <div class="flex items-center justify-center min-h-screen w-full">
        <div class="rounded-lg bg-foreground w-1/4 p-7">
            <h1 class="text-2xl font-bold text-center mb-5">
                {{ authMode === 'login' ? "Login" : "Register"}}
            </h1>

            <form>
                <UInput
                    placeholder="Email"
                    type="email"
                    class="mb-3"
                    v-model="email"
                />
                <UInput
                    placeholder="Password"
                    type="password"
                    class="mb-3"
                    v-model="password"
                />
                <UInput
                    v-if="authMode === 'register'"
                    placeholder="Name"
                    type="text"
                    class="mb-3"
                    v-model="name"
                />
                <div class="flex items-center justify-center gap-5">
                    <UButton
                        color="cyan"
                        type="button"
                        @click="handleAuthButton"
                    >
                        {{ authMode === 'login' ? 'Login' : 'Register' }}
                    </UButton>
                </div>
            </form>
            <div v-if="authMode === 'login'" class="default-text text-base text-center mt-4">
                Don't have an account? 
                <span class="font-semibold text-primaryText ml-1" @click="authMode='register'">
                    Register
                </span>
            </div>
            <div v-else>
                Already have an account? 
                <span class="font-semibold text-primaryText ml-1" @click="authMode='login'">
                    Login
                </span>
            </div>
        </div>
    </div>
</template>

<style></style>