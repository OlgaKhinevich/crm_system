<script setup lang="ts">
    import { useConfirmModalStore } from '@/store/confirmModal.store';

    const confirmModalStore = useConfirmModalStore();
    const isOpen = computed(() => confirmModalStore.isOpen);
    const confirmationData = computed(() => confirmModalStore.confirmationData);

    const confirm = () => {
        confirmModalStore.confirm();
    };

    const cancel = () => {
        confirmModalStore.cancel();
    };
</script>

<template>
    <UModal
        v-model="isOpen"
        :ui="{
            overlay: { background: 'bg-gray-900/75'},
            background: 'bg-foreground',
        }"
    >
        <UCard
            class="bg-secondary"
            :ui="{ 
                header: { padding: 'px-4 pt-4 pb-3 sm:px-4' },
                body: { padding: 'px-4 pt-0 pb-0 sm:px-4 sm:pt-1 sm:pb-3'}, 
                footer: { padding: 'px-4 pt-0 pb-4 sm:pt-0'},
                divide: 'divide-y-1',
                ring: 'ring-slate-800'
            }"
        >
            <template #header>
                <h2>{{ confirmationData.title }}</h2>
            </template>
            <p>{{ confirmationData.message }}</p>
            <template #footer>
                <div class="flex justify-end space-x-2">
                    <UButton color="gray" @click="cancel">Cancel</UButton>
                    <UButton color="cyan" @click="confirm">Confirm</UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>