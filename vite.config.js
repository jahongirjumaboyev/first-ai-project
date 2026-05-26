import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Force dev server to use a fixed port and fail if it's taken
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://najot-edu.softwareengineer.uz',
        changeOrigin: true,
        // For local development, allow insecure TLS to avoid 502 from proxy TLS issues
        secure: false,
      },
    },
  },
})
