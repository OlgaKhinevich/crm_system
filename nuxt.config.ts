// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  runtimeConfig: {
    public: {
      projectId: process.env.APPWRITE_PROJECT_ID,
      dbId: process.env.DB_ID,
      collectionDeals: process.env.COLLECTION_DEALS,
      collectionCustomers: process.env.COLLECTION_CUSTOMERS,
      collectionComments: process.env.COLLECTION_COMMENTS,
      storageId: process.env.STORAGE_ID,
      endpoint: process.env.APPWRITE_ENDPOINT,
    },
  },
  devtools: { enabled: false },
  plugins: ['~/plugins/error-handler'],
  modules: ['@vueuse/nuxt', '@nuxt/image', [
    '@nuxtjs/google-fonts', 
    {
      families: {
        Lato: {
          wght: [400, 500, 700],
          ital: [300]
        }
      }
    }
  ], '@nuxt/icon', '@pinia/nuxt', [
    '@vee-validate/nuxt',
    {
      autoImports: true,
    }
    ], '@nuxt/ui', 'nuxt-appwrite', 'dayjs-nuxt'],
  pinia: {
    storesDirs: ['@/store/**'],
  },
  dayjs: {
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'en',
    defaultTimezone: 'Europe/Moscow',
  }
})