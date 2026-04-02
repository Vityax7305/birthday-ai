import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/yandex': {
        target: 'https://llm.api.cloud.yandex.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yandex/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Добавляем API ключ из переменных окружения
            const apiKey = process.env.VITE_YANDEX_API_KEY;
            if (apiKey) {
              proxyReq.setHeader('Authorization', `Api-Key ${apiKey}`);
            }
          });
        }
      }
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});