import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base: sous-chemin du site (GitHub Pages sert le repo sous /kmertude/).
// En dev ('/'), le serveur reste à la racine.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/kmertude/' : '/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}))
