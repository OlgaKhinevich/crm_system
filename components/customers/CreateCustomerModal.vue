<script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import { z } from 'zod';
  import type { FormSubmitEvent } from '#ui/types'
  import { useCustomerStore } from '@/store/customers.store';
  import { useErrorStore } from '@/store/error.store';
  import { v4 as uuid } from 'uuid';

  const props = defineProps({
    isModalOpen: {
      type: Boolean,
      required: true,
    },
    mode: {
      type: String as () => 'create' | 'edit',
      required: true,
    },
    customerId: {
        type: String,
        required: false,
        default: undefined
    },
  });

  const customersStore = useCustomerStore();
  const errorStore = useErrorStore();

  const isSaving = ref(false);
  const isSuccessUpdated = ref(false);
  const isUploadImagePending = ref(false);

  const isOpen = props.isModalOpen;

  const customer = reactive({
    name: '',
    email: '',
    from_source: '',
    avatar_url: '',
  });

  const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(40, 'Name must not exceed 100 characters').nonempty('Name is required'),
    email: z.string().email('Invalid email').nonempty('Email is required'),
    from_source: z.string().optional(),
    avatar_url: z.string().optional(),
  });

  type Schema = z.infer<typeof schema>;
  
 onMounted(async () => {
    if (props.mode === 'edit' && props.customerId) {
      await customersStore.fetchCustomer(props.customerId);

      if (customersStore.customer) {
        const updatedCustomer = {
          name: customersStore.customer.name,
          email: customersStore.customer.email,
          avatar_url: customersStore.customer.avatar_url || null,
          from_source: customersStore.customer.from_source,
        };

        Object.assign(customer, updatedCustomer)
      }
    }
  });

  const fileInput = ref<HTMLInputElement | null>(null);

  const handleFileChange = async (fileList: any) => {
    const config = useRuntimeConfig().public;
    try {
      isUploadImagePending.value = true;
      const response = await uploadFile(fileList[0]);
      const url = `${config.endpoint}/storage/buckets/${config.storageId}/files/${response.$id}/view?project=${config.projectId}&project=${config.projectId}&mode=admin)`;
      customer.avatar_url = url;
      if(props.mode === 'edit') customersStore.updateCustomer({ ...customer });
    } catch (error: any) { 
      errorStore.setError(error?.message || 'Error:', 'error'); 
    } 
    finally { 
      isUploadImagePending.value = false; 
    }
  };

  const uploadFile = async (file: File): Promise<{ $id: string }> => {
    const { storage } = useAppwriteConfig();
    const response = await storage.createFile(useRuntimeConfig().public.storageId, uuid(), file);
    return { $id: response.$id };
  };
  
  const saveCustomer = async(event: FormSubmitEvent<Schema>) => {
    isSaving.value = true;

    try {
      const response = (props.mode === 'edit') ? await customersStore.updateCustomer(customer) : await customersStore.createCustomer(customer); 
      if (props.mode === 'create') resetForm();
      if(response) isSuccessUpdated.value = true;
    } catch(error: any){
      errorStore.setError(error?.message || 'Error:', 'error');
    } finally { isSaving.value = false; } 
  };

  const resetForm = () => {
    customer.avatar_url = '';
    customer.name = '';
    customer.email = '';
    customer.from_source = '';
  };

  const emit = defineEmits(['close']);

  const handleClose = () => emit('close');
</script>

<template>
  <UModal 
    v-model="isOpen"
    :ui="{
      overlay: { background: 'bg-gray-900/75'},
      background: 'bg-foreground',
    }"
  >
    <UCard
            class="bg-secondary"
            :ui="{ 
                header: { padding: 'px-6 pt-6 pb-3 sm:px-6' },
                body: { padding: 'px-6 pt-0 pb-0 sm:px-6 sm:pt-1 sm:pb-4'}, 
                footer: { padding: 'px-6 pt-0 pb-6 sm:pt-0'},
                divide: 'divide-y-1',
                ring: 'ring-slate-800'
            }"
    >
      <template #header>
        <h1 class="mb-0">{{ mode === 'edit' ? 'Edit Customer' : 'Create New Customer' }}</h1>      
      </template>

      <UForm
        @submit="saveCustomer"
        :schema="schema"
        :state="customer"
        class="form"
      >
        <div class="grid w-full max-w-sm items-center gap-1.5 input">
          <div class="flex">
            <div class="mr-5 mb-4">
              <Icon v-if="isUploadImagePending" name="eos-icons:bubble-loading" size="57px" />
              <UAvatar
                v-else
                :src="customer.avatar_url"
                alt="Avatar"
                size="xl"
                class="object-cover"
                :ui="{ size: { xl: 'object-cover'} }"
              />
            </div>
            <div>
              <div class="text-sm mb-2">Customer Avatar</div>
              <UInput
                type="file"
                color="cyan"
                class="input"
                @change="handleFileChange"
                ref="fileInput"
                :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
              />
            </div>
          </div>
        </div>

        <UFormGroup name="name" class="mt-2">
          <UInput
            placeholder="Name"
            color="cyan"
            type="text"
            v-model="customer.name"
            :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
          />
        </UFormGroup>

        <UFormGroup name="email" class="mt-2">
          <UInput
            placeholder="Email"
            color="cyan"
            type="email"
            v-model="customer.email"
            :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
          />
        </UFormGroup>

        <UFormGroup name="fromSource" class="mt-2">
          <UInput
            placeholder="From source"
            color="cyan"
            type="text"
            v-model="customer.from_source"
            :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
          />
        </UFormGroup>

        <div class="flex flex-col items-end mt-3">
          <div class="flex">
            <UButton
              color="gray"
              variant="solid"
              class="mr-2"
              @click="handleClose"
            >
                Cancel
            </UButton>
            <UButton
              type="submit"
              color="cyan"
              variant="solid"
              icon="i-heroicons-pencil-square"
              :disabled="isSaving"
            >
              {{ mode === 'edit' ? 'Save Changes' : 'Create Customer' }}
            </UButton>
          </div>
          <div v-if="isSuccessUpdated" class="text-white mt-2">
            {{ mode === 'edit' ? 'Successfully saved!' : 'Customer created successfully!' }}
          </div>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<style lang="css" scoped>
</style>

