<script lang="ts" setup>
    import { useCustomerStore } from '@/store/customers.store';
    import { useConfirmModalStore } from '@/store/confirmModal.store';
    
    useSeoMeta({
        title: 'Customers | CRM System'
    });

    const customersStore = useCustomerStore();

    let isModalOpen = ref(false);
    let mode = ref('');
    let customerId = ref('');

    const columns = [
        { key: 'avatar_url'},
        { key: 'name', label: 'Customer Name', sortable: true},
        { key: 'email', label: 'Email'},
        { key: 'from_source', label: 'From Source'},
        { key: 'actions'}
    ];

    const confirmModalStore = useConfirmModalStore();
    const deleteCustomer = (customerId: string) => {
        confirmModalStore.open({
            title: 'Confirmation',
            message: 'Do you really want to delete this customer?',
            onConfirm: () => {
                customersStore.deleteCustomer(customerId);
            },
        });
    };

    const openEditModal = (id: string) => {
        mode.value = "edit";
        customerId.value = id;
        isModalOpen.value = true; 
    };

    const openCreateModal = () => {
        mode.value = "create";
        isModalOpen.value = true; 
    };

    const closeModal = () => {
        mode.value = "";
        isModalOpen.value = false; 
    };

    onMounted(() => {
        customersStore.fetchCustomers();
    });
</script>

<template>
    <div>
        <div class="flex justify-between items-center">
            <h1>CUSTOMERS</h1>
            <UButton color="cyan" class="mb-10" @click="openCreateModal">Add New Customer</UButton>
        </div>
        
        <UTable
            :columns="columns"
            :rows="customersStore.customers"
            :ui="{
                divide: 'divide-y-2 divide-border',
                tbody: 'divide-y-2 divide-border',
                th: {
                    color: 'text-primaryTitle',
                    size: 'text-base'
                },
                td: {
                    color: 'text-defaultText',
                    size: 'text-base'
                },
            }"  
        >
            <template #avatar_url-data="{ row }">
                <UAvatar
                    :src="row.avatar_url"
                    :alt="row.name"
                    size="md"
                    class="object-cover"
                    :ui="{ size: { md: 'object-cover'} }"
                />
            </template>
            <template #actions-data="{ row }">
                <div class="flex justify-end">
                    <UButton variant="link" color="cyan" @click="deleteCustomer(row.$id)">
                        <Icon name="iconamoon:trash-fill" size="23" />
                    </UButton>
                </div>
            </template>
        </UTable> 

        <CustomersCreateCustomerModal
            v-if="isModalOpen"
            :isModalOpen="isModalOpen"
            :mode="mode"
            :customerId="customerId"
            @close="closeModal"
        />     
    </div>
</template>