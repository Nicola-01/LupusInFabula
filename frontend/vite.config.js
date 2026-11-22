import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The app is served at the root path; the build goes straight into Spring Boot's static resources.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src') },
  },
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    strictPort: true,
    // dev: everything that is not a frontend asset goes to the Spring Boot backend
    proxy: {
      '/game': 'http://localhost:9090',
      '/user': 'http://localhost:9090',
      '/api': 'http://localhost:9090',
      '/config.js': 'http://localhost:9090',
      '/login': { target: 'http://localhost:9090', bypass: (req) => (req.method === 'GET' ? req.url : null) },
      '/signup': { target: 'http://localhost:9090', bypass: (req) => (req.method === 'GET' ? req.url : null) },
      '/logout': 'http://localhost:9090',
      '/gameWS': { target: 'ws://localhost:9090', ws: true },
    },
  },
});
