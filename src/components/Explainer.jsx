import { useMemo, useState } from 'react'
import Lightbox, { ZoomImage } from './Lightbox'
import { getCategory, imageCards, topicsOf } from '../categories'
import { plural } from '../lib/exam'
import { useBackGuard } from '../lib/backGuard'
import { topicIcon } from '../topics'

/**
 * Every picture in a category with its correct answer right next to it – no
 * quizzing, no scoring. Meant for scrolling through signs and lights until
 * they stick.
 */
export default function Explainer({ categoryId, onBack }) {
  const cat = getCategory(categoryId)
  const [zoom, setZoom] = useState(null)
  useBackGuard(true, onBack)

  const groups = useMemo(() => {
    const byTopic = new Map()
    for (const card of imageCards(categoryId)) {
      if (!byTopic.has(card.topic)) byTopic.set(card.topic, [])
      byTopic.get(card.topic).push(card)
    }
    // topicsOf() gives the declared topic order; its counts are of all
    // questions, so the picture counts replace them
    return topicsOf(categoryId)
      .filter((t) => byTopic.has(t.id))
      .map((t) => ({ ...t, cards: byTopic.get(t.id), count: byTopic.get(t.id).length }))
  }, [categoryId])

  const total = groups.reduce((n, g) => n + g.count, 0)

  return (
    <div className="page">
      <header className="topbar">
        <button className="btn btn--ghost" onClick={onBack}>
          <span aria-hidden="true">←</span> Zpět
        </button>
        <h1 className="topbar__title">Supervysvětlovač</h1>
        <span className="topbar__count">{total}</span>
      </header>

      <main className="container container--narrow">
        <p className="explain__intro">
          {cat.name} – {total} {plural(total, 'obrázek', 'obrázky', 'obrázků')} z otázek,
          u každého rovnou správná odpověď. Nic se tu neboduje, jen se to prohlíží.
        </p>

        {groups.map((g) => (
          <section key={g.id} className="explain__group">
            <h2 className="explain__heading">
              <span className="explain__icon" aria-hidden="true">
                {topicIcon(g.id)}
              </span>
              <span className="explain__title">{g.label}</span>
              <span className="explain__count">{g.count}</span>
            </h2>

            <ul className="explain__list">
              {g.cards.map((card) => (
                <li key={card.n} className="explain__card">
                  <div className="explain__figs">
                    {card.img.map((name) => (
                      <ZoomImage
                        key={name}
                        img={name}
                        caption={card.answer || card.lead.replace(/\s*:$/, '')}
                        onZoom={setZoom}
                      />
                    ))}
                  </div>
                  <div className="explain__body">
                    {card.answer ? (
                      <>
                        <p className="explain__lead">{card.lead}</p>
                        <p className="explain__answer">{card.answer}</p>
                      </>
                    ) : (
                      // image-only answer: the question itself is the whole
                      // caption, and its trailing colon dangles without one
                      <p className="explain__answer explain__answer--lead">
                        {card.lead.replace(/\s*:$/, '')}
                      </p>
                    )}
                    <span className="explain__n">otázka č. {card.n}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      {zoom && (
        <Lightbox img={zoom.img} caption={zoom.caption} onClose={() => setZoom(null)} />
      )}
    </div>
  )
}
