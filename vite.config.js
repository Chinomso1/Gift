import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Cute Messages 💌',
        short_name: 'CuteMsgs',
        description: 'Sweet little notes for your person.',
        theme_color: '#ff6b81',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          { urlPattern: ({request}) => request.destination === 'document', handler: 'NetworkFirst', options: { cacheName: 'pages' } },
          { urlPattern: ({request}) => ['style','script','worker'].includes(request.destination), handler: 'StaleWhileRevalidate', options: { cacheName: 'assets' } },
          { urlPattern: ({request}) => request.destination === 'image', handler: 'CacheFirst', options: { cacheName: 'images', expiration: { maxEntries: 50, maxAgeSeconds: 60*60*24*30 } } }
        ]
      }
    })
  ]
})
