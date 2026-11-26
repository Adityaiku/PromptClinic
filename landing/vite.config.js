import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { pathToFileURL } from 'url'

// Custom dev middleware to route /api/* directly to Vercel-style handlers
function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next()
        }

        try {
          const urlPath = req.url.split('?')[0]
          const filePath = path.resolve(process.cwd(), `.${urlPath}.js`)
          const fileUrl = pathToFileURL(filePath).href
          const handlerModule = await import(fileUrl)
          const handler = handlerModule.default || handlerModule

          if (typeof handler === 'function') {
            await handler(req, res)
          } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: `Handler not found for ${urlPath}` }))
          }
        } catch (err) {
          console.error(`Dev API Error [${req.url}]:`, err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false
  }
})
