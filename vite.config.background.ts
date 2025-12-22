import { defineConfig } from 'vite'
import { sharedConfig } from './vite.config'
import { r, isDev } from './scripts/utils'

export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev
      ? {
        include: [
          r('src/**/*'),
        ],
      }
      : undefined,
    outDir: r('extension/dist/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('src/background/main.ts'),
      name: 'background',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.mjs',
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,
  ],
})
