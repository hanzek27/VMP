import { plural } from '../lib/exam'
import { isStandalone, useInstall, useOfflineMedia } from '../lib/pwa'

/* Questions and the app shell are cached automatically – the 5 MB of images
 * are not, so downloading them is a deliberate choice made here. */
export default function OfflineSection() {
  const { canInstall, installed, iosHint, install } = useInstall()
  const { active, cached, total, busy, download, clear } = useOfflineMedia()

  const known = total !== null && cached !== null
  const complete = known && cached >= total
  const percent = known && total > 0 ? Math.round((cached / total) * 100) : 0

  return (
    <section className="offline">
      <div className="mistakes__head">
        <h2>Offline a instalace</h2>
        {complete && !busy && (
          <button className="btn btn--link" onClick={clear}>
            Uvolnit místo
          </button>
        )}
      </div>

      {!active ? (
        <p className="mistakes__empty">
          {'serviceWorker' in navigator
            ? 'Offline režim se připraví po prvním načtení aplikace ze sítě. Zkuste stránku načíst znovu.'
            : 'Tento prohlížeč offline režim nepodporuje.'}
        </p>
      ) : (
        <>
          <p className="offline__state">
            Otázky i samotná aplikace fungují offline vždy.{' '}
            {complete
              ? `Uloženo je i všech ${total} ${plural(total, 'obrázek', 'obrázky', 'obrázků')}.`
              : known
                ? `Z obrázků je uloženo ${cached} z ${total} – zbytek se doplní, jak na ně narazíte.`
                : 'Obrázky se ukládají postupně, jak na ně narazíte.'}
          </p>

          {known && !complete && (
            <>
              {busy && (
                <div className="offline__bar" aria-hidden="true">
                  <div className="offline__fill" style={{ width: `${percent}%` }} />
                </div>
              )}
              <button className="btn btn--soft btn--wide" disabled={busy} onClick={download}>
                {busy
                  ? `Stahuji… ${cached}/${total}`
                  : 'Stáhnout všechny obrázky (≈ 5 MB)'}
              </button>
            </>
          )}
        </>
      )}

      {canInstall && (
        <button className="btn btn--primary btn--wide" onClick={install}>
          <span aria-hidden="true">⤓</span> Instalovat jako aplikaci
        </button>
      )}

      {iosHint && (
        <p className="offline__hint">
          Na iPhonu aplikaci přidáte přes <strong>Sdílet</strong> →{' '}
          <strong>Přidat na plochu</strong>.
        </p>
      )}

      {(installed || isStandalone()) && (
        <p className="offline__hint">Aplikace běží v samostatném okně. 🎉</p>
      )}
    </section>
  )
}
