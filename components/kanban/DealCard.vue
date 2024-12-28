<script setup lang="ts">
    import dayjs from 'dayjs';
    import { convertCurrency } from '@/utils/convertCurrency';
    import { defineProps } from 'vue';
    import type { IDeal } from '@/types/deals.types';
    import type { IColumn } from '@/types/kanban.types';

    const props = defineProps({
        deal: { type: Object as () => IDeal, required: true },
        column: { type: Object as () => IColumn }
    });

    const handleDragStart = (e: DragEvent) => {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer?.setData('dealId', props.deal.$id.toString());
    };

    const emit = defineEmits<{
        (e: 'show-slideover', deal: IDeal): void;
    }>();

    const showDealDetails = () => {
        emit('show-slideover', props.deal);
    };
</script>

<template>
    <UCard
        class="bg-foreground cursor-pointer"
        draggable="true"
        @click="showDealDetails"
        @dragstart="handleDragStart"
        :ui="{ 
            header: { padding: 'px-3 pt-3 pb-0 sm:px-4' },
            body: { padding: 'px-3 pt-0 pb-2 sm:px-4 sm:pt-1 sm:pb-4'}, 
            footer: { padding: 'px-3 pt-1 pb-3 sm:p-4'},
            divide: 'divide-y-0',
            ring: 'ring-slate-800'
        }"
    >
        <template #header>
            <div class="flex justify-end">
                <div class="date-text">
                    {{ dayjs(deal.$createdAt).format('DD MMMM YYYY') }}
                </div>
            </div>
            <h2 class="pt-2 pb-0">
                {{ deal.name }}
            </h2>
        </template>
        <div class="default-text text-base font-semibold mb-1">{{ convertCurrency(deal.price) }}</div>
        <div class="flex justify-between">
            <div class="default-text">{{ deal.customer.name }}</div>
            <div v-if="deal.comments.length > 0" class="default-text flex items-center">
                <Icon 
                    name="pajamas:comments"
                    size="12"
                />
                <span class="ml-1">{{ deal.comments.length }}</span>
            </div>
        </div>
    </UCard>
</template>


<style scoped>

</style>