import { useEffect } from 'react'
import { imgUrl } from './QuestionView'
import { useBackGuard } from '../lib/backGuard'

/**
 * Tap-to-enlarge for the signal drawings. The source images are small (250×199
 * for most of the light diagrams) and the thumbnails in the tahák and the
 * explainer are smaller still – which light sits above which is exactly the
 * detail that gets lost.
 *
 * Closes on backdrop, ✕, Escape and the system back button, like every other
 * closable thing in the app.
 */
export default function Lightbox({ img, caption, onClose }) {
  useBackGuard(true, onClose)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="sheet sheet--center lightbox" onClick={onClose}>
      <div className="lightbox__panel" onClick={(e) => e.stopPropagation()}>
        <img className="lightbox__img" src={imgUrl(img)} alt={caption || ''} />
        {caption && <p className="lightbox__caption">{caption}</p>}
        <button
          className="lightbox__close"
          onClick={onClose}
          aria-label="Zavřít"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  )
}

/**
 * A thumbnail that opens the lightbox. A real button, so it is keyboard- and
 * screen-reader-reachable; the picture itself stays decorative because the
 * meaning is always written next to it.
 */
export function ZoomImage({ img, caption, onZoom }) {
  return (
    <button
      type="button"
      className="zoom"
      onClick={() => onZoom({ img, caption })}
      aria-label="Zvětšit obrázek"
    >
      <img src={imgUrl(img)} alt="" loading="lazy" />
      <span className="zoom__hint" aria-hidden="true">
        ⤢
      </span>
    </button>
  )
}
