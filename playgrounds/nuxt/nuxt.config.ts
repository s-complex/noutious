import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  vite: {
    plugins: [
      nodePolyfills({
        overrides: {
          fs: 'memfs',
        },
        protocolImports: true,
      }),
    ],
  },
})
