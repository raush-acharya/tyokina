// Builds the real TyoKina app into marketing/app so the marketing page can embed it.
// Output is a classic (non-module) script so it also runs when index.html is opened straight from disk.
// Run from the repo root: node marketing/build-app.mjs
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

await build({
  root,
  base: './',
  plugins: [react()],
  logLevel: 'warn',
  build: {
    outDir: 'marketing/app',
    emptyOutDir: true,
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'assets/app.js' },
    },
  },
})

const file = path.join(root, 'marketing/app/index.html')
const html = readFileSync(file, 'utf8')
  .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
  .replace(/ crossorigin/g, '')
writeFileSync(file, html)
console.log('marketing/app rebuilt')
