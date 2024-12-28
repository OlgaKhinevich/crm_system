<script lang="ts" setup>
    import { useCommentsStore } from '@/store/comments.store';
    import { defineProps } from 'vue'
    import { useErrorStore } from '@/store/error.store';

    const props = defineProps({
        currentDeal: { type: String, required: true },
    });

    const commentsStore = useCommentsStore();
    const errorStore = useErrorStore();

    const newComment = ref('');

    const addComment = async () => {
        if (newComment.value.trim() === '') return;

        try {
            await commentsStore.addComment(newComment.value, props.currentDeal);
            newComment.value = '';
        } catch (error: any) {
           errorStore.setError(error?.message || 'Error:', 'error');
        }
    };

    onMounted(() => {
        commentsStore.fetchComments(props.currentDeal);
    })
</script>

<template>
    <div>
        <div class="flex items-center w-full">
            <UInput
                class="flex-grow"
                color="cyan"
                variant="outline"
                v-model="newComment" 
                placeholder="Type Comment"
                :ui="{ variant: {outline: 'ring-inputBorder text-mainTitle' }}"
            />
            <UButton @click="addComment" variant="link" color="cyan">
                <Icon name="ic:round-send" size="30" />
            </UButton>
        </div>
        <USkeleton v-if="commentsStore.isCommentLoading" class="w-full h-{76px} rounded mt-3"></USkeleton>
        <div v-else-if="commentsStore.comments.length > 0" class="overflow-y-auto h-[300px]">
            <KanbanSlideoverComment 
                v-for="comment in commentsStore.comments"
                :key="comment.$id"
                :comment="comment"
                :hideDealLabel="true"
            >
            </KanbanSlideoverComment>
        </div>
    </div>
</template>

<style></style>