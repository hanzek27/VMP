import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import QuestionView, { imgUrl } from './QuestionView'
import Icon from './Icon'
import { getCategory } from '../categories'
import { formatDuration, isScored, plural } from '../lib/exam'
import { useBackGuard } from '../lib/backGuard'
import { topicLabel } from '../topics'

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
  const modeLabel =
    session.mode === 'mistakes'
      ? 'opakování chyb'
      : session.mode === 'topic'
        ? topicLabel(session.categoryId, session.topic)
        : 'procvičování'
  // the topic name reads badly after a verb ("Dokončit Světla a znaky plavidel")
  const finishNoun = session.mode === 'mistakes' ? 'opakování chyb' : 'procvičování'
  const total = session.items.length

  // the current question lives in the session, not in local state: a practice
  // run is saved on every change and has to resume on the question it left off
  const current = Math.min(session.current ?? 0, total - 1)

  /* Every edit goes through here. It reads the session from a ref rather than
   * from the render, so two changes landing in one React batch (a tap that
   * answers *and* advances, say) both survive – the plain `{...session}` version
   * silently kept only the last one. */
  const latest = useRef(session)
  latest.current = session
  const patch = useCallback(
    (fn) => {
      const next = fn(latest.current)
      latest.current = next
      onChange(next)
    },
    [onChange]
  )

  const [navOpen, setNavOpen] = useState(false)
  const [confirm, setConfirm] = useState(null) // 'quit' | 'finish' | null

  // system back: close what is open, and never drop out of a running exam
  // without the same confirmation the ✕ button asks for
  useBackGuard(true, () => setConfirm('quit'))
  useBackGuard(navOpen, () => setNavOpen(false))
  useBackGuard(!!confirm, () => setConfirm(null))

  const finishRef = useRef(onFinish)
  finishRef.current = onFinish
  const timeLeft = useCountdown(session.deadline, () =>
    finishRef.current({ ...session, expired: true })
  )

  const item = session.items[current]
  const chosen = session.answers[current]
  const answeredCount = session.answers.filter((a) => a !== null).length
  // a practice run is only in storage once something has been answered
  const saved = !scored && answeredCount > 0

  // Practice modes always show the outcome – that is the point of them.
  const feedbackOn = !scored || settings.instantFeedback
  const reveal =
    settings.markCorrect || (feedbackOn && chosen !== null) ? 'correct' : 'none'
  const locked = reveal === 'correct' && chosen !== null

  const clamp = (i, n) => Math.min(n - 1, Math.max(0, i))

  const choose = useCallback(
    (i) =>
      patch((s) => {
        const answers = [...s.answers]
        answers[s.current ?? 0] = i
        return { ...s, answers }
      }),
    [patch]
  )

  const toggleFlag = useCallback(
    () =>
      patch((s) => {
        const flags = [...s.flags]
        const c = s.current ?? 0
        flags[c] = !flags[c]
        return { ...s, flags }
      }),
    [patch]
  )

  const setCurrent = useCallback(
    (i) => patch((s) => ({ ...s, current: clamp(i, s.items.length) })),
    [patch]
  )

  const go = useCallback(
    (delta) => patch((s) => ({ ...s, current: clamp((s.current ?? 0) + delta, s.items.length) })),
    [patch]
  )

  // scroll back to the top when the question changes
  const scroller = useRef(null)

  /* ↑/↓ move a cursor over the options. It is *real DOM focus*, not a piece of
   * state: the browser then draws the focus ring, announces the option to a
   * screen reader, and — because the options are real buttons — Enter and Space
   * activate the focused one with no key handling of ours at all. */
  const moveCursor = useCallback((delta) => {
    const list = [...(scroller.current?.querySelectorAll('.answer:not(:disabled)') ?? [])]
    if (!list.length) return
    const at = list.indexOf(document.activeElement)
    const next =
      at === -1 ? (delta > 0 ? 0 : list.length - 1) : (at + delta + list.length) % list.length
    list[next].focus()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return
      // a sheet or a dialog owns the keyboard while it is open
      if (navOpen || confirm) {
        if (e.key === 'Escape') setNavOpen(false)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault() // otherwise the page scrolls under the cursor
        moveCursor(1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveCursor(-1)
      } else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (['1', '2', '3'].includes(e.key)) {
        const i = Number(e.key) - 1
        if (i < item.order.length && !locked) choose(i)
      } else if (e.key.toLowerCase() === 'f') toggleFlag()
      else if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, choose, toggleFlag, moveCursor, item, locked, navOpen, confirm])

  // back to the top when the question changes
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [current])

  // the overview can be hundreds of rows long – open it on the current question
  const currentRow = useRef(null)
  useEffect(() => {
    if (navOpen) currentRow.current?.scrollIntoView({ block: 'center' })
  }, [navOpen])

  // the sidebar is always open, so it follows along instead
  const sideRow = useRef(null)
  useEffect(() => {
    sideRow.current?.scrollIntoView({ block: 'nearest' })
  }, [current])

  const lowTime = timeLeft !== null && timeLeft < 60_000
  const progress = useMemo(
    () => Math.round(((current + 1) / total) * 100),
    [current, total]
  )

  const finishNow = () => onFinish(session)

  return (
    <div className="page page--exam">
      <header className="runhead">
        <button
          className="iconbtn iconbtn--onhead"
          onClick={() => setConfirm('quit')}
          aria-label="Ukončit"
          title="Ukončit"
        >
          <Icon name="close" />
        </button>

        <div className="runhead__mid">
          <span className="runhead__count">
            <strong>{current + 1}</strong>
            <em>/{total}</em>
          </span>
          <span className="runhead__where">
            {cat.id} · {scored ? 'zkouška' : modeLabel}
          </span>
        </div>

        {/* flagging is only meaningful in a scored run, where you come back to it */}
        {scored && (
          <button
            className={`iconbtn iconbtn--onhead ${session.flags[current] ? 'is-flagged' : ''}`}
            onClick={toggleFlag}
            aria-pressed={session.flags[current] ? 'true' : 'false'}
            aria-label={session.flags[current] ? 'Označeno k revizi' : 'Označit k revizi'}
            title={session.flags[current] ? 'Označeno k revizi' : 'Označit k revizi'}
          >
            <Icon name="flag" />
          </button>
        )}

        {session.deadline ? (
          <span className={`timer ${lowTime ? 'is-low' : ''}`}>
            {formatDuration(Math.max(0, timeLeft ?? 0))}
          </span>
        ) : (
          <span className="timer timer--off" title="Časový limit je vypnutý">
            <Icon name="clock" size={18} />
          </span>
        )}
      </header>

      <div className="runbar">
        <div className="runbar__fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Wide screens get the question list as a permanent sidebar instead of
          a sheet you have to open. Both wrappers are `display: contents` on a
          phone, so the layout below 1024 px is exactly the flex column it was. */}
      <div className="exammain">
        <aside className="runside" aria-label="Přehled otázek">
          <QuestionList
            session={session}
            current={current}
            scored={scored}
            rowRef={sideRow}
            className="runside__list"
            onPick={setCurrent}
          />
          <div className="runside__foot">
            <button className="btn btn--soft btn--wide" onClick={() => setConfirm('finish')}>
              {scored ? 'Vyhodnotit test' : `Dokončit ${finishNoun}`}
            </button>
          </div>
        </aside>

        <div className="runcol">
          <main className="container container--narrow exambody" ref={scroller}>
            <QuestionView
              item={item}
              categoryId={session.categoryId}
              chosen={chosen}
              onChoose={choose}
              reveal={reveal}
              locked={locked}
            />

            {/* keyboard is a desktop-only affordance; the handlers are always on */}
            <p className="keyhints">
              <kbd>↑</kbd>
              <kbd>↓</kbd> výběr
              <span>·</span>
              <kbd>Enter</kbd> potvrdit
              <span>·</span>
              <kbd>1</kbd>–<kbd>3</kbd> přímo
              <span>·</span>
              <kbd>←</kbd>
              <kbd>→</kbd> otázka
              {scored && (
                <>
                  <span>·</span>
                  <kbd>F</kbd> označit
                </>
              )}
            </p>
          </main>

          <nav className="runnav">
        <button
          className="iconbtn iconbtn--nav"
          onClick={() => go(-1)}
          disabled={current === 0}
          aria-label="Předchozí otázka"
        >
          <Icon name="back" />
        </button>
        <button className="btn btn--soft runnav__list" onClick={() => setNavOpen(true)}>
          Přehled{scored && ` · ${answeredCount}/${total}`}
        </button>
        {current === total - 1 ? (
          <button className="btn btn--go btn--go--sm" onClick={() => setConfirm('finish')}>
            {scored ? 'Vyhodnotit' : 'Dokončit'}
          </button>
        ) : (
          <button className="btn btn--go btn--go--sm" onClick={() => go(1)}>
            Další
            <Icon name="chevron" size={18} />
          </button>
        )}
          </nav>
        </div>
      </div>

      {navOpen && (
        <div className="scrim" onClick={() => setNavOpen(false)}>
          <div className="panel panel--wide" onClick={(e) => e.stopPropagation()}>
            <div className="panel__head">
              <div>
                <h2>Přehled otázek</h2>
                <p className="panel__sub">
                  {scored
                    ? `zodpovězeno ${answeredCount} z ${total}`
                    : `${total} ${plural(total, 'otázka', 'otázky', 'otázek')}`}
                </p>
              </div>
              <button className="iconbtn" onClick={() => setNavOpen(false)} aria-label="Zavřít">
                <Icon name="close" />
              </button>
            </div>
            <QuestionList
              session={session}
              current={current}
              scored={scored}
              rowRef={currentRow}
              className="panel__scroll"
              onPick={(i) => {
                setCurrent(i)
                setNavOpen(false)
              }}
            />
            <div className="panel__foot">
              <button className="btn btn--go btn--wide" onClick={() => setConfirm('finish')}>
                {scored ? 'Vyhodnotit test' : `Dokončit ${finishNoun}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="scrim scrim--center" onClick={() => setConfirm(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            {confirm === 'quit' ? (
              <>
                <h2>{scored ? 'Ukončit bez vyhodnocení?' : `Ukončit ${finishNoun}?`}</h2>
                <p>
                  {scored
                    ? 'Rozpracovaný test se neuloží.'
                    : saved
                      ? 'Postup se uloží – příště můžeš pokračovat tam, kde jsi skončil.'
                      : 'Zatím není co ukládat.'}
                </p>
                <div className="dialog__actions">
                  <button className="btn btn--soft" onClick={() => setConfirm(null)}>
                    Pokračovat
                  </button>
                  <button
                    className={`btn ${scored ? 'btn--danger' : 'btn--go'}`}
                    onClick={onQuit}
                  >
                    {scored || !saved ? 'Ukončit' : 'Uložit a ukončit'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>{scored ? 'Odevzdat test?' : `Dokončit ${finishNoun}?`}</h2>
                <p>
                  {answeredCount < total
                    ? `Bez odpovědi ${plural(total - answeredCount, 'zůstává', 'zůstávají', 'zůstává')} ` +
                      `${total - answeredCount} z ${total} otázek.`
                    : 'Zodpovězeny jsou všechny otázky.'}
                  {saved && ' Uložený postup se tím smaže.'}
                </p>
                <div className="dialog__actions">
                  <button className="btn btn--soft" onClick={() => setConfirm(null)}>
                    Zpět
                  </button>
                  <button className="btn btn--go" onClick={finishNow}>
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

/**
 * The question list. The overview sheet and the desktop sidebar render the same
 * rows; only the wrapper class and which ref marks the current row differ.
 */
function QuestionList({ session, current, scored, onPick, rowRef, className = '' }) {
  return (
    <ul className={`qlist ${className}`}>
      {session.items.map((it, i) => {
        const a = session.answers[i]
        const cls = [
          'qlist__item',
          i === current && 'is-current',
          a !== null && (scored ? 'is-answered' : a === it.correctIdx ? 'is-ok' : 'is-bad'),
          session.flags[i] && 'is-flagged',
        ]
          .filter(Boolean)
          .join(' ')
        return (
          <li key={i}>
            <button
              ref={i === current ? rowRef : null}
              className={cls}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => onPick(i)}
            >
              <span className="qlist__num">{i + 1}</span>
              {/* many sign questions share identical wording – the thumbnail is
                  what actually tells them apart */}
              {it.q.img?.length ? (
                <img className="qlist__thumb" src={imgUrl(it.q.img[0])} alt="" loading="lazy" />
              ) : null}
              <span className="qlist__text">{it.q.t}</span>
              {session.flags[i] && (
                <Icon name="flag" size={16} className="qlist__flag" title="označeno k revizi" />
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
