<script setup lang="ts">
    import { useErrorStore } from '@/store/error.store'
    
    const errorStore = useErrorStore();
</script>

<template>
  <UAlert
    v-show="errorStore.show && errorStore.message"
    icon="i-heroicons-command-line"
    color="red"
    variant="subtle"
    title="Error!"
    class="alert"
    :description="errorStore.message"
    :ui="{ wrapper: 'w-1/4' }"
    @close="errorStore.clearError"
    :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
  />
</template>

<style scoped>
  .alert {
    position: absolute;
    bottom: 8px;
    right: 24px;
    z-index: 100;
  }
</style>
