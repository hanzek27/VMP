import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // relative base so a build can be dropped into any subdirectory or opened from disk
  base: './',
})
