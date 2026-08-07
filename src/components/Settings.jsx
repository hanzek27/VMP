const TOGGLES = [
  {
    key: 'noTimeLimit',
    title: 'Vypnout časový limit',
    desc: 'Test poběží bez odpočtu, čas se pouze měří.',
  },
  {
    key: 'markCorrect',
    title: 'Označit správnou odpověď',
    desc: 'Správná možnost je zvýrazněná ještě před odpovědí – vhodné k učení.',
  },
  {
    key: 'instantFeedback',
    title: 'Okamžitá zpětná vazba',
    desc: 'Hned po zvolení odpovědi se ukáže, zda byla správná.',
  },
  {
    key: 'shuffleQuestions',
    title: 'Náhodné pořadí otázek',
    desc: 'Platí i pro režim procvičování.',
  },
  {
    key: 'shuffleAnswers',
    title: 'Náhodné pořadí odpovědí',
    desc: 'Zdroj uvádí správnou odpověď vždy jako první – bez zamíchání je test bezcenný.',
  },
]

import { CATEGORIES } from '../categories'
import { useBackGuard } from '../lib/backGuard'
import OfflineSection from './OfflineSection'

export default function Settings({
  settings,
  missed,
  onChange,
  onReset,
  onClearMissed,
  onBack,
}) {
  const rows = CATEGORIES.map((c) => ({ c, n: missed[c.id]?.length ?? 0 })).filter(
    (r) => r.n > 0
  )
  useBackGuard(true, onBack)

  return (
    <div className="page">
      <header className="topbar">
        <button className="btn btn--ghost" onClick={onBack}>
          <span aria-hidden="true">←</span> Zpět
        </button>
        <h1 className="topbar__title">Nastavení</h1>
        <button className="btn btn--link" onClick={onReset}>
          Výchozí
        </button>
      </header>

      <main className="container container--narrow">
        <ul className="options">
          {TOGGLES.map((t) => (
            <li key={t.key}>
              <label className="option">
                <span className="option__text">
                  <span className="option__title">{t.title}</span>
                  <span className="option__desc">{t.desc}</span>
                </span>
                <input
                  type="checkbox"
                  className="switch"
                  checked={settings[t.key]}
                  onChange={(e) => onChange({ [t.key]: e.target.checked })}
                />
              </label>
            </li>
          ))}
        </ul>

        <section className="mistakes">
          <div className="mistakes__head">
            <h2>Seznam chyb</h2>
            {rows.length > 0 && (
              <button className="btn btn--link" onClick={() => onClearMissed()}>
                Vymazat vše
              </button>
            )}
          </div>
          {rows.length === 0 ? (
            <p className="mistakes__empty">
              Zatím žádné chyby. Otázka se sem přidá, když na ni odpovíte špatně, a
              zmizí, jakmile ji zvládnete.
            </p>
          ) : (
            <ul className="mistakes__list">
              {rows.map(({ c, n }) => (
                <li key={c.id}>
                  <span className="mistakes__cat">{c.name}</span>
                  <span className="mistakes__n">{n}</span>
                  <button className="btn btn--link" onClick={() => onClearMissed(c.id)}>
                    Vymazat
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <OfflineSection />

        <div className="notice notice--muted">
          Režimy <strong>Procvičování</strong> a <strong>Jen moje chyby</strong>{' '}
          spustíte na úvodní obrazovce u každé kategorie. Ani jeden se neboduje a
          neběží v nich čas.
        </div>
      </main>
    </div>
  )
}
