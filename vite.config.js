import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        projects: resolve(root, 'projects.html'),
        achievements: resolve(root, 'achievements.html'),
        contact: resolve(root, 'contact.html')
      }
    }
  }
})
