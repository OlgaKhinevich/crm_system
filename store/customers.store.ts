import type { ICustomer } from '@/types/deals.types'
import { useErrorStore } from '@/store/error.store';


export const useCustomerStore = defineStore('customers', {
    state: () => ({
        customers: ref([] as ICustomer[]),
        customer: ref({} as ICustomer),
        collectionCustomers: useRuntimeConfig().public.collectionCustomers
    }),
    actions: {
        async fetchCustomer(customerId: string) {
            try {
                const { db, dbId } = useAppwriteConfig();
                const response = await db.getDocument(dbId, this.collectionCustomers, customerId);
                this.customer = response as unknown as ICustomer;
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
        async updateCustomer(customerData: Omit<ICustomer, "$id" | "$createdAt">) {
            try {
                const { db, dbId } = useAppwriteConfig();
                const response = await db.updateDocument(dbId, this.collectionCustomers, customerData.$id, customerData);
                this.customer = response.document;
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
        async createCustomer(customer: Omit<ICustomer, "$id" | "$createdAt">) {
            try {
                const { db, dbId, ID } = useAppwriteConfig();
                const response = db.createDocument(dbId, this.collectionCustomers, ID.unique(), customer);
                await this.fetchCustomers();
                return response;
            } catch (error: any) {
                useErrorStore().setError(error.message || 'Error:', 'error');
            }
        },
        async fetchCustomers() {
            const { db, dbId } = useAppwriteConfig();
            try {
                const response = await db.listDocuments(dbId, this.collectionCustomers);
                this.customers = response.documents as unknown as ICustomer[];
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
        async deleteCustomer(id: string) {
            const { db, dbId } = useAppwriteConfig();
            try {
                await db.deleteDocument(dbId, this.collectionCustomers, id.toString());
                this.customers = this.customers.filter((customer) => customer.$id !== id);
            } catch (error: any) {
                useErrorStore().setError(error?.message || 'Error:', 'error');
            }
        },
    },
})