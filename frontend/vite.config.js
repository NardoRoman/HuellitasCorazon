import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '', // ← CAMBIA a CADENA VACÍA
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
