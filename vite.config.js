import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Readable } from 'node:stream'

const HLS_PROXY_PREFIX = '/__hls_proxy__'
const ALLOWED_HOSTS = ['youplay.estantedigital.sbs']
const HLS_ORIGINS = {
  stream: 'https://stream.youplay.com.br',
  media: 'https://media.youplay.com.br',
}

function attachHlsProxy(server) {
  server.middlewares.use(HLS_PROXY_PREFIX, async (req, res) => {
    try {
      const requestUrl = new URL(req.url, 'http://localhost')
      const segments = requestUrl.pathname.split('/').filter(Boolean)
      const sourceType = segments.shift()
      const sourceOrigin = HLS_ORIGINS[sourceType]

      if (!sourceOrigin || segments.length === 0) {
        res.statusCode = 404
        res.end('HLS source not found')
        return
      }

      const upstreamUrl = new URL(`/${segments.join('/')}${requestUrl.search}`, sourceOrigin)
      const upstreamResponse = await fetch(upstreamUrl, {
        headers: req.headers.range ? { Range: req.headers.range } : undefined,
      })

      res.statusCode = upstreamResponse.status
      upstreamResponse.headers.forEach((value, name) => {
        if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(name)) {
          res.setHeader(name, value)
        }
      })

      const isPlaylist =
        upstreamUrl.pathname.endsWith('.m3u8') ||
        upstreamResponse.headers.get('content-type')?.includes('mpegurl')

      if (isPlaylist) {
        const playlist = await upstreamResponse.text()
        const proxiedPlaylist = playlist
          .replaceAll(`${HLS_ORIGINS.stream}/`, `${HLS_PROXY_PREFIX}/stream/`)
          .replaceAll(`${HLS_ORIGINS.media}/`, `${HLS_PROXY_PREFIX}/media/`)

        res.setHeader('content-type', 'application/vnd.apple.mpegurl')
        res.end(proxiedPlaylist)
        return
      }

      if (!upstreamResponse.body) {
        res.end()
        return
      }

      Readable.fromWeb(upstreamResponse.body).pipe(res)
    } catch (error) {
      res.statusCode = 502
      res.end(`HLS proxy error: ${error.message}`)
    }
  })
}

function hlsDevelopmentProxy() {
  return {
    name: 'youplay-hls-development-proxy',
    configureServer: attachHlsProxy,
    configurePreviewServer: attachHlsProxy,
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), hlsDevelopmentProxy()],
  server: {
    allowedHosts: ALLOWED_HOSTS,
  },
  preview: {
    allowedHosts: ALLOWED_HOSTS,
  },
})
