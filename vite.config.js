import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => funciona em qualquer repositório do GitHub Pages (usuario.github.io/repo/)
export default defineConfig({
  base: './',
  plugins: [react()],
})
