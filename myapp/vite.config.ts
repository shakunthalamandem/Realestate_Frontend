import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    host: "::",   // network accessible
    port: 4000,   // your desired port
    strictPort: true,
  },
  ssr: {
    noExternal: ["react-router", "react-router-dom"],
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
