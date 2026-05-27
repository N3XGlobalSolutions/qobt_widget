import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(), // Injects CSS into the JS bundle (no separate CSS file)
  ],
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'QBotWidget',
      fileName: () => 'widget.js',
      formats: ['iife'], // IIFE = Immediately Invoked Function Expression, works in any browser
    },
    rollupOptions: {
      // Do NOT externalize React - bundle everything into one file
      external: [],
      output: {
        inlineDynamicImports: true,
        globals: {},
      },
    },
    // Optimize bundle size (esbuild is built into Vite, no extra install needed)
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2015',
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  server: {
    port: 5173,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
