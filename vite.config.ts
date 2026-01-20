import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const EVENTS_API_TARGET = 'https://events.devworx.us'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls to the hosted events service while developing to avoid CORS issues.
      '/api/events': {
        target: EVENTS_API_TARGET,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
