import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: 'popup.html',
        background: 'src/background.ts',
        content: 'src/content.ts'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          // Keep popup.html in root, put other assets in appropriate folders
          if (assetInfo.name === 'popup.html') {
            return '[name][extname]'
          }
          if (assetInfo.name?.endsWith('.css')) {
            return '[name][extname]'
          }
          return 'assets/[name][extname]'
        }
      }
    },
    outDir: '.tmp/chrome',
    emptyOutDir: false, // We handle cleaning manually in build script
    cssCodeSplit: true, // Separate CSS files for better caching
    assetsInlineLimit: 0, // Don't inline small assets
    minify: 'esbuild', // Use esbuild for faster minification
    /* terserOptions: {
      compress: {
        drop_console: true,
        passes: 2,
      },
      mangle: true,
    }, */
    cssMinify: 'esbuild' // Enable CSS minification
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
