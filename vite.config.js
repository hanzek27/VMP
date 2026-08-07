import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pwa from './tools/vite-plugin-pwa.mjs'

export default defineConfig({
  plugins: [react(), pwa()],
  // relative base so a build can be dropped into any subdirectory or opened from disk
  base: './',
})
