import { useMemo, useState } from 'react'
import QuestionView from './QuestionView'
import Icon from './Icon'
import { getCategory, groupLabel } from '../categories'
import { formatDuration, isScored, plural, scoreByGroup, scoreSession } from '../lib/exam'
import { useBackGuard } from '../lib/backGuard'
import { topicLabel } from '../topics'

/**
 * The score as a graduated dial rather than a donut: ticks every 10 %, a needle
 * at the score, and the pass mark drawn as its own line on the scale — the one
 * number that decides the whole thing should be visible *on* the instrument.
 */
function Dial({ percent, passPercent, passed }) {
  const cx = 100
  const cy = 96
  const r = 76
  const at = (v, rr) => {
    const a = ((180 + v * 1.8) * Math.PI) / 180
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
  }
  const arc = (from, to, rr) => {
    const [x0, y0] = at(from, rr)
    const [x1, y1] = at(to, rr)
    return `M${x0.toFixed(1)},${y0.toFixed(1)} A${rr},${rr} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`
  }
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10)
  const [nx, ny] = at(percent, r - 20)
  const [mx0, my0] = at(passPercent, r - 13)
  const [mx1, my1] = at(passPercent, r + 5)

  return (
    <svg className="dial" viewBox="0 0 200 130" role="img" aria-label={`${percent} %`}>
      <path className="dial__track" d={arc(0, 100, r)} />
      <path
        className={`dial__value ${passed ? 'is-pass' : 'is-fail'}`}
        d={arc(0, Math.max(percent, 0.4), r)}
      />
      {ticks.map((v) => {
        const long = v % 50 === 0
        const [x0, y0] = at(v, r - (long ? 13 : 8))
        const [x1, y1] = at(v, r - 2)
        return <line key={v} className="dial__tick" x1={x0} y1={y0} x2={x1} y2={y1} />
      })}
      <line className="dial__mark" x1={mx0} y1={my0} x2={mx1} y2={my1} />
      <line className="dial__needle" x1={cx} y1={cy} x2={nx} y2={ny} />
      <circle className="dial__hub" cx={cx} cy={cy} r="5" />
      {/* below the hub: at some angles the needle runs straight through the middle */}
      <text className="dial__pct" x={cx} y={cy + 26}>
        {percent} %
      </text>
    </svg>
  )
}

export default function Result({
  session,
  missedCount = 0,
  onHome,
  onRetry,
  onPracticeMistakes,
}) {
  const cat = getCategory(session.categoryId)
  const scored = isScored(session.mode)
  const mistakes = session.mode === 'mistakes'
  const isTopic = session.mode === 'topic'
  const [onlyWrong, setOnlyWrong] = useState(scored)
  useBackGuard(true, onHome)

  const score = useMemo(() => scoreSession(session), [session])
  const groups = useMemo(() => scoreByGroup(session), [session])

  const rows = session.items
    .map((item, i) => ({ item, i, chosen: session.answers[i] }))
    .filter((r) => !onlyWrong || r.chosen !== r.item.correctIdx)

  return (
    <div className="page">
      <header className={`resulthead ${!scored ? 'is-learn' : score.passed ? 'is-pass' : 'is-fail'}`}>
        <div className="container container--narrow">
          {!scored ? (
            <>
              <p className="resulthead__eyebrow">
                {cat.name} ·{' '}
                {mistakes
                  ? 'opakování chyb'
                  : isTopic
                    ? topicLabel(session.categoryId, session.topic)
                    : 'procvičování'}
              </p>
              <h1>{mistakes && missedCount === 0 ? 'Seznam chyb je prázdný' : 'Hotovo'}</h1>
              <p className="resulthead__lead">
                {mistakes ? (
                  <>
                    Opravili jste {score.correct} z {score.total} opakovaných otázek za{' '}
                    {formatDuration(score.elapsedMs)}.{' '}
                    {missedCount === 0
                      ? 'Všechny dřívější chyby jsou vyřešené.'
                      : `V seznamu chyb ${plural(missedCount, 'zbývá', 'zbývají', 'zbývá')} ` +
                        `${missedCount} ${plural(missedCount, 'otázka', 'otázky', 'otázek')}.`}
                  </>
                ) : (
                  <>
                    Prošli jste {score.answered} z {score.total} otázek
                    {isTopic && ' v tomto okruhu'} za {formatDuration(score.elapsedMs)}.
                    Procvičování se neboduje.
                  </>
                )}
              </p>
            </>
          ) : (
            <>
              <p className="resulthead__eyebrow">{cat.name} · výsledek</p>
              <div className="verdict">
                <Dial
                  percent={score.percent}
                  passPercent={Math.round((score.passMark / score.total) * 100)}
                  passed={score.passed}
                />
                <div className="verdict__text">
                  <span className={`stamp ${score.passed ? 'is-pass' : 'is-fail'}`}>
                    {score.passed ? 'Prospěl/a' : 'Neprospěl/a'}
                  </span>
                  <p className="verdict__score">
                    <strong>{score.correct}</strong>
                    <em>/{score.total} bodů</em>
                  </p>
                  <p className="verdict__meta">
                    potřeba {score.passMark} · čas {formatDuration(score.elapsedMs)}
                    {session.expired && ' · vypršel limit'}
                    {score.unanswered > 0 && ` · bez odpovědi ${score.unanswered}`}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="container container--narrow">
        {scored && (
          <section className="breakdown">
            <h2>Podle souboru otázek</h2>
            <ul>
              {groups.map(([g, row]) => (
                <li key={g}>
                  <span className="breakdown__name">{groupLabel(g)}</span>
                  <span className="breakdown__bar">
                    <span
                      className="breakdown__fill"
                      style={{ width: `${(row.correct / row.total) * 100}%` }}
                    />
                  </span>
                  <span className="breakdown__num">
                    {row.correct}/{row.total}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="resultactions">
          <button
            className="btn btn--go"
            onClick={onRetry}
            disabled={mistakes && missedCount === 0}
          >
            {scored ? 'Zkusit znovu' : 'Procvičovat znovu'}
          </button>
          <button className="btn btn--soft" onClick={onHome}>
            Na úvod
          </button>
          {!mistakes && missedCount > 0 && (
            <button className="btn btn--soft btn--span" onClick={onPracticeMistakes}>
              <Icon name="mistakes" size={18} /> Procvičit chyby ({missedCount})
            </button>
          )}
        </div>

        <section className="review">
          <div className="review__head">
            <h2>Rozbor odpovědí</h2>
            <label className="toggle">
              <input
                type="checkbox"
                checked={onlyWrong}
                onChange={(e) => setOnlyWrong(e.target.checked)}
              />
              Jen chybné
            </label>
          </div>

          {rows.length === 0 ? (
            <p className="review__empty">
              <Icon name="check" size={20} /> Žádné chyby – všechno správně.
            </p>
          ) : (
            <ol className="review__list">
              {rows.map(({ item, i, chosen }) => (
                <li key={i} className={chosen === item.correctIdx ? 'is-ok' : 'is-bad'}>
                  <div className="review__index">
                    #{i + 1}
                    <span>
                      {chosen === null
                        ? 'bez odpovědi'
                        : chosen === item.correctIdx
                          ? 'správně'
                          : 'chybně'}
                    </span>
                  </div>
                  <QuestionView
                    item={item}
                    categoryId={session.categoryId}
                    chosen={chosen}
                    onChoose={() => {}}
                    reveal="correct"
                    locked
                  />
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  )
}
