import { useState } from 'react'
import Lightbox, { ZoomImage } from './Lightbox'
import { getCheatsheet } from '../data/cheatsheets'
import { getCategory } from '../categories'
import { useBackGuard } from '../lib/backGuard'

/**
 * One tahák – a read-only explanation of a topic. No session, no answers, no
 * scoring; the only interactive thing is the jump into practising the topic
 * the sheet covers.
 */
export default function Cheatsheet({ sheetId, onBack, onPractice }) {
  const sheet = getCheatsheet(sheetId)
  const [zoom, setZoom] = useState(null)
  useBackGuard(true, onBack)

  if (!sheet) return null
  const cat = getCategory(sheet.categoryId)

  return (
    <div className="page">
      <header className="topbar">
        <button className="btn btn--ghost" onClick={onBack}>
          <span aria-hidden="true">←</span> Zpět
        </button>
        <h1 className="topbar__title">Tahák</h1>
        <span className="topbar__count" aria-hidden="true">
          {sheet.icon}
        </span>
      </header>

      <main className="container container--narrow">
        <div className="crib__intro">
          <h2 className="crib__title">{sheet.title}</h2>
          <p className="crib__sub">{sheet.subtitle}</p>
          <p className="crib__lead">{sheet.lead}</p>
        </div>

        {sheet.sections.map((s, i) => (
          <section key={s.title} className="crib__section">
            <h3 className="crib__heading">
              <span className="crib__icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="crib__headtext">{s.title}</span>
              <span className="crib__num" aria-hidden="true">
                {i + 1}
              </span>
            </h3>
            {s.blocks.map((b, j) => (
              <Block key={j} block={b} onZoom={setZoom} />
            ))}
          </section>
        ))}

        <div className="crib__foot">
          <button className="btn btn--primary btn--wide" onClick={onPractice}>
            <span aria-hidden="true">🎯</span> Procvičit {sheet.title.toLowerCase()}
          </button>
          <p className="crib__note">
            Otázky okruhu z kategorie {cat.name}, bez bodování a bez času.
          </p>
        </div>
      </main>

      {zoom && (
        <Lightbox img={zoom.img} caption={zoom.caption} onClose={() => setZoom(null)} />
      )}
    </div>
  )
}

function Block({ block, onZoom }) {
  switch (block.kind) {
    case 'lead':
      return <p className="crib__para">{block.text}</p>

    case 'warn':
      return (
        <p className="crib__warn">
          <span aria-hidden="true">⚠️</span> {block.text}
        </p>
      )

    case 'facts':
      return (
        <dl className="crib__facts">
          {block.items.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      )

    case 'rules':
      return (
        <ol className="crib__rules">
          {block.items.map((r) => (
            <li key={r.t}>
              <strong>{r.t}</strong>
              <span>{r.d}</span>
            </li>
          ))}
        </ol>
      )

    case 'cards':
      return (
        <ul className="crib__cards">
          {block.items.map((c) => (
            <li key={c.img} className="crib__card">
              <div className="crib__figs">
                <ZoomImage img={c.img} caption={c.t} onZoom={onZoom} />
                {c.day && (
                  <ZoomImage
                    img={c.day}
                    caption={c.dayText || `${c.t} – denní znak`}
                    onZoom={onZoom}
                  />
                )}
              </div>
              <div className="crib__body">
                <p className="crib__cardtitle">{c.t}</p>
                <p className="crib__cardtext">{c.d}</p>
                {c.dayText && <p className="crib__day">{c.dayText}</p>}
                {c.tag && <span className="crib__tag">{c.tag}</span>}
              </div>
            </li>
          ))}
        </ul>
      )

    default:
      return null
  }
}
