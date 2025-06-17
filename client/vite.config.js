import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),
    react()],
    build: {
    outDir: 'dist',
  },
  base: '/',
})


// No need to import tailwindcss plugin like that — Tailwind works via `postcss.config.js`
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist',
//   },
//   base: '/', // 🔥 Ensures all routes and assets work correctly
// })
