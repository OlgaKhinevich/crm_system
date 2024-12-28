<script setup lang="ts">
  import { useDealsStore } from '@/store/deals.store'
  import { useCommentsStore } from '@/store/comments.store'
  import { useCustomerStore } from '@/store/customers.store'

  useSeoMeta({
    title: 'Home | CRM System'
  })

  const dealsStore = useDealsStore();
  const commentsStore = useCommentsStore();
  const customersStore = useCustomerStore();

  const sortByCreatedAt = (items: any[]) => {
    return items.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
  };

  const latestDeals = computed(() => sortByCreatedAt(dealsStore.deals).slice(0, 4));
  const latestComments = computed(() => sortByCreatedAt(commentsStore.comments).slice(0, 5));
  const newCustomers = computed(() => sortByCreatedAt(customersStore.customers).slice(0, 5));

  onMounted(() => {
    dealsStore.fetchDeals();
    commentsStore.fetchComments();
    customersStore.fetchCustomers();
  })
</script>

<template>
  <div>
    <h1>HOME</h1>
    <div class="grid-homepage gap-16">
      <div>
        <h2 class="mb-4">Latest Deals</h2>
        <div v-if="latestDeals && latestDeals.length > 0" class="grid grid-cols-2 gap-6">
          <div v-for="deal in latestDeals" :key="deal.$id">
            <KanbanDealCard :deal="deal" />
          </div>
        </div>
        <div v-if="latestDeals && latestDeals.length > 0" class="mb-4 mt-3">
          <NuxtLink to="/kanban" class="text-primaryText text-lg font-medium">
            Open Kanban Board >>>
          </NuxtLink>
        </div>
        <div v-else>No have no created any deals.</div>
        <h2 class="mb-4 pt-3">New customers</h2>
        <div class="flex mb-2">
          <div v-for="customer in newCustomers" :key="customer.$id" class="mr-7">
            <NuxtLink :href="`customers/edit/${customer.$id}`" class="flex flex-col items-center">
              <UAvatar
                :src="customer.avatar_url"
                :alt="customer.name"
                size="xl"
                class="object-cover"
                :ui="{ size: { xl: 'object-cover'} }" 
              />
              <span class="mt-2">{{ customer.name }}</span>
            </NuxtLink>
          </div>
        </div>
        <NuxtLink to="/customers" class="text-primaryText text-lg font-medium">
          See More Customers >>>
        </NuxtLink>
      </div>
      <div>
        <h2 class="mb-2">Latest Comments</h2>
        <ul v-if="latestComments && latestComments.length > 0">
          <li v-for="comment in latestComments" :key="comment.$id">
            <KanbanSlideoverComment :comment="comment" />
            <UDivider class="my-2" size="xs" :ui="{ border: { base: 'border-border dark:text-border'} }" />
          </li>
        </ul>
        <div v-else class="default-text text-lg">No one has left comments on deals.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .grid-homepage {
    display: grid;
    grid-template-columns: 5fr 2fr;
  }
</style>