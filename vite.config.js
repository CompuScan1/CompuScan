import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v0': {
        target: 'https://firebasestorage.googleapis.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
