import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the path module

export default defineConfig({
  plugins: [react()],

  // Path aliases for cleaner imports (e.g., '@/components/Header')
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Standard base path for most web deployments
  base: '/',

  // Optimized build configuration
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // This creates separate chunks for vendor libraries (e.g., react, framer-motion)
        // It improves browser caching, as vendor code changes less often than your app code.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },

  // Your existing server configuration is great
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
  },
});