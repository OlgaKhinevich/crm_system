<script setup lang="ts">
  import { defineProps } from 'vue';
  import { z } from 'zod';
  import type { FormSubmitEvent } from '#ui/types';
  import { useDealsStore } from '@/store/deals.store';
  import type { IDeal, EnumStatus, ICustomer } from '@/types/deals.types';
  import { useCustomerStore } from '@/store/customers.store';

  const props = defineProps({
    status: {
      type: String,
      required: true,
    },
  });

  const dealsStore = useDealsStore();
  const customersStore = useCustomerStore();

  const isOpenForm = ref(false);
  const error = ref('');

  const customersOptions = computed(() => {
    return customersStore.customers.map((customer: ICustomer) => ({
      value: customer.$id,
      label: customer.name,
    }));
  });

  const state = reactive({
    name: '',
    price: undefined,
    customer: '',
  });
  const selectedCustomer = ref('');

  // Validation form with Zod
  const schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    price: z.number().min(0, { message: 'Price must be a positive number' }),
    customer: z.string().min(1, { message: 'Customer is required' }),
  });

  type Schema = z.output<typeof schema>;

  const handleCustomerChange = () => {
    state.customer = selectedCustomer.value;
  };

  const createDeal = async () => {
    try {
      const parsedData = schema.parse(state);

      const newDeal: Omit<IDeal, "$id" | "$createdAt"> = {
        name: parsedData.name,
        price: parsedData.price,
        status: props.status as EnumStatus,
        customer: parsedData.customer,
        comments: []
      };

      dealsStore.createDeal(newDeal);

      resetForm();

    } catch (error: any) {
      error.value = error.message || 'Failed to create deal. Please try again.';
    }
  };

  const resetForm = () => {
    state.name = '';
    state.price = undefined;
    state.customer = '';
    error.value = '';
    selectedCustomer.value = '';
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    event.preventDefault();
    createDeal();
  }
</script>

<template>
  <div>
    <div class="text-center mb-2">
        <UButton
            variant="link"
            class="transition-all opacity-25 hover:opacity-100 hover:text-primaryText text-mainTitle"
            @click="isOpenForm = !isOpenForm"
        >
            <Icon 
                v-if="isOpenForm"
                name="line-md:arrow-small-up"
                class="fade-in-100 fade-out-0"
                size="25"
            />
            <Icon 
                v-else
                name="ep:circle-plus"
                class="fade-in-100 fade-out-0"
                size="25"
            />

        </UButton>
    </div>

    <UForm 
        v-if="isOpenForm"
        :schema="schema"
        :state="state"
        @submit.prevent="onSubmit"
        class="form"
    >
        <UFormGroup name="name">
            <UInput
                color="cyan"
                variant="outline"
                v-model="state.name" 
                placeholder="Name"
                :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
            />
        </UFormGroup>

        <UFormGroup name="price" class="mt-2">
            <UInput
                type="number"
                color="cyan"
                variant="outline"
                v-model="state.price"
                placeholder="Price" 
                :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
            />
        </UFormGroup>

        <UFormGroup name="customerName" class="mt-2">
            <USelect
              color="cyan"
              variant="outline"
              :options="customersOptions"
              @change="handleCustomerChange"
              v-model="selectedCustomer"
              :ui="{ variant: { outline: 'bg-background ring-inputBorder text-mainTitle' }, placeholder: 'text-mainTitle' }"
            />
        </UFormGroup>

        <UButton
            color="cyan"
            variant="solid"
            type="submit"
            class="mt-3"
            @click="onSubmit"
        >
            Add Deal
        </UButton>
        <div v-if="error" class="error-message">{{ error }}</div>
    </UForm>
  </div>
</template>

<style scoped>
    .form {
        @apply mb-5 block;
        animation: show 0.5s easy-in-out;
    }
    @keyframes show {
        from {
            @apply border-[#a252c83d];
            transform: translateY(-35px);
            opacity: 0.4;
        }

        90% {
            @apply border-[#a252c83d];
        }

        to {
            @apply border-transparent;
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>