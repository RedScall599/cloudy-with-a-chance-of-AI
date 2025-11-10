import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Keep server config minimal: allow Vite to auto-pick an open port.
export default defineConfig({
  plugins: [react()]
})
