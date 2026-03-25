import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    sourcemap: true,
    target: 'es2022',
    cssCodeSplit: true,           // Split CSS per-chunk for better caching
    chunkSizeWarningLimit: 600,   // Warn if any chunk exceeds 600kb
    rollupOptions: {
      output: {
        // HTTP/2 multiplexing: split large vendor libs into separate cacheable chunks
        // Users only re-download what actually changed between deployments
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'redux-vendor': ['redux', 'react-redux', '@reduxjs/toolkit'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'lucide': ['lucide-react'],
        },
      },
    },
  },
})

