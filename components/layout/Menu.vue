<template>
    <div class="mt-5">
        <NuxtLink
            v-for="item in MENU_DATA"
            :key="item.name"
            :to="item.url"
            class="flex items-center py-1 px-3 rounded-lg w-full hover:bg-gray-700 hover:shadow 
                    transition-all mb-3 text-secondaryTitle"
        >
            <Icon :name="item.icon" class="mr-3" size="18" />
            <span>{{ item.name }}</span>
        </NuxtLink>
    </div> 
</template>

<script lang="ts" setup>
import { MENU_DATA } from "../../data/menu.data"
</script>

<style>

</style>