import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The app keeps the /lupus context path; the build goes straight into Spring Boot's static resources.
export default defineConfig({
  base: '/lupus/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // dev: everything that is not a frontend asset goes to the Spring Boot backend
    proxy: {
      '/lupus/game': 'http://localhost:8080',
      '/lupus/user': 'http://localhost:8080',
      '/lupus/api': 'http://localhost:8080',
      '/lupus/login': { target: 'http://localhost:8080', bypass: (req) => (req.method === 'GET' ? req.url : null) },
      '/lupus/signup': { target: 'http://localhost:8080', bypass: (req) => (req.method === 'GET' ? req.url : null) },
      '/lupus/logout': 'http://localhost:8080',
      '/lupus/gameWS': { target: 'ws://localhost:8080', ws: true },
    },
  },
});
