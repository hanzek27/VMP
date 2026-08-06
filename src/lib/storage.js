import { useCallback, useEffect, useState } from 'react'

export const DEFAULT_SETTINGS = {
  /** Turn the countdown off entirely (setting #1). */
  noTimeLimit: false,
  /** Mark the correct answer up front, as a study aid (setting #2). */
  markCorrect: false,
  /** Reveal right/wrong as soon as an answer is picked. */
  instantFeedback: false,
  shuffleQuestions: true,
  /** The source always lists the correct answer first, so shuffling matters. */
  shuffleAnswers: true,
}

const SETTINGS_KEY = 'vmp.settings.v1'
const HISTORY_KEY = 'vmp.history.v1'
const MISSED_KEY = 'vmp.missed.v1'

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
