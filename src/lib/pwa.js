import { useCallback, useEffect, useState } from 'react'

/* Everything the app needs to behave like an installed app: the service-worker
 * registration, the "new version" prompt, the install button and the offline
 * image cache. The service worker itself is `tools/sw.js` – it only exists in a
 * production build (see `tools/vite-plugin-pwa.mjs`). */

// ------------------------------------------------------------------ store
// tiny subscribe-able boxes – the PWA state lives outside React because the
// events that drive it (beforeinstallprompt, updatefound) fire before mount

function createStore(initial) {
  let value = initial
  const subscribers = new Set()
  return {
    get: () => value,
    set(patch) {
      value = { ...value, ...patch }
      subscribers.forEach((fn) => fn(value))
    },
    subscribe(fn) {
      subscribers.add(fn)
      return () => subscribers.delete(fn)
    },
  }
}

function useStore(store) {
  const [value, setValue] = useState(store.get)
  useEffect(() => {
    setValue(store.get())
    return store.subscribe(setValue)
  }, [store])
  return value
}

// ------------------------------------------------------------- display mode

export function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  )
}

export function isIos() {
  const ua = navigator.userAgent
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ pretends to be a Mac
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  )
}

// ------------------------------------------------------------------ install

const installStore = createStore({ prompt: null, installed: false })

if (typeof window !== 'undefined') {
  installStore.set({ installed: isStandalone() })
  window.addEventListener('beforeinstallprompt', (e) => {
    // keep the event: Chrome only hands it over once, and we want our own button
    e.preventDefault()
    installStore.set({ prompt: e })
  })
  window.addEventListener('appinstalled', () =>
    installStore.set({ prompt: null, installed: true })
  )
}

export function useInstall() {
  const { prompt, installed } = useStore(installStore)

  const install = useCallback(async () => {
    if (!prompt) return null
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    installStore.set({ prompt: null })
    return outcome
  }, [prompt])

  return {
    canInstall: !!prompt && !installed,
    installed,
    // iOS never fires beforeinstallprompt – it needs a "use the share sheet" hint
    iosHint: !installed && isIos() && !prompt,
    install,
  }
}

// ------------------------------------------------------------------- update

const updateStore = createStore({ ready: false })
let waiting = null
let reloadOnControllerChange = false

export function useUpdate() {
  const { ready } = useStore(updateStore)
  const apply = useCallback(() => {
    if (!waiting) return
    reloadOnControllerChange = true
    waiting.postMessage({ type: 'skip-waiting' })
  }, [])
  const dismiss = useCallback(() => updateStore.set({ ready: false }), [])
  return { updateReady: ready, applyUpdate: apply, dismissUpdate: dismiss }
}

// ------------------------------------------------------- offline image cache

const mediaStore = createStore({
  active: false, // a service worker is controlling this page
  cached: null,
  total: null,
  busy: false,
})

function post(message) {
  if (!('serviceWorker' in navigator)) return
  navigator.serviceWorker.ready
    .then((reg) => (reg.active || navigator.serviceWorker.controller)?.postMessage(message))
    .catch(() => {})
}

export function useOfflineMedia() {
  const state = useStore(mediaStore)

  useEffect(() => {
    if (state.active) post({ type: 'media-status' })
  }, [state.active])

  return {
    ...state,
    download: useCallback(() => {
      mediaStore.set({ busy: true })
      post({ type: 'cache-media' })
    }, []),
    clear: useCallback(() => post({ type: 'clear-media' }), []),
  }
}

// -------------------------------------------------------------- registration

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  navigator.serviceWorker.addEventListener('message', (event) => {
    const data = event.data || {}
    if (data.type === 'media-status') {
      mediaStore.set({ cached: data.cached, total: data.total, busy: false })
    } else if (data.type === 'media-progress') {
      mediaStore.set({ cached: data.cached, total: data.total, busy: true })
    }
  })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    mediaStore.set({ active: true })
    // only reload when the user asked for the update – the first-ever install
    // also fires this, and reloading then would look like a random flicker
    if (reloadOnControllerChange) {
      reloadOnControllerChange = false
      window.location.reload()
    }
  })

  window.addEventListener('load', async () => {
    let registration
    try {
      // resolve against the document, not this module: the bundle lives in
      // assets/ and would scope the worker to assets/
      registration = await navigator.serviceWorker.register(
        new URL('sw.js', document.baseURI),
        { type: 'classic' }
      )
    } catch (err) {
      return
    }

    mediaStore.set({ active: !!navigator.serviceWorker.controller })
    if (navigator.serviceWorker.controller) post({ type: 'media-status' })

    const track = (worker) => {
      if (!worker) return
      const check = () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          waiting = worker
          updateStore.set({ ready: true })
        }
      }
      check()
      worker.addEventListener('statechange', check)
    }

    track(registration.waiting)
    registration.addEventListener('updatefound', () => track(registration.installing))

    // check for a new build when the app comes back to the foreground, but no
    // more than twice an hour – this runs on phones, on mobile data
    let lastCheck = Date.now()
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastCheck < 30 * 60 * 1000) return
      lastCheck = Date.now()
      registration.update().catch(() => {})
    })
  })
}
