<script lang="ts" setup>
    import { useDealsStore } from '@/store/deals.store'
    import type { EnumStatus, IDeal } from '@/types/deals.types';
    import { KANBAN_DATA } from '@/data/kanban.data';
    import { useErrorStore } from '@/store/error.store';

    useSeoMeta({
        title: 'Kanban Board | CRM System'
    });

    const errorStore = useErrorStore();

    // Show deal details
    const showSlideover = ref(false);
    const currentDeal = ref<IDeal | null>(null);

    const handleShowSlideover = (deal: IDeal) => {
        currentDeal.value = deal;
        showSlideover.value = true;
    };

    const closeSlideover = () => {
        showSlideover.value = false;
        currentDeal.value = null;
    };

    // Fetch all deals and distribute by columns
    const dealsStore = useDealsStore();

    const columns = computed(() => {
        return KANBAN_DATA.map((column) => {
            return {
                ...column,
                deals: dealsStore.deals.filter((deal: IDeal) => deal.status === column.id),
            }
        })
    });

    const handleDrop = async (event: DragEvent, columnId: EnumStatus) => {
        const dealId = event.dataTransfer?.getData('dealId');
        if(dealId) {
            try {
                await dealsStore.updateDeal(dealId, columnId);
            } catch (error: any) {
                errorStore.setError(error?.message || 'Error:', 'error');
            }
        }
    };

    onMounted(() => {
        dealsStore.fetchDeals()
    });
</script>

<template>
    <div>
        <h1>CRM SYSTEM</h1>
        <!-- <div v-if="isLoading">Loading...</div> -->
        <div>
            <div class="grid grid-cols-5 gap-3">
                <div 
                    v-for="column in columns" :key="column.id"
                    @drop="handleDrop($event, column.id)"
                    @dragover.prevent
                    @dragenter.prevent
                    class="kanban-column border-2 rounded-lg p-3"
                >
                    <h3 class="text-center">{{ column.name }}</h3>
                    <KanbanCreateDeal :status="column.id"/>
                    <ul>
                        <li v-for="deal in column.deals" :key="deal.id" class="mb-3">
                            <KanbanDealCard
                                :deal="deal"
                                :column="column"
                                @show-slideover="handleShowSlideover"
                            />
                        </li>
                    </ul>
                </div>
            </div>
            <KanbanSlideover 
                v-if="showSlideover"
                :deal="currentDeal"
                :showSlideover="showSlideover"
                @close="closeSlideover" 
            />
        </div>
    </div>
</template>

<style scoped>
    .kanban-column {
        min-height: calc(100vh - 152px);
    }
</style>