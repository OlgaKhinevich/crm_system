import type { EnumStatus, IDeal } from '@/types/deals.types'
import { useErrorStore } from '@/store/error.store';


export const useDealsStore = defineStore('deals', {
    state: () => ({
        deals: ref([] as IDeal[]),
        collectionDeals: useRuntimeConfig().public.collectionDeals
    }),
    actions: {
        async fetchDeals() {
            const { db, dbId } = useAppwriteConfig();
            try {
                const response = await db.listDocuments(dbId, this.collectionDeals);
                this.deals = response.documents as unknown as IDeal[];
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
        async updateDeal(id: string, newStatus: EnumStatus) {
            const { db, dbId } = useAppwriteConfig();
            try {
                await db.updateDocument(dbId, this.collectionDeals, id, { status: newStatus });
                this.fetchDeals();
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
        async deleteDeal(id: string) {
            const { db, dbId } = useAppwriteConfig();
            try {
                await db.deleteDocument(dbId, this.collectionDeals, id.toString());
                this.deals = this.deals.filter((deal) => deal.$id !== id);
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
        async createDeal(deal: Omit<IDeal, "$id" | "$createdAt">) {
            const { db, dbId, ID } = useAppwriteConfig();
            try {
                await db.createDocument(dbId, this.collectionDeals, ID.unique(), deal);
                await this.fetchDeals();
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        }
    },
})