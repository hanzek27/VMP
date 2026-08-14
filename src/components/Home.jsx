import { useMemo, useState } from 'react'
import {
  CATEGORIES,
  getCategory,
  imageCount,
  runIcon,
  runLabel,
  topicsOf,
  totalQuestions,
} from '../categories'
import { ALL_TOPICS, formatDuration, plural, runProgress } from '../lib/exam'
import { progressKey, useCategory } from '../lib/storage'
import { useBackGuard } from '../lib/backGuard'
import { useInstall } from '../lib/pwa'
import { topicIcon } from '../topics'
import { CHEATSHEETS } from '../data/cheatsheets'
import CompassRose from './CompassRose'
import Icon from './Icon'

const dateFmt = new Intl.DateTimeFormat('cs-CZ', {
  day: 'numeric',
  month: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/**
 * The home screen shows **one category at a time**. The three categories used
 * to sit side by side as three identical cards, which meant the same four
 * buttons three times over and a screen you had to scroll past to reach
 * anything. Picking the category once turns the rest of the screen into that
 * category's dashboard, and the choice is remembered.
 */
export default function Home({
  settings,
  history,
  missed,
  mastered,
  runs,
  onClearHistory,
  onStart,
  onResume,
  onDropProgress,
  onExplain,
  onCrib,
  onSettings,
}) {
  const [savedId, selectCategory] = useCategory(CATEGORIES[0].id)
  const cat = getCategory(savedId) ?? CATEGORIES[0]
  // 'topics' | 'cribs' | null
  const [sheet, setSheet] = useState(null)
  const [dropKey, setDropKey] = useState(null)
  const { canInstall, install } = useInstall()
  useBackGuard(!!sheet, () => setSheet(null))
  useBackGuard(!!dropKey, () => setDropKey(null))

  // unfinished practice runs, newest first
  const resumable = useMemo(
    () =>
      Object.entries(runs)
        .map(([key, run]) => {
          const c = getCategory(run?.categoryId)
          if (!c || !Array.isArray(run.answers) || !Array.isArray(run.qs)) return null
          return {
            key,
            cat: c,
            label: runLabel(run),
            icon: runIcon(run),
            updatedAt: run.updatedAt ?? 0,
            ...runProgress(run),
          }
        })
        .filter(Boolean)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [runs]
  )
  const mine = resumable.filter((r) => r.cat.id === cat.id)
  const elsewhere = resumable.length - mine.length
  const dropping = resumable.find((r) => r.key === dropKey)

  const topics = topicsOf(cat.id)
  const pictures = imageCount(cat.id)
  const cribs = CHEATSHEETS.filter((s) => s.categoryId === cat.id)
  const missedCount = missed[cat.id]?.length ?? 0
  const last = history.find((h) => h.categoryId === cat.id)

  // topics finished with every question right, so far
  const clean = mastered[cat.id] ?? {}
  const cleanCount = topics.filter((t) => clean[t.id]).length

  /** The saved run behind a picker row, if there is one. */
  const runFor = (mode, topic = null) =>
    resumable.find((r) => r.key === progressKey({ categoryId: cat.id, mode, topic }))

  const tweaks = [
    settings.noTimeLimit && 'bez limitu',
    settings.markCorrect && 'označená odpověď',
    settings.instantFeedback && 'okamžitá zpětná vazba',
  ].filter(Boolean)

  return (
    <div className="page">
      <header className="mast">
        <div className="mast__inner">
          <CompassRose className="mast__mark" compact />
          <span className="mast__name">VMP</span>
          <button className="iconbtn" onClick={onSettings} aria-label="Nastavení">
            <Icon name="gear" />
          </button>
        </div>

        <div className="switch3" role="tablist" aria-label="Kategorie zkoušky">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={c.id === cat.id}
              className={`switch3__btn ${c.id === cat.id ? 'is-on' : ''}`}
              onClick={() => selectCategory(c.id)}
            >
              <span className="switch3__id">{c.id}</span>
              <span className="switch3__name">{c.short}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="container container--deck">
        {/* the user's own line – leave the wording alone */}
        <p className="lede">Hromada kravin a nesrovnalostí prostě to nabifluj</p>

        {/* one column on a phone; the brief and the training deck sit side by
            side once there is room for both above the fold */}
        <div className="deck">
        <section className="brief">
          <h1 className="brief__title">{cat.name}</h1>
          <p className="brief__sub">{cat.subtitle}</p>

          <dl className="specs">
            <div>
              <dt>Otázek</dt>
              <dd>{cat.questionCount}</dd>
            </div>
            <div>
              <dt>Limit</dt>
              <dd>
                {settings.noTimeLimit ? <em>vypnut</em> : `${cat.timeLimitMin} min`}
              </dd>
            </div>
            <div>
              <dt>Banka</dt>
              <dd>{totalQuestions(cat.id)}</dd>
            </div>
          </dl>

          <PassScale total={cat.questionCount} passMark={cat.passMark} last={last} />

          <button className="btn btn--go" onClick={() => onStart(cat.id, 'exam')}>
            Spustit zkoušku
            <Icon name="chevron" size={20} />
          </button>

          {tweaks.length > 0 && (
            <button className="brief__tweaks" onClick={onSettings}>
              <Icon name="gear" size={16} />
              Aktivní úpravy: {tweaks.join(' · ')}
            </button>
          )}
        </section>

        <div className="deck__side">
        {mine.length > 0 && (
          <section className="block">
            <h2 className="block__head">
              Rozdělaná práce
              <span className="block__note">{mine.length}</span>
            </h2>
            <ul className="runs">
              {mine.map((r) => (
                <li key={r.key}>
                  <button className="run" onClick={() => onResume(r.key)}>
                    <Icon name={r.icon} className="run__icon" />
                    <span className="run__text">
                      <span className="run__name">{r.label}</span>
                      <span className="run__meta">
                        {r.answered}/{r.total}{' '}
                        {plural(r.total, 'otázka', 'otázky', 'otázek')} ·{' '}
                        {dateFmt.format(new Date(r.updatedAt))}
                      </span>
                      <span className="run__bar" aria-hidden="true">
                        <span style={{ width: `${Math.round((r.answered / r.total) * 100)}%` }} />
                      </span>
                    </span>
                    <Icon name="play" size={16} className="run__go" />
                  </button>
                  <button
                    className="iconbtn iconbtn--quiet"
                    onClick={() => setDropKey(r.key)}
                    aria-label={`Smazat postup – ${r.label}`}
                    title="Smazat postup"
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="block">
          <h2 className="block__head">Trénink</h2>
          <div className="tiles">
            <button className="tile" onClick={() => setSheet('topics')}>
              <Icon name="rings" size={26} className="tile__icon" />
              <span className="tile__name">Okruhy</span>
              <span className="tile__meta">
                {topics.length} {plural(topics.length, 'okruh', 'okruhy', 'okruhů')} ·{' '}
                {cleanCount > 0
                  ? `${cleanCount} bez chyby`
                  : `${totalQuestions(cat.id)} otázek`}
              </span>
            </button>

            <button
              className="tile tile--bad"
              onClick={() => onStart(cat.id, 'mistakes')}
              disabled={missedCount === 0}
            >
              <Icon name="mistakes" size={26} className="tile__icon" />
              <span className="tile__name">Moje chyby</span>
              <span className="tile__meta">
                {missedCount > 0
                  ? `${missedCount} ${plural(missedCount, 'otázka', 'otázky', 'otázek')} k opravě`
                  : 'zatím čisto'}
              </span>
            </button>

            <button
              className="tile"
              onClick={() => onExplain(cat.id)}
              disabled={pictures === 0}
            >
              <Icon name="images" size={26} className="tile__icon" />
              <span className="tile__name">Obrázky</span>
              <span className="tile__meta">
                {pictures > 0
                  ? `${pictures} ${plural(pictures, 'obrázek', 'obrázky', 'obrázků')} s odpovědí`
                  : 'v této kategorii nejsou'}
              </span>
            </button>

            <button
              className="tile"
              onClick={() => (cribs.length === 1 ? onCrib(cribs[0].id) : setSheet('cribs'))}
              disabled={cribs.length === 0}
            >
              <Icon name="scroll" size={26} className="tile__icon" />
              <span className="tile__name">Taháky</span>
              <span className="tile__meta">
                {cribs.length > 0
                  ? `${cribs.length} ${plural(cribs.length, 'vysvětlení', 'vysvětlení', 'vysvětlení')} místo biflování`
                  : 'zatím jen pro M'}
              </span>
            </button>
          </div>

          {elsewhere > 0 && (
            <p className="block__aside">
              V ostatních kategoriích {plural(elsewhere, 'čeká', 'čekají', 'čeká')}{' '}
              {elsewhere} {plural(elsewhere, 'rozdělaná', 'rozdělané', 'rozdělaných')}{' '}
              {plural(elsewhere, 'práce', 'práce', 'prací')}.
            </p>
          )}
        </section>

        {canInstall && (
          <button className="install" onClick={install}>
            <Icon name="download" size={22} />
            <span>
              <strong>Nainstalovat do telefonu</strong>
              <em>Funguje pak i bez signálu, na vodě i v podpalubí.</em>
            </span>
          </button>
        )}

        </div>
        </div>

        {history.length > 0 && (
          <section className="block">
            <h2 className="block__head">
              Lodní deník
              <button className="linkbtn" onClick={onClearHistory}>
                Vymazat
              </button>
            </h2>
            <ul className="log">
              {history.map((h, i) => (
                <li key={i} className={h.passed ? 'is-pass' : 'is-fail'}>
                  <span className="log__verdict">{h.passed ? 'prospěl' : 'neprospěl'}</span>
                  <span className="log__score">
                    {h.correct}
                    <em>/{h.total}</em>
                  </span>
                  <span className="log__meta">
                    {h.categoryName} · {formatDuration(h.elapsedMs)} ·{' '}
                    {dateFmt.format(new Date(h.at))}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="footer">
          <p>
            Otázky:{' '}
            <a href="http://www.spspraha.cz/zkousky/" target="_blank" rel="noreferrer">
              spspraha.cz
            </a>
            . Neoficiální pomůcka – závazné je vždy zadání zkoušky.
          </p>
        </footer>
      </main>

      {sheet === 'topics' && (
        <Sheet
          title="Okruhy"
          sub={`${cat.name} · bez bodů a bez času`}
          onClose={() => setSheet(null)}
          foot="Rozdělané procvičování se ukládá samo."
        >
          <li>
            <button
              className="row row--all"
              onClick={() => {
                setSheet(null)
                onStart(cat.id, 'learn')
              }}
            >
              <Icon name="folder" className="row__icon" />
              <span className="row__label">
                Všechny otázky
                <ProgressNote run={runFor('learn')} />
              </span>
              <CleanMark on={clean[ALL_TOPICS]} />
              <span className="row__count">{totalQuestions(cat.id)}</span>
            </button>
          </li>
          {topics.map((t) => (
            <li key={t.id}>
              <button
                className="row"
                onClick={() => {
                  setSheet(null)
                  onStart(cat.id, 'topic', t.id)
                }}
              >
                <Icon name={topicIcon(t.id)} className="row__icon" />
                <span className="row__label">
                  {t.label}
                  <ProgressNote run={runFor('topic', t.id)} />
                </span>
                <CleanMark on={clean[t.id]} />
                <span className="row__count">{t.count}</span>
              </button>
            </li>
          ))}
        </Sheet>
      )}

      {sheet === 'cribs' && (
        <Sheet
          title="Taháky"
          sub="Proč signály vypadají tak, jak vypadají"
          onClose={() => setSheet(null)}
        >
          {cribs.map((s) => (
            <li key={s.id}>
              <button
                className="row"
                onClick={() => {
                  setSheet(null)
                  onCrib(s.id)
                }}
              >
                <Icon name={s.icon} className="row__icon" />
                <span className="row__label">
                  {s.title}
                  <span className="row__note">{s.subtitle}</span>
                </span>
                <Icon name="chevron" size={16} className="row__count" />
              </button>
            </li>
          ))}
        </Sheet>
      )}

      {dropping && (
        <div className="scrim scrim--center" onClick={() => setDropKey(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>Zahodit rozdělanou práci?</h2>
            <p>
              {dropping.label} ({dropping.cat.name}) – {dropping.answered} z{' '}
              {dropping.total} otázek. Příště se začne od začátku.
            </p>
            <div className="dialog__actions">
              <button className="btn btn--soft" onClick={() => setDropKey(null)}>
                Nechat
              </button>
              <button
                className="btn btn--danger"
                onClick={() => {
                  onDropProgress(dropping.key)
                  setDropKey(null)
                }}
              >
                Zahodit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * The pass mark drawn as what it is: a line on a scale you have to get past.
 * With a previous attempt in the log its score sits on the same scale, so
 * "33/35" says something without doing arithmetic.
 */
function PassScale({ total, passMark, last }) {
  const pct = (n) => `${(n / total) * 100}%`
  const scored = last && last.total === total ? last.correct : null

  return (
    <div className="scale">
      <div className="scale__rail" style={{ '--n': total }}>
        {scored !== null && (
          <div
            className={`scale__fill ${last.passed ? 'is-pass' : 'is-fail'}`}
            style={{ width: pct(scored) }}
          />
        )}
        <div className="scale__mark" style={{ left: pct(passMark) }} />
      </div>
      <div className="scale__legend">
        <span className="scale__pass">prospěl od {passMark}</span>
        {scored !== null && (
          <span className={`scale__last ${last.passed ? 'is-pass' : 'is-fail'}`}>
            minule {scored}/{total}
          </span>
        )}
      </div>
    </div>
  )
}

/** The bottom sheet used by both pickers – one scrolling list, pinned header. */
function Sheet({ title, sub, foot, onClose, children }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel__head">
          <div>
            <h2>{title}</h2>
            {sub && <p className="panel__sub">{sub}</p>}
          </div>
          <button className="iconbtn" onClick={onClose} aria-label="Zavřít">
            <Icon name="close" />
          </button>
        </div>
        <ul className="panel__scroll rows">{children}</ul>
        {foot && (
          <div className="panel__foot">
            <p className="panel__note">{foot}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/** "rozdělaných 12/82" under a picker row that has saved progress. */
function ProgressNote({ run }) {
  if (!run) return null
  return (
    <span className="row__note row__note--on">
      rozdělaných {run.answered}/{run.total}
    </span>
  )
}

/**
 * The mark on a topic finished with every question right. It disappears again
 * the moment one of that topic's questions is answered wrong, so it always
 * means "clean as of now" rather than "was clean once".
 */
function CleanMark({ on }) {
  if (!on) return null
  return (
    <Icon
      name="verified"
      size={18}
      className="row__clean"
      title="Zvládnuto – naposledy celé správně"
    />
  )
}
