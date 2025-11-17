import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'ui': ['react', 'react-dom', 'react-router-dom'],
          'animations': ['framer-motion'],
          'toast': ['react-hot-toast'],
          'form': ['react-hook-form', 'zod'],
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
