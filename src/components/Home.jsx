import { CATEGORIES, totalQuestions } from '../categories'
import { formatDuration } from '../lib/exam'

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
  onSettings,
}) {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero__inner">
          <div className="hero__text">
            <p className="hero__eyebrow">Státní plavební správa</p>
            <h1>Přípravné testy VMP</h1>
            <p className="hero__lead">
              Test appka.
            </p>
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
                <button className="btn btn--soft" onClick={() => onStart(c.id, 'learn')}>
                  Procvičovat ({totalQuestions(c.id)})
                </button>
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
                  : 'Procvičování projde všechny otázky bez bodování a bez času.'}
              </p>
            </article>
            )
          })}
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
    </div>
  )
}
