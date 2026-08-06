import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import QuestionView from './QuestionView'
import { getCategory } from '../categories'
import { formatDuration, isScored, plural } from '../lib/exam'

function useCountdown(deadline, onExpire) {
  const [left, setLeft] = useState(() => (deadline ? deadline - Date.now() : null))
  const fired = useRef(false)
  const expire = useRef(onExpire)
  expire.current = onExpire

  useEffect(() => {
    if (!deadline) return
    const tick = () => {
      const remaining = deadline - Date.now()
      setLeft(remaining)
      if (remaining <= 0 && !fired.current) {
        fired.current = true
        expire.current()
      }
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [deadline])

  return left
}

export default function Exam({ session, settings, onChange, onFinish, onQuit }) {
  const cat = getCategory(session.categoryId)
  const scored = isScored(session.mode)
  const modeLabel = session.mode === 'mistakes' ? 'opakování chyb' : 'procvičování'
  const total = session.items.length

  const [current, setCurrent] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const [confirm, setConfirm] = useState(null) // 'quit' | 'finish' | null

  const finishRef = useRef(onFinish)
  finishRef.current = onFinish
  const timeLeft = useCountdown(session.deadline, () =>
    finishRef.current({ ...session, expired: true })
  )

  const item = session.items[current]
  const chosen = session.answers[current]
  const answeredCount = session.answers.filter((a) => a !== null).length

  // Practice modes always show the outcome – that is the point of them.
  const feedbackOn = !scored || settings.instantFeedback
  const reveal =
    settings.markCorrect || (feedbackOn && chosen !== null) ? 'correct' : 'none'
  const locked = reveal === 'correct' && chosen !== null

  const choose = useCallback(
    (i) => {
      const answers = [...session.answers]
      answers[current] = i
      onChange({ ...session, answers })
    },
    [session, current, onChange]
  )

  const toggleFlag = useCallback(() => {
    const flags = [...session.flags]
    flags[current] = !flags[current]
    onChange({ ...session, flags })
  }, [session, current, onChange])

  const go = useCallback(
    (delta) => setCurrent((c) => Math.min(total - 1, Math.max(0, c + delta))),
    [total]
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (['1', '2', '3'].includes(e.key)) {
        const i = Number(e.key) - 1
        if (i < item.order.length && !locked) choose(i)
      } else if (e.key.toLowerCase() === 'f') toggleFlag()
      else if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, choose, toggleFlag, item, locked])

  // scroll back to the top when the question changes
  const scroller = useRef(null)
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [current])

  const lowTime = timeLeft !== null && timeLeft < 60_000
  const progress = useMemo(
    () => Math.round(((current + 1) / total) * 100),
    [current, total]
  )

  const finishNow = () => onFinish(session)

  return (
    <div className="page page--exam">
      <header className="examhead">
        <button className="btn btn--ghost btn--icon" onClick={() => setConfirm('quit')} title="Ukončit">
          <span aria-hidden="true">✕</span>
        </button>

        <div className="examhead__mid">
          <span className="examhead__cat">
            {cat.name} {!scored && <em>· {modeLabel}</em>}
          </span>
          <span className="examhead__count">
            {current + 1} / {total}
          </span>
        </div>

        {session.deadline ? (
          <span className={`timer ${lowTime ? 'is-low' : ''}`}>
            {formatDuration(Math.max(0, timeLeft ?? 0))}
          </span>
        ) : (
          <span className="timer timer--off" title="Časový limit je vypnutý">
            ∞
          </span>
        )}
      </header>

      <div className="progressbar">
        <div className="progressbar__fill" style={{ width: `${progress}%` }} />
      </div>

      <main className="container container--narrow exambody" ref={scroller}>
        <QuestionView
          item={item}
          chosen={chosen}
          onChoose={choose}
          reveal={reveal}
          locked={locked}
        />

        {scored && (
          <button
            className={`btn btn--flag ${session.flags[current] ? 'is-on' : ''}`}
            onClick={toggleFlag}
          >
            <span aria-hidden="true">⚑</span>{' '}
            {session.flags[current] ? 'Označeno k revizi' : 'Označit k revizi'}
          </button>
        )}
      </main>

      <nav className="examnav">
        <button className="btn btn--soft" onClick={() => go(-1)} disabled={current === 0}>
          ← Zpět
        </button>
        <button className="btn btn--ghost" onClick={() => setNavOpen(true)}>
          Přehled{scored && ` (${answeredCount}/${total})`}
        </button>
        {current === total - 1 ? (
          <button className="btn btn--primary" onClick={() => setConfirm('finish')}>
            {scored ? 'Vyhodnotit' : 'Dokončit'}
          </button>
        ) : (
          <button className="btn btn--primary" onClick={() => go(1)}>
            Další →
          </button>
        )}
      </nav>

      {navOpen && (
        <div className="sheet" onClick={() => setNavOpen(false)}>
          <div className="sheet__panel" onClick={(e) => e.stopPropagation()}>
            <div className="sheet__head">
              <h2>Přehled otázek</h2>
              <button className="btn btn--ghost btn--icon" onClick={() => setNavOpen(false)}>
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className="grid">
              {session.items.map((it, i) => {
                const a = session.answers[i]
                const cls = [
                  'grid__cell',
                  i === current && 'is-current',
                  a !== null &&
                    (scored ? 'is-answered' : a === it.correctIdx ? 'is-ok' : 'is-bad'),
                  session.flags[i] && 'is-flagged',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => {
                      setCurrent(i)
                      setNavOpen(false)
                    }}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <button className="btn btn--primary btn--wide" onClick={() => setConfirm('finish')}>
              {scored ? 'Vyhodnotit test' : `Dokončit ${modeLabel}`}
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <div className="sheet sheet--center" onClick={() => setConfirm(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            {confirm === 'quit' ? (
              <>
                <h2>Ukončit bez vyhodnocení?</h2>
                <p>Rozpracovaný {scored ? 'test' : 'trénink'} se neuloží.</p>
                <div className="dialog__actions">
                  <button className="btn btn--soft" onClick={() => setConfirm(null)}>
                    Pokračovat
                  </button>
                  <button className="btn btn--danger" onClick={onQuit}>
                    Ukončit
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>{scored ? 'Odevzdat test?' : `Dokončit ${modeLabel}?`}</h2>
                <p>
                  {answeredCount < total
                    ? `Bez odpovědi ${plural(total - answeredCount, 'zůstává', 'zůstávají', 'zůstává')} ` +
                      `${total - answeredCount} z ${total} otázek.`
                    : 'Zodpovězeny jsou všechny otázky.'}
                </p>
                <div className="dialog__actions">
                  <button className="btn btn--soft" onClick={() => setConfirm(null)}>
                    Zpět
                  </button>
                  <button className="btn btn--primary" onClick={finishNow}>
                    {scored ? 'Odevzdat' : 'Dokončit'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
