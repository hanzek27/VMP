import { useMemo, useState } from 'react'
import QuestionView from './QuestionView'
import { getCategory, groupLabel } from '../categories'
import { formatDuration, isScored, plural, scoreByGroup, scoreSession } from '../lib/exam'
import { topicLabel } from '../topics'

function Ring({ percent, passed }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <svg className="ring" viewBox="0 0 120 120" role="img" aria-label={`${percent} %`}>
      <circle className="ring__track" cx="60" cy="60" r={r} />
      <circle
        className={`ring__value ${passed ? 'is-pass' : 'is-fail'}`}
        cx="60"
        cy="60"
        r={r}
        strokeDasharray={c}
        strokeDashoffset={c - (c * percent) / 100}
      />
      <text className="ring__label" x="60" y="66">
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
              <p className="resulthead__eyebrow">{cat.name}</p>
              <div className="resulthead__score">
                <Ring percent={score.percent} passed={score.passed} />
                <div>
                  <h1>{score.passed ? 'Prospěl/a' : 'Neprospěl/a'}</h1>
                  <p className="resulthead__big">
                    {score.correct} / {score.total} bodů
                  </p>
                  <p className="resulthead__lead">
                    K úspěchu je potřeba {score.passMark} bodů · čas{' '}
                    {formatDuration(score.elapsedMs)}
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
            className="btn btn--primary"
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
              <span aria-hidden="true">✕</span> Procvičit chyby ({missedCount})
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
            <p className="review__empty">Žádné chyby – všechno správně. 🎉</p>
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
