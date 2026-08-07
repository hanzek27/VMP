import { useUpdate } from '../lib/pwa'

/* A new build is already downloaded and waiting – it only takes over when the
 * user says so, because applying it reloads the page and a running exam would
 * go with it. */
export default function UpdateToast() {
  const { updateReady, applyUpdate, dismissUpdate } = useUpdate()
  if (!updateReady) return null

  return (
    <div className="toast" role="status">
      <span className="toast__text">
        <strong>Je k dispozici nová verze.</strong> Aktualizace stránku znovu načte.
      </span>
      <span className="toast__actions">
        <button className="btn btn--ghost" onClick={dismissUpdate}>
          Později
        </button>
        <button className="btn btn--primary" onClick={applyUpdate}>
          Aktualizovat
        </button>
      </span>
    </div>
  )
}
