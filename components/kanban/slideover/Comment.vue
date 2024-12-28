<script lang="ts" setup>
import dayjs from 'dayjs'
import { defineProps } from 'vue'
import type { IComment } from '@/types/deals.types'

const props = defineProps({
    comment: { type: Object as () => IComment, required: true },
    hideDealLabel: { type: Boolean, required: false }
})

</script>

<template>
    <div class="flex items-start mt-3">
        <Icon name="radix-icons:chat-bubble" class="mr-3 mt-1" size="25" />
        <div>
            <div class="default-text" :class="{hidden: props.hideDealLabel}">Comment in {{  props.comment.deal.name }}</div>
            <div class="font-medium text-primaryText mt-1 mb-0">{{ props.comment?.user_name }}</div>
            <div class="text-base font-semibold mt-0">{{ props.comment?.text }}</div>
            <div class="date-text">
                {{ dayjs(comment.$createdAt).format('DD MMMM YYYY HH:mm') }}
            </div>
        </div>
    </div>
</template>

<style></style>