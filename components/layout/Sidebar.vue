<template>
  <aside class="p-5 bg-foreground h-screen fixed w-full sidebar">
    <div class="flex flex-col justify-between h-full">
      <div>
        <div class="px-3 font-semibold text-lg flex items-center mb-3 text-mainTitle">
          <Icon name="mingcute:user-4-fill" class="mr-3" size="25" />
          {{ authStore.user.name }}
        </div>
        <UDivider class="my-2" size="xs" :ui="{ border: { base: 'border-border dark:text-border'} }" />
        <LayoutMenu />
      </div>
      <div>
        <UDivider class="my-2" size="xs" :ui="{ border: { base: 'border-border dark:text-border'} }" />
        <UButton
          class="transition-colors text-base text-primaryText hover:text-white"
          variant="link"
          @click="authStore.logout"
        >
          Logout
          <Icon name="line-md:logout" size="17px" class="ml-1" />
        </UButton>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
  import { useAuthStore } from '~/store/auth.store'
  
  const authStore = useAuthStore()
</script>

<style scoped>
  .sidebar {
    width: 200px;
  }
</style>