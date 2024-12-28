<script lang="ts" setup>
    import { useAuthStore } from '@/store/auth.store';
    import { useIsLoadingStore } from '@/store/loading.store';
    import { useConfirmModalStore } from '@/store/confirmModal.store';
    import { useErrorStore } from '@/store/error.store';

    const loadingStore = useIsLoadingStore()
    const authStore = useAuthStore();
    const confirmModalStore = useConfirmModalStore();
    const errorStore = useErrorStore();

    onMounted(async () => {
        try {
            await authStore.fetchUserData();
        } catch (error: any) {
            errorStore.setError(error?.message || 'Error:', 'error');
        } finally {
            loadingStore.set(false);
        }
    });

    const isAuth = computed(() => authStore.isAuthenficated);
</script>

<template>
    <div>
        <LayoutLoader v-if="loadingStore.isLoading" />
        <section v-else :class="{'grid-layout': isAuth }">
            <LayoutSidebar v-if="isAuth" />
            <div :class="{'main-content p-10': isAuth }">
                <slot />
            </div>
        </section>
        <LayoutError />
        <LayoutConfirmModal v-if="confirmModalStore.isOpen" />
    </div>
</template>

<style scoped>
    .grid-layout {
        display: grid;
        height: 100vh;
    }

    .main-content {
        overflow-y: auto;
        margin-left: 200px;
    }
</style>