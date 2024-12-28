<script lang="ts" setup>
    import type { IDeal } from '@/types/deals.types';
    import { defineProps } from 'vue';
    import dayjs from 'dayjs';
    import { useDealsStore } from '@/store/deals.store';
    import { useConfirmModalStore } from '@/store/confirmModal.store';
    import { convertCurrency } from '@/utils/convertCurrency';

    const props = defineProps({
        deal: { type: Object as () => IDeal, required: true },
        showSlideover: { type: Boolean, required: true  }
    });

    const dealsStore = useDealsStore();

    const isOpen = props.showSlideover;

    const confirmModalStore = useConfirmModalStore();

    const deleteDeal = () => {
        confirmModalStore.open({
            title: 'Confirmation',
            message: 'Do you really want to delete this deal?',
            onConfirm: () => {
                dealsStore.deleteDeal(props.deal.$id);
            },
        });
    };
</script>

<template>
    <div>
        <USlideover v-model="isOpen"
            :ui="{
                base: 'py-5 px-6',
                background: 'bg-foreground',
                overlay: { background: 'bg-gray-900/75'},
            }"
            >
            <div class="flex justify-between items-center">
                <h2 class="uppercase bold">About deal</h2>
                <UButton
                    color="white"
                    variant="link"
                    @click="$emit('close')"
                    class="hover:bg-foreground"
                >
                    <Icon name="ic:round-close" size="25"/>
                </UButton>
            </div>
            <div class="border-border rounded mt-4">
                <div class="mb-2 flex">
                    <label class="default-text block text-lg pr-3">Deal Name:</label>
                    <div class="text-lg">{{ deal.name }}</div>
                </div>
                <div class="mb-2 flex">
                    <label class="default-text block text-lg pr-3">Price:</label>
                    <div class="text-lg">{{ convertCurrency(deal.price) }}</div>
                </div>
                <div class="mb-2 flex">
                    <label class="default-text block text-lg pr-3">Status:</label>
                    <UBadge size="md" color="cyan" variant="outline">{{ deal.status }}</UBadge>
                </div>
                <div class="mb-2 flex">
                    <label class="default-text block text-lg pr-3">Customer Name:</label>
                    <div class="text-lg">{{ deal.customer.name }}</div>
                </div>
                <div class="mb-2 flex">
                    <label class="default-text block text-lg pr-3">Created At:</label>
                    <div class="text-lg">{{ dayjs(deal.$createdAt).format('DD MMMM YYYY') }}</div>
                </div>
                <UButton
                    @click="deleteDeal"
                    variant="outline"
                    color="red"
                    class="mb-2"
                >
                    Delete Deal
                </UButton>
            </div>
            <UDivider class="mt-2 mb-6" size="xs" :ui="{ border: { base: 'border-border dark:text-border'} }" />
            <KanbanSlideoverComments :currentDeal="deal.$id" />
        </USlideover>
    </div>
</template>