import { useCallback, useState } from 'react'
import Home from './components/Home'
import Settings from './components/Settings'
import Exam from './components/Exam'
import Explainer from './components/Explainer'
import Cheatsheet from './components/Cheatsheet'
import Result from './components/Result'
import ResumeDialog from './components/ResumeDialog'
import UpdateToast from './components/UpdateToast'
import {
  createSession,
  isScored,
  scoreSession,
  sessionOutcome,
  unpackSession,
} from './lib/exam'
import { progressKey, useHistory, useMissed, useProgress, useSettings } from './lib/storage'
import { getCategory, runLabel } from './categories'
import { getCheatsheet } from './data/cheatsheets'

export default function App() {
  const [settings, updateSettings, resetSettings] = useSettings()
  const [history, addHistory, clearHistory] = useHistory()
  const [missed, recordMissed, clearMissed] = useMissed()
  const [runs, saveProgress, dropProgress] = useProgress()
  const [view, setView] = useState('home')
  const [session, setSession] = useState(null)
  // the picture explainer is not a session – it has no answers to keep
  const [explaining, setExplaining] = useState(null)
  // nor is a tahák – it holds a sheet id
  const [crib, setCrib] = useState(null)
  // a practice run the user asked to start that already has saved progress
  const [pending, setPending] = useState(null)

  const explain = useCallback((categoryId) => {
    setExplaining(categoryId)
    setView('explain')
  }, [])

  const openCrib = useCallback((sheetId) => {
    setCrib(sheetId)
    setView('crib')
  }, [])

  /** Every answer and every page turn of a practice run is written straight to
   *  storage, so a killed app or a closed tab loses nothing. */
  const change = useCallback(
    (next) => {
      setSession(next)
      if (!isScored(next.mode)) saveProgress(next)
    },
    [saveProgress]
  )

  const fresh = useCallback(
    (categoryId, mode, topic) => {
      const key = progressKey({ categoryId, mode, topic })
      dropProgress(key)
      setPending(null)
      setSession(
        createSession(categoryId, mode, settings, {
          missedIds: missed[categoryId],
          topic,
        })
      )
      setView('exam')
    },
    [settings, missed, dropProgress]
  )

  const resume = useCallback(
    (key) => {
      const restored = unpackSession(runs[key])
      setPending(null)
      if (!restored) {
        // the bank moved under it – drop the run rather than half-restore it
        dropProgress(key)
        return
      }
      setSession(restored)
      setView('exam')
    },
    [runs, dropProgress]
  )

  /** Starting a practice run that is already half-done asks first – this is the
   *  only path to a new session, so nothing can throw work away silently. */
  const start = useCallback(
    (categoryId, mode, topic = null) => {
      const key = progressKey({ categoryId, mode, topic })
      if (!isScored(mode) && runs[key]) {
        setPending({ categoryId, mode, topic, key })
        return
      }
      fresh(categoryId, mode, topic)
    },
    [runs, fresh]
  )

  const finish = useCallback(
    (finished) => {
      const done = { ...finished, finishedAt: Date.now() }
      setSession(done)
      recordMissed(done.categoryId, sessionOutcome(done))
      // a finished run is not something to come back to
      if (!isScored(done.mode)) dropProgress(progressKey(done))
      if (isScored(done.mode)) {
        const s = scoreSession(done)
        addHistory({
          at: done.finishedAt,
          categoryId: done.categoryId,
          categoryName: getCategory(done.categoryId).name,
          correct: s.correct,
          total: s.total,
          passed: s.passed,
          elapsedMs: s.elapsedMs,
        })
      }
      setView('result')
    },
    [addHistory, recordMissed, dropProgress]
  )

  const home = useCallback(() => {
    setSession(null)
    setExplaining(null)
    setCrib(null)
    setView('home')
  }, [])

  // one screen at a time, plus the update prompt which may appear over any of them
  let screen
  if (view === 'exam' && session)
    screen = (
      <Exam
        session={session}
        settings={settings}
        onChange={change}
        onFinish={finish}
        onQuit={home}
      />
    )
  else if (view === 'result' && session)
    screen = (
      <Result
        session={session}
        missedCount={missed[session.categoryId]?.length ?? 0}
        onHome={home}
        onRetry={() => start(session.categoryId, session.mode, session.topic)}
        onPracticeMistakes={() => start(session.categoryId, 'mistakes')}
      />
    )
  else if (view === 'explain' && explaining)
    screen = <Explainer categoryId={explaining} onBack={home} />
  else if (view === 'crib' && crib)
    screen = (
      <Cheatsheet
        sheetId={crib}
        onBack={home}
        onPractice={() => {
          const s = getCheatsheet(crib)
          // stays on the tahák if `start` needs to ask about saved progress
          start(s.categoryId, 'topic', s.topic)
        }}
      />
    )
  else if (view === 'settings')
    screen = (
      <Settings
        settings={settings}
        missed={missed}
        onChange={updateSettings}
        onReset={resetSettings}
        onClearMissed={clearMissed}
        onBack={home}
      />
    )
  else
    screen = (
      <Home
        settings={settings}
        history={history}
        missed={missed}
        runs={runs}
        onClearHistory={clearHistory}
        onStart={start}
        onResume={resume}
        onDropProgress={dropProgress}
        onExplain={explain}
        onCrib={openCrib}
        onSettings={() => setView('settings')}
      />
    )

  return (
    <>
      {screen}
      {pending && runs[pending.key] && (
        <ResumeDialog
          run={runs[pending.key]}
          label={runLabel(pending)}
          onResume={() => resume(pending.key)}
          onRestart={() => fresh(pending.categoryId, pending.mode, pending.topic)}
          onCancel={() => setPending(null)}
        />
      )}
      <UpdateToast />
    </>
  )
}
