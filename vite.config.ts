import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Relative base for static deployment to any subdirectory or root in Hostinger
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
