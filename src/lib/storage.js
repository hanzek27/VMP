import { useCallback, useEffect, useState } from 'react'
import { packSession } from './exam'

export const DEFAULT_SETTINGS = {
  /** Turn the countdown off entirely (setting #1). */
  noTimeLimit: false,
  /** Mark the correct answer up front, as a study aid (setting #2). */
  markCorrect: false,
  /** Reveal right/wrong as soon as an answer is picked, in every mode. */
  instantFeedback: true,
  shuffleQuestions: true,
  /** The source always lists the correct answer first, so shuffling matters. */
  shuffleAnswers: true,
}

const CATEGORY_KEY = 'vmp.category.v1'
const SETTINGS_KEY = 'vmp.settings.v1'
const HISTORY_KEY = 'vmp.history.v1'
const MISSED_KEY = 'vmp.missed.v1'
const PROGRESS_KEY = 'vmp.progress.v1'
const MASTERED_KEY = 'vmp.mastered.v1'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) – settings just won't persist */
  }
}

/**
 * The category the home screen is showing. The whole screen is one category at
 * a time, so the app has to remember which one — otherwise every visit starts
 * on M and an S candidate re-picks their category forever.
 *
 * Home unmounts while an exam runs, so a plain read on mount is enough to keep
 * this in sync; there is no second copy of the state to reconcile.
 */
export function useCategory(fallback) {
  const [categoryId, setCategoryId] = useState(() => {
    const saved = read(CATEGORY_KEY, null)
    return typeof saved === 'string' ? saved : fallback
  })

  const select = useCallback((id) => {
    setCategoryId(id)
    write(CATEGORY_KEY, id)
  }, [])

  return [categoryId, select]
}

export function useSettings() {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...read(SETTINGS_KEY, {}),
  }))

  useEffect(() => write(SETTINGS_KEY, settings), [settings])

  const update = useCallback(
    (patch) => setSettings((s) => ({ ...s, ...patch })),
    []
  )
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), [])

  return [settings, update, reset]
}

export function useHistory() {
  const [history, setHistory] = useState(() => read(HISTORY_KEY, []))

  const add = useCallback((entry) => {
    setHistory((h) => {
      const next = [entry, ...h].slice(0, 20)
      write(HISTORY_KEY, next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setHistory([])
    write(HISTORY_KEY, [])
  }, [])

  return [history, add, clear]
}

/**
 * Questions answered incorrectly, kept per category as a list of question
 * numbers so it survives a re-scrape of the bank. A question drops off the list
 * as soon as it is answered correctly, in any mode.
 */
export function useMissed() {
  const [missed, setMissed] = useState(() => read(MISSED_KEY, {}))

  const record = useCallback((categoryId, { wrong, right }) => {
    if (!wrong.length && !right.length) return
    setMissed((m) => {
      const ids = new Set(m[categoryId] ?? [])
      wrong.forEach((n) => ids.add(n))
      right.forEach((n) => ids.delete(n))
      const next = { ...m, [categoryId]: [...ids].sort((a, b) => a - b) }
      write(MISSED_KEY, next)
      return next
    })
  }, [])

  const clear = useCallback((categoryId) => {
    setMissed((m) => {
      const next = categoryId ? { ...m, [categoryId]: [] } : {}
      write(MISSED_KEY, next)
      return next
    })
  }, [])

  return [missed, record, clear]
}

/**
 * Topics finished perfectly, per category: `{ [categoryId]: { [topic]: when } }`
 * (`ALL_TOPICS` for a clean whole-bank run). Keyed by topic id, not by index,
 * so a re-scrape cannot shift the badges onto the wrong rows.
 *
 * `masteryUpdate()` in lib/exam.js decides what a finished run proved and
 * disproved; this only writes it down. A topic that gets disproved is deleted
 * rather than set to false — the map stays a list of what is currently clean.
 */
export function useMastered() {
  const [mastered, setMastered] = useState(() => read(MASTERED_KEY, {}))

  const record = useCallback((categoryId, { mastered: won, broken }) => {
    if (!won.length && !broken.length) return
    setMastered((m) => {
      const current = { ...(m[categoryId] ?? {}) }
      for (const topic of broken) delete current[topic]
      for (const topic of won) current[topic] = Date.now()
      const next = { ...m, [categoryId]: current }
      write(MASTERED_KEY, next)
      return next
    })
  }, [])

  return [mastered, record]
}

/**
 * Identity of a practice run. One saved run per category + mode + topic, so
 * yesterday's half-done "Světla a znaky plavidel" is not overwritten by today's
 * "Zvukové signály".
 */
export const progressKey = ({ categoryId, mode, topic }) =>
  `${categoryId}:${mode}:${topic ?? ''}`

/**
 * Unfinished practice runs, so closing the app mid-training is not a loss. Only
 * the practice modes land here – a scored test either gets submitted or is gone,
 * which is what the exam does too. `packSession()` decides what is worth saving;
 * `save` is called on every answer and every page turn, so a killed app loses
 * nothing.
 */
export function useProgress() {
  const [runs, setRuns] = useState(() => read(PROGRESS_KEY, {}))

  const save = useCallback((session) => {
    const run = packSession(session)
    if (!run) return
    setRuns((r) => {
      const next = { ...r, [progressKey(session)]: run }
      write(PROGRESS_KEY, next)
      return next
    })
  }, [])

  const drop = useCallback((key) => {
    setRuns((r) => {
      if (!(key in r)) return r // nothing to write
      const next = { ...r }
      delete next[key]
      write(PROGRESS_KEY, next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setRuns({})
    write(PROGRESS_KEY, {})
  }, [])

  return [runs, save, drop, clear]
}
