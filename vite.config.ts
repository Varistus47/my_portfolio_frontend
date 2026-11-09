import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Dev proxy target. Override with VITE_API_PROXY_TARGET in .env.local if the
// backend runs on a different port.
// Note: use 127.0.0.1, not localhost - on Windows `localhost` can resolve to
// ::1 first while uvicorn binds IPv4, giving intermittent ECONNREFUSED.
const DEFAULT_TARGET = 'http://127.0.0.1:8000'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_PROXY_TARGET || DEFAULT_TARGET

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        // Relative /api and /uploads paths mean zero CORS surface in dev, and
        // the photo/resume URLs the API returns work unchanged.
        '/api': { target, changeOrigin: true },
        '/uploads': { target, changeOrigin: true },
      },
    },
    base:process.env.VITE_BASE_PATH || "/my_portfolio_frontend",
  }
})
