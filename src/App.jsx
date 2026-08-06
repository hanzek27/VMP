import { useCallback, useState } from 'react'
import Home from './components/Home'
import Settings from './components/Settings'
import Exam from './components/Exam'
import Result from './components/Result'
import { createSession, isScored, scoreSession, sessionOutcome } from './lib/exam'
import { useHistory, useMissed, useSettings } from './lib/storage'
import { getCategory } from './categories'

export default function App() {
  const [settings, updateSettings, resetSettings] = useSettings()
  const [history, addHistory, clearHistory] = useHistory()
  const [missed, recordMissed, clearMissed] = useMissed()
  const [view, setView] = useState('home')
  const [session, setSession] = useState(null)

  const start = useCallback(
    (categoryId, mode, topic = null) => {
      setSession(
        createSession(categoryId, mode, settings, {
          missedIds: missed[categoryId],
          topic,
        })
      )
      setView('exam')
    },
    [settings, missed]
  )

  const finish = useCallback(
    (finished) => {
      const done = { ...finished, finishedAt: Date.now() }
      setSession(done)
      recordMissed(done.categoryId, sessionOutcome(done))
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
    [addHistory, recordMissed]
  )

  const home = useCallback(() => {
    setSession(null)
    setView('home')
  }, [])

  if (view === 'exam' && session)
    return (
      <Exam
        session={session}
        settings={settings}
        onChange={setSession}
        onFinish={finish}
        onQuit={home}
      />
    )

  if (view === 'result' && session)
    return (
      <Result
        session={session}
        missedCount={missed[session.categoryId]?.length ?? 0}
        onHome={home}
        onRetry={() => start(session.categoryId, session.mode, session.topic)}
        onPracticeMistakes={() => start(session.categoryId, 'mistakes')}
      />
    )

  if (view === 'settings')
    return (
      <Settings
        settings={settings}
        missed={missed}
        onChange={updateSettings}
        onReset={resetSettings}
        onClearMissed={clearMissed}
        onBack={home}
      />
    )

  return (
    <Home
      settings={settings}
      history={history}
      missed={missed}
      onClearHistory={clearHistory}
      onStart={start}
      onSettings={() => setView('settings')}
    />
  )
}
