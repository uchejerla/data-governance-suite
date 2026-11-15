import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// "artifact" mode bundles everything into one HTML file for a shareable preview.
// The normal build is a standard static site for Vercel (see vercel.json).
export default defineConfig(({ mode }) => ({
  plugins: mode === 'artifact' ? [react(), viteSingleFile()] : [react()],
}));
