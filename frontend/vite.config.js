import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/HuellitasCorazon/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '/img': path.resolve(__dirname, './public/img') // ← NUEVO ALIAS
    }
  }
})
