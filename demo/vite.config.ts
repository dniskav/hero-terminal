import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/hero-terminal/',
  resolve: {
    // Always resolve these from demo/node_modules, even when importing
    // source files from the parent directory (../../src/*)
    dedupe: ['react', 'react-dom', 'framer-motion'],
  },
  server: {
    port: 5174,
    fs: {
      // allow serving files from one level up to import the package source
      allow: [path.resolve(__dirname, '..')]
    }
  },
  optimizeDeps: {
    include: ['framer-motion']
  }
})
