// Build alternativo: un único HTML autocontenido (vista previa móvil / envío por correo).
// Uso: npx vite build --config vite.singlefile.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  base: './',
  build: { outDir: 'dist-singlefile', assetsInlineLimit: 100_000_000 },
});
