import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const entry = fileURLToPath(new URL('./src/index.ts', import.meta.url));

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry,
      name: 'Vue3StepWizard',
      fileName: (format) =>
        format === 'es' ? 'vue3-step-wizard.es.js' : 'vue3-step-wizard.umd.cjs'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(entry), '.')
    }
  }
});
