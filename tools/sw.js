/* Service worker for VMP Testy.
 *
 * This file is a template: `tools/vite-plugin-pwa.mjs` copies it into `dist/`
 * after a build and replaces the three placeholders below with the real file
 * list. It is never bundled by Vite, so keep it dependency-free.
 *
 * Two caches, on purpose:
 *   shell — HTML/JS/CSS/icons, versioned, precached on install (~350 kB, and
 *           it already contains the whole question bank)
 *   media — the 242 question images (5 MB). Cached on demand as questions are
 *           shown, or all at once from Settings. Survives app updates: the
 *           filenames come from the scraper and are stable.
 */

const VERSION = '__VERSION__'
const SHELL = __SHELL__
const MEDIA = __MEDIA__

const SHELL_CACHE = 'vmp-shell-' + VERSION
const MEDIA_CACHE = 'vmp-media-v1'

const abs = (path) => new URL(path, self.registration.scope).href
const INDEX = abs('index.html')
const MEDIA_URLS = MEDIA.map(abs)
const MEDIA_SET = new Set(MEDIA_URLS)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL.map(abs)))
  )
  // no skipWaiting(): swapping the bundle out from under a running exam would
  // lose it. The page asks the user and posts 'skip-waiting' when they agree.
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((k) => k.startsWith('vmp-shell-') && k !== SHELL_CACHE)
          .map((k) => caches.delete(k))
      )
      // drop images that a re-scrape removed from the bank
      const media = await caches.open(MEDIA_CACHE)
      for (const req of await media.keys()) {
        if (!MEDIA_SET.has(req.url)) await media.delete(req)
      }
      await self.clients.claim()
    })()
  )
})

async function cacheFirst(cacheName, request) {
  const cache = await caches.open(cacheName)
  const hit = await cache.match(request)
  if (hit) return hit
  try {
    const res = await fetch(request)
    if (res && res.ok && res.type === 'basic') cache.put(request, res.clone())
    return res
  } catch (err) {
    const fallback = await caches.match(request)
    if (fallback) return fallback
    throw err
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // one page, one entry point – any navigation resolves to the cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(INDEX).then((hit) => hit || fetch(request))
    )
    return
  }

  event.respondWith(
    cacheFirst(MEDIA_SET.has(url.href) ? MEDIA_CACHE : SHELL_CACHE, request)
  )
})

async function broadcast(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  for (const client of clients) client.postMessage(message)
}

async function mediaStatus() {
  const cache = await caches.open(MEDIA_CACHE)
  const have = new Set((await cache.keys()).map((r) => r.url))
  let cached = 0
  for (const url of MEDIA_URLS) if (have.has(url)) cached++
  return { type: 'media-status', cached, total: MEDIA_URLS.length }
}

let downloading = false

async function downloadMedia() {
  if (downloading) return
  downloading = true
  try {
    const cache = await caches.open(MEDIA_CACHE)
    const have = new Set((await cache.keys()).map((r) => r.url))
    const missing = MEDIA_URLS.filter((url) => !have.has(url))
    let done = MEDIA_URLS.length - missing.length
    let failed = 0
    const queue = missing.slice()

    // six at a time: enough to saturate a phone connection, few enough that
    // the app stays responsive while it runs
    const worker = async () => {
      while (queue.length) {
        const url = queue.shift()
        try {
          const res = await fetch(url, { cache: 'no-cache' })
          if (res.ok) await cache.put(url, res)
          else failed++
        } catch (err) {
          failed++
        }
        done++
        if (done % 5 === 0 || !queue.length) {
          await broadcast({
            type: 'media-progress',
            cached: done - failed,
            total: MEDIA_URLS.length,
          })
        }
      }
    }
    await Promise.all(Array.from({ length: 6 }, worker))
    await broadcast({ ...(await mediaStatus()), done: true, failed })
  } finally {
    downloading = false
  }
}

self.addEventListener('message', (event) => {
  const type = event.data && event.data.type
  if (type === 'skip-waiting') self.skipWaiting()
  else if (type === 'media-status') event.waitUntil(mediaStatus().then(broadcast))
  else if (type === 'cache-media') event.waitUntil(downloadMedia())
  else if (type === 'clear-media') {
    event.waitUntil(
      caches.delete(MEDIA_CACHE).then(() => mediaStatus().then(broadcast))
    )
  }
})
