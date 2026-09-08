import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-ti.jpg', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Transparency Hub',
        short_name: 'Transparency',
        description: 'Demo disc launcher for the Transparency ecosystem',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  base: './',
  server: {
    port: 5180,
    strictPort: false
  },
  build: {
    chunkSizeWarningLimit: 1600
  }
});
