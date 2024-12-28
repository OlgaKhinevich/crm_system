<script lang="ts" setup>
  import { useCustomerStore } from '@/store/customers.store';
  import { useErrorStore } from '@/store/error.store';
  import { v4 as uuid } from 'uuid';

  const customersStore = useCustomerStore();
  const errorStore = useErrorStore();

  const isSaving = ref(false);
  const isSuccessUpdated = ref(false);
  const error = ref(null);
  const isUploadImagePending = ref(false);

  const route = useRoute();

  const customer = reactive({
    $createdAt: '',
    $id: '',
    name: '',
    email: '',
    avatar_url: '',
    from_source: ''
  });

  onMounted(async () => {
    const id = route.params.id as string;
    await customersStore.fetchCustomer(id);
    const updatedCustomer = {
      $createdAt: customersStore.customer.$createdAt,
      $id: customersStore.customer.$id,
      name: customersStore.customer.name,
      email: customersStore.customer.email,
      avatar_url: customersStore.customer.avatar_url,
      from_source: customersStore.customer.from_source
    };
    Object.assign(customer, updatedCustomer);
  });


  const handleFileChange = async (fileList: any) => {
    const config = useRuntimeConfig().public;
    try {
      const response = await uploadFile(fileList[0]);
      const url = `${config.endpoint}/storage/buckets/${config.storageId}/files/${response.$id}/view?project=${config.projectId}&project=${config.projectId}&mode=admin)`;
      customer.avatar_url = url;
      customersStore.updateCustomer({ ...customer });
    } catch (error: any) {
      errorStore.setError(error?.message || 'Error:', 'error');
    } finally {
      isUploadImagePending.value = false;
    }
  };

  const uploadFile = async (file: File): Promise<{ $id: string }> => {
    const { storage } = useAppwriteConfig();
    const response = await storage.createFile(
      useRuntimeConfig().public.storageId,
      uuid(),
      file,
    );
    return { $id: response.$id };
  };

  const saveCustomer = async () => {
    isSaving.value = true;
    error.value = null;
    try {
      await customersStore.updateCustomer(customer);
      isSuccessUpdated.value = true;
    } catch (error: any) {
      errorStore.setError(error?.message || 'Error:', 'error');
    } finally {
      isSaving.value = false;
    }
  };
</script>

<template>
  <div>
    <h1>
      Edit Customer
    </h1>

    <form @submit.prevent="saveCustomer" class="form">
      <div class="grid w-full max-w-sm items-center gap-1.5 input">
        <div class="flex">
          <div class="mr-5">
            <UAvatar
              :src="customer.avatar_url"
              alt="Avatar"
              size="xl"
              class="object-cover"
              :ui="{ size: { xl: 'object-cover'} }"
            />
          </div>
          <div>
            <div class="text-sm mb-2">Logo</div>
            <UInput
              type="file"
              
              @change="handleFileChange"
              
            />
          </div>
        </div>
      </div>
      <UInput
        placeholder="Name"
        type="text"
        color="cyan"
        class="input max-w-96"
        v-model="customer.name"
        :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
      />
      <UInput
        placeholder="Email"
        type="email"
        color="cyan"
        class="input max-w-96"
        v-model="customer.email"
        :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
      />
      <UInput
        placeholder="From source"
        color="cyan"
        type="text"
        class="input max-w-96"
        v-model="customer.from_source"
        :ui="{variant: {outline: 'ring-inputBorder text-mainTitle'}}"
      />

      <UButton 
        color="cyan"
        variant="solid"
        icon="i-heroicons-pencil-square"
        :disabled="isSaving"
        class="mt-3"
        @click="saveCustomer"
      >
        Save Changes
      </UButton>
      <div v-if="isSuccessUpdated" class="text-white mt-2">Successfully saved!</div>
    </form>
  </div>
</template>

<style lang="css" scoped>
    .input {
        @apply border-[#161c26] mb-2 text-[#748092] focus:border-border transition-colors;
    }
    .btn {
        @apply text-xs border py-2 rounded border-[#161c26] hover:border-[#482c65] transition-colors text-[#aebed5] hover:text-white;
    }
</style>