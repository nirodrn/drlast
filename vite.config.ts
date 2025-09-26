import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      exclude: /node_modules/,
    }),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|webp)$/i,
      includePublic: true,
      logStats: true,
      ansiColors: true,
      cache: true,
      cacheLocation: '.vite-plugin-image-optimizer-cache',
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
      png: {
        quality: 85,
        compressionLevel: 8,
      },
      jpeg: {
        quality: 85,
        progressive: true,
      },
      jpg: {
        quality: 85,
        progressive: true,
      },
      webp: {
        lossless: false,
        quality: 85,
        method: 6,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          gallery: ['react-lazy-load-image-component'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
});