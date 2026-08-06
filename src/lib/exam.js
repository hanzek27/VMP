import { getCategory, getQuestions, groupSizes } from '../categories'

/** Fisher–Yates, returns a new array. */
export function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Spread `total` picks across question-sets proportionally to their size, using
 * the largest-remainder method so a generated test mirrors the composition of
 * the official question bank instead of over-weighting whatever gets shuffled
 * to the front. Allocations never exceed the number of questions available.
 */
export function allocate(sizes, total) {
  const entries = [...sizes.entries()]
  const bankTotal = entries.reduce((s, [, n]) => s + n, 0)
  if (total >= bankTotal) return new Map(entries)

  const exact = entries.map(([g, n]) => ({ g, want: (n / bankTotal) * total, cap: n }))
  const alloc = new Map(exact.map((e) => [e.g, Math.min(Math.floor(e.want), e.cap)]))

  let left = total - [...alloc.values()].reduce((s, n) => s + n, 0)
  const byRemainder = [...exact].sort(
    (a, b) => (b.want % 1) - (a.want % 1) || b.cap - a.cap
  )
  // may need several passes once groups hit their cap
  while (left > 0) {
    const before = left
    for (const e of byRemainder) {
      if (left === 0) break
      if (alloc.get(e.g) < e.cap) {
        alloc.set(e.g, alloc.get(e.g) + 1)
        left--
      }
    }
    if (left === before) break // every group is capped
  }
  return alloc
}

/** Pick the questions for one exam attempt, proportionally across question-sets. */
export function drawQuestions(categoryId, count) {
  const all = getQuestions(categoryId)
  const alloc = allocate(groupSizes(categoryId), count)

  const byGroup = new Map()
  for (const q of all) {
    if (!byGroup.has(q.g)) byGroup.set(q.g, [])
    byGroup.get(q.g).push(q)
  }

  const picked = []
  for (const [g, n] of alloc) picked.push(...shuffled(byGroup.get(g)).slice(0, n))
  return shuffled(picked)
}

/** Only a real exam attempt is scored; the practice modes never are. */
export const isScored = (mode) => mode === 'exam'

/** Questions of a category previously answered wrong, in bank order. */
export function missedQuestions(categoryId, missedIds = []) {
  if (!missedIds.length) return []
  const wanted = new Set(missedIds)
  return getQuestions(categoryId).filter((q) => wanted.has(q.n))
}

/** Questions of a category belonging to one thematic topic, in bank order. */
export const topicQuestions = (categoryId, topic) =>
  getQuestions(categoryId).filter((q) => q.topic === topic)

/**
 * Build a runnable session.
 *
 * mode 'exam'     – drawn subset, scored, optional countdown.
 * mode 'learn'    – the whole question bank, never scored, never timed.
 * mode 'mistakes' – only questions previously answered wrong, same rules as 'learn'.
 * mode 'topic'    – only questions of `opts.topic`, same rules as 'learn'.
 */
export function createSession(categoryId, mode, settings, opts = {}) {
  const cat = getCategory(categoryId)
  const { missedIds = [], topic = null } = opts

  let source
  if (mode === 'exam') {
    source = drawQuestions(categoryId, cat.questionCount)
  } else {
    let pool
    if (mode === 'mistakes') pool = missedQuestions(categoryId, missedIds)
    else if (mode === 'topic') pool = topicQuestions(categoryId, topic)
    else pool = getQuestions(categoryId)
    source = settings.shuffleQuestions ? shuffled(pool) : [...pool]
  }

  const items = source.map((q) => {
    const order = settings.shuffleAnswers
      ? shuffled(q.a.map((_, i) => i))
      : q.a.map((_, i) => i)
    return {
      q,
      // options in display order; `correctIdx` points into that display order
      order,
      correctIdx: order.indexOf(q.correct),
    }
  })

  const timed = isScored(mode) && !settings.noTimeLimit
  return {
    categoryId,
    mode,
    topic,
    items,
    answers: new Array(items.length).fill(null),
    flags: new Array(items.length).fill(false),
    startedAt: Date.now(),
    deadline: timed ? Date.now() + cat.timeLimitMin * 60_000 : null,
    finishedAt: null,
  }
}

export function scoreSession(session) {
  const cat = getCategory(session.categoryId)
  const correct = session.items.reduce(
    (s, it, i) => s + (session.answers[i] === it.correctIdx ? 1 : 0),
    0
  )
  const answered = session.answers.filter((a) => a !== null).length
  return {
    correct,
    total: session.items.length,
    answered,
    unanswered: session.items.length - answered,
    passMark: cat.passMark,
    passed: correct >= cat.passMark,
    percent: Math.round((correct / session.items.length) * 100),
    elapsedMs: (session.finishedAt ?? Date.now()) - session.startedAt,
  }
}

/** Per-question-set breakdown for the result screen. */
export function scoreByGroup(session) {
  const map = new Map()
  session.items.forEach((it, i) => {
    const row = map.get(it.q.g) || { total: 0, correct: 0 }
    row.total++
    if (session.answers[i] === it.correctIdx) row.correct++
    map.set(it.q.g, row)
  })
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

/**
 * Which questions this attempt got right and wrong, by question number, so the
 * missed-question list can be updated. Skipped questions are left untouched.
 */
export function sessionOutcome(session) {
  const wrong = []
  const right = []
  session.items.forEach((it, i) => {
    const a = session.answers[i]
    if (a === null) return
    ;(a === it.correctIdx ? right : wrong).push(it.q.n)
  })
  return { wrong, right }
}

/** Czech agreement for counted nouns: 1 / 2–4 / 0 and 5+. */
export const plural = (n, one, few, many) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many)

export function formatDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
