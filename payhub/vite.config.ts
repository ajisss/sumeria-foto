import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    rolldownOptions: {
      output: {
        // Vendor libs dipisah agar cache browser tahan lama dan chunk awal kecil.
        // jspdf & xlsx hanya dimuat lewat dynamic import(), jadi chunk-nya tidak ikut initial load.
        codeSplitting: {
          groups: [
            { name: 'vendor-utils', test: /node_modules[\\/](clsx|tailwind-merge)[\\/]/, priority: 60 },
            { name: 'vendor-helpers', test: /vite[\\/](preload-helper|modulepreload-polyfill)|commonjsHelpers/, priority: 50 },
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 40 },
            { name: 'vendor-recharts', test: /node_modules[\\/](recharts|d3-[^\\/]+|victory-vendor|internmap|decimal\.js-light|es-toolkit|immer|reselect|redux|@reduxjs)[\\/]/, priority: 30 },
            { name: 'vendor-html2canvas', test: /node_modules[\\/](html2canvas|canvg|stackblur-canvas|rgbcolor|svg-pathdata|raf|performance-now)[\\/]/, priority: 35 },
            { name: 'vendor-purify', test: /node_modules[\\/]dompurify[\\/]/, priority: 35 },
            { name: 'vendor-pdf', test: /node_modules[\\/](jspdf|fflate|core-js|fast-png|iobuffer|pako)[\\/]/, priority: 30 },
            { name: 'vendor-xlsx', test: /node_modules[\\/]xlsx[\\/]/, priority: 30 },
            { name: 'vendor-ui', test: /node_modules[\\/](radix-ui|@radix-ui|@base-ui|cmdk|vaul|sonner|react-day-picker|lucide-react|class-variance-authority)[\\/]/, priority: 20 },
          ],
        },
      },
    },
  },
})
