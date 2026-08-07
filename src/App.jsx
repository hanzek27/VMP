import { useCallback, useState } from 'react'
import Home from './components/Home'
import Settings from './components/Settings'
import Exam from './components/Exam'
import Explainer from './components/Explainer'
import Cheatsheet from './components/Cheatsheet'
import Result from './components/Result'
import UpdateToast from './components/UpdateToast'
import { createSession, isScored, scoreSession, sessionOutcome } from './lib/exam'
import { useHistory, useMissed, useSettings } from './lib/storage'
import { getCategory } from './categories'
import { getCheatsheet } from './data/cheatsheets'

export default function App() {
  const [settings, updateSettings, resetSettings] = useSettings()
  const [history, addHistory, clearHistory] = useHistory()
  const [missed, recordMissed, clearMissed] = useMissed()
  const [view, setView] = useState('home')
  const [session, setSession] = useState(null)
  // the picture explainer is not a session – it has no answers to keep
  const [explaining, setExplaining] = useState(null)
  // nor is a tahák – it holds a sheet id
  const [crib, setCrib] = useState(null)

  const explain = useCallback((categoryId) => {
    setExplaining(categoryId)
    setView('explain')
  }, [])

  const openCrib = useCallback((sheetId) => {
    setCrib(sheetId)
    setView('crib')
  }, [])

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
        onChange={setSession}
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
          setCrib(null)
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
        onClearHistory={clearHistory}
        onStart={start}
        onExplain={explain}
        onCrib={openCrib}
        onSettings={() => setView('settings')}
      />
    )

  return (
    <>
      {screen}
      <UpdateToast />
    </>
  )
}
