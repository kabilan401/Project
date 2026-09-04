import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Project/', // Required for GitHub Pages 24/7 deployment
  server: {
    host: true,
    port: 3000
  }
})
