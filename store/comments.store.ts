
import type { IComment } from '@/types/deals.types'
import { v4 as uuid } from 'uuid'
import { Query } from "appwrite"
import { useAuthStore } from './auth.store'
import { useErrorStore } from '@/store/error.store';


export const useCommentsStore = defineStore('comments', {
    state: () => ({
        comments: ref([] as IComment[]),
        isCommentLoading: ref(false),
        error: ref(null as string | null),
        appwrite: useAppwriteConfig(),
        collectionComments: useRuntimeConfig().public.collectionComments,
    }),
    actions: {
        async fetchComments(dealId?: string) {
            this.isCommentLoading = true;
            this.error = null;
            try {
                const query = [];
                if (dealId) query.push(Query.equal('deal', [dealId]));

                const response = await this.appwrite.db.listDocuments(this.appwrite.dbId, this.collectionComments, query);
                this.comments = response.documents as unknown as IComment[];
            } catch (error: any) {
                this.error = error.message;
                useErrorStore().setError(error?.message || 'Error:', 'error');
            } finally {
                this.isCommentLoading = false;
            }
        },
        async addComment(text: string, dealId: string) {
            this.isCommentLoading = true;
            this.error = null;
            const authStore = useAuthStore();
            try {
                const newComment: Omit<IComment, "$id" | "$createdAt"> = {
                    text,
                    deal: dealId,
                    user_id: authStore.user?.id,
                    user_name: authStore.user?.name
                };

                await this.appwrite.db.createDocument(this.appwrite.dbId, this.collectionComments, uuid(), newComment);
                await this.fetchComments(dealId);
            } catch (error: any) {
                this.error = error.message;
                useErrorStore().setError(error?.message || 'Error:', 'error');
                throw error;
            } finally {
                this.isCommentLoading = false;
            }
        },
    },
})