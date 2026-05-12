export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
  nitro: {
    experimental: { wasm: true },
  },
})
