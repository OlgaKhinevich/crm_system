import { defineNuxtPlugin } from '#app';
import { useErrorStore } from '@/store/error.store';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        const errorStore = useErrorStore();
        errorStore.setError(error?.message || 'An unexpected error occurred.', 'error');
    };
});