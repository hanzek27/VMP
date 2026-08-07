import { useState } from 'react'
import {
  CATEGORIES,
  getCategory,
  imageCount,
  topicsOf,
  totalQuestions,
} from '../categories'
import { formatDuration } from '../lib/exam'
import { useBackGuard } from '../lib/backGuard'
import { useInstall } from '../lib/pwa'
import { topicIcon } from '../topics'
import { CHEATSHEETS } from '../data/cheatsheets'

const dateFmt = new Intl.DateTimeFormat('cs-CZ', {
  day: 'numeric',
  month: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export default function Home({
  settings,
  history,
  missed,
  onClearHistory,
  onStart,
  onExplain,
  onCrib,
  onSettings,
}) {
  const [picker, setPicker] = useState(null)
  const { canInstall, install } = useInstall()
  useBackGuard(!!picker, () => setPicker(null))

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__inner">
          <div className="hero__text">
            <p className="hero__eyebrow">Státní plavební správa</p>
            <h1>Přípravné testy VMP</h1>
            <p className="hero__lead">Hromada kravin a nesrovnalostí prostě to nabifluj</p>
            {canInstall && (
              <button className="btn btn--install hero__install" onClick={install}>
                <span aria-hidden="true">⤓</span> Instalovat aplikaci
              </button>
            )}
          </div>
          <button className="btn btn--ghost hero__settings" onClick={onSettings}>
            <span aria-hidden="true">⚙</span> Nastavení
          </button>
        </div>
        <svg className="hero__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,40 C240,80 480,0 720,24 C960,48 1200,80 1440,44 L1440,80 L0,80 Z" />
        </svg>
      </header>

      <main className="container">
        {(settings.noTimeLimit || settings.markCorrect) && (
          <div className="notice">
            <strong>Aktivní úpravy:</strong>{' '}
            {[
              settings.noTimeLimit && 'bez časového limitu',
              settings.markCorrect && 'správná odpověď je označena',
            ]
              .filter(Boolean)
              .join(' · ')}
          </div>
        )}

        <section className="cards">
          {CATEGORIES.map((c) => {
            const missedCount = missed[c.id]?.length ?? 0
            // S has no pictures at all – no point offering the explainer there
            const pictures = imageCount(c.id)
            return (
            <article key={c.id} className={`card card--${c.accent}`}>
              <div className="card__head">
                <span className="card__badge">{c.id}</span>
                <div>
                  <h2 className="card__title">{c.name}</h2>
                  <p className="card__subtitle">{c.subtitle}</p>
                </div>
              </div>

              <dl className="stats">
                <div>
                  <dt>Otázek</dt>
                  <dd>{c.questionCount}</dd>
                </div>
                <div>
                  <dt>K úspěchu</dt>
                  <dd>{c.passMark} b.</dd>
                </div>
                <div>
                  <dt>Čas</dt>
                  <dd>
                    {settings.noTimeLimit ? (
                      <span className="stat--off">bez limitu</span>
                    ) : (
                      `${c.timeLimitMin} min`
                    )}
                  </dd>
                </div>
              </dl>

              <div className="card__actions">
                <button className="btn btn--primary" onClick={() => onStart(c.id, 'exam')}>
                  Spustit test
                </button>
                <button className="btn btn--topic" onClick={() => setPicker(c.id)}>
                  <span aria-hidden="true">🎯</span> Procvičit
                </button>
                {pictures > 0 && (
                  <button
                    className="btn btn--explain btn--span"
                    onClick={() => onExplain(c.id)}
                  >
                    <span aria-hidden="true">🖼</span> Obrázkový supervysvětlovač (
                    {pictures})
                  </button>
                )}
                {missedCount > 0 && (
                  <button
                    className="btn btn--mistakes btn--span"
                    onClick={() => onStart(c.id, 'mistakes')}
                  >
                    <span aria-hidden="true">✕</span> Jen moje chyby ({missedCount})
                  </button>
                )}
              </div>
              <p className="card__hint">
                {missedCount > 0
                  ? 'Chybně zodpovězené otázky se ze seznamu ztratí, jakmile na ně odpovíte správně.'
                  : 'Procvičovat lze jeden okruh nebo všechny otázky – bez bodování a bez času.'}
              </p>
            </article>
            )
          })}
        </section>

        <section className="cribs">
          <div className="cribs__head">
            <h2>Taháky</h2>
            <p className="cribs__sub">
              Vysvětlení místo biflování – proč signály vypadají tak, jak vypadají.
            </p>
          </div>
          <ul className="cribs__list">
            {CHEATSHEETS.map((s) => (
              <li key={s.id}>
                <button className="crib" onClick={() => onCrib(s.id)}>
                  <span className="crib__badge" aria-hidden="true">
                    {s.icon}
                  </span>
                  <span className="crib__text">
                    <span className="crib__name">{s.title}</span>
                    <span className="crib__meta">{s.subtitle}</span>
                  </span>
                  <span className="crib__go" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {history.length > 0 && (
          <section className="history">
            <div className="history__head">
              <h2>Poslední pokusy</h2>
              <button className="btn btn--link" onClick={onClearHistory}>
                Vymazat
              </button>
            </div>
            <ul className="history__list">
              {history.map((h, i) => (
                <li key={i} className={h.passed ? 'is-pass' : 'is-fail'}>
                  <span className="history__pill">{h.passed ? 'Prospěl' : 'Neprospěl'}</span>
                  <span className="history__cat">{h.categoryName}</span>
                  <span className="history__score">
                    {h.correct}/{h.total}
                  </span>
                  <span className="history__meta">
                    {formatDuration(h.elapsedMs)} · {dateFmt.format(new Date(h.at))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="footer">
          <p>
            Zdroj otázek:{' '}
            <a href="http://www.spspraha.cz/zkousky/" target="_blank" rel="noreferrer">
              spspraha.cz
            </a>
            . Neoficiální pomůcka pro přípravu – závazné je vždy zadání zkoušky.
          </p>
        </footer>
      </main>

      {picker && (
        <div className="sheet" onClick={() => setPicker(null)}>
          <div
            className="sheet__panel sheet__panel--full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet__head">
              <div>
                <h2>Procvičit</h2>
                <p className="sheet__sub">{getCategory(picker).name}</p>
              </div>
              <button
                className="btn btn--ghost btn--icon"
                onClick={() => setPicker(null)}
                aria-label="Zavřít"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <ul className="topics sheet__scroll">
              {/* the whole bank, in the same list – the card no longer has a
                  separate button for it */}
              <li>
                <button
                  className="topic topic--all"
                  onClick={() => {
                    const cat = picker
                    setPicker(null)
                    onStart(cat, 'learn')
                  }}
                >
                  <span className="topic__icon" aria-hidden="true">
                    📚
                  </span>
                  <span className="topic__label">Všechny otázky</span>
                  <span className="topic__count">{totalQuestions(picker)}</span>
                </button>
              </li>
              {topicsOf(picker).map((t) => (
                <li key={t.id}>
                  <button
                    className="topic"
                    onClick={() => {
                      const cat = picker
                      setPicker(null)
                      onStart(cat, 'topic', t.id)
                    }}
                  >
                    <span className="topic__icon" aria-hidden="true">
                      {topicIcon(t.id)}
                    </span>
                    <span className="topic__label">{t.label}</span>
                    <span className="topic__count">{t.count}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="sheet__foot">
              <p className="sheet__note">
                Procvičování se neboduje a neběží v něm čas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
