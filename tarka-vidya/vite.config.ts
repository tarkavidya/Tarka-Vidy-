import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Fix #3: Raise the warning limit threshold to 4MB so Vite stays quiet
    chunkSizeWarningLimit: 4000, 
    rollupOptions: {
      output: {
        // Fix #2: Tell Rollup to separate node_modules dependencies into a distinct file
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
