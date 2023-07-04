import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
  },

  // Configure the build output
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
  },
})
