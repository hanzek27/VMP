import { useEffect, useRef } from 'react'

/* Installed on a phone there is no browser chrome, so the system back button /
 * back gesture is the only "back" the user has – and with a single history
 * entry it closes the whole app, mid-exam. Every screen and sheet that can be
 * closed therefore claims a history entry and closes itself when that entry is
 * popped.
 *
 * The entries are anonymous: what is reconciled is their *count*. A commit that
 * unmounts three guards and mounts one nets out to two `history.back()` calls,
 * so screens can swap without caring which cleanup ran first. */

const stack = [] // active guards, innermost last
let owned = 0 // history entries we have pushed
let selfPops = 0 // pops we caused ourselves, to be ignored when they arrive
let scheduled = false
let listening = false

function sync() {
  if (scheduled) return
  scheduled = true
  // after React has flushed the whole commit, not in the middle of it
  queueMicrotask(() => {
    scheduled = false
    while (owned < stack.length) {
      owned++
      window.history.pushState({ vmpGuard: owned }, '')
    }
    while (owned > stack.length) {
      owned--
      selfPops++
      window.history.back()
    }
  })
}

function handlePop() {
  if (selfPops > 0) {
    selfPops--
    return
  }
  owned = Math.max(0, owned - 1)
  const guard = stack[stack.length - 1]
  if (!guard) return // nothing of ours left – the user is leaving the app
  // whatever this closes unmounts its guard, and sync() balances out; if the
  // handler leaves it open (the exam asks before quitting) the entry is
  // re-pushed on the next commit instead
  guard.onBack()
}

export function useBackGuard(active, onBack) {
  const handler = useRef(onBack)
  handler.current = onBack

  useEffect(() => {
    if (!active) return
    if (!listening) {
      window.addEventListener('popstate', handlePop)
      listening = true
    }

    const guard = { onBack: () => handler.current() }
    stack.push(guard)
    sync()

    return () => {
      const i = stack.indexOf(guard)
      if (i !== -1) stack.splice(i, 1)
      sync()
    }
  }, [active])
}
