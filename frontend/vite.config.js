import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
<<<<<<< HEAD
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
=======
  base: '/HuellitasCorazon/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '/img': path.resolve(__dirname, './public/img') // ← NUEVO ALIAS
>>>>>>> f5c0b2a83b7502eccbbbaec3e085d1747572ba8d
    }
  }
})