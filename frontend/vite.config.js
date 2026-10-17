import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration: enables React (JSX + fast refresh).
export default defineConfig({
  plugins: [react()],
  build: {
    // jsPDF is a large library; this only silences the size warning during "npm run build".
    chunkSizeWarningLimit: 1000,
  },
});
