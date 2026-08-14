import { runProgress } from '../lib/exam'
import { useBackGuard } from '../lib/backGuard'

/**
 * Asked before a practice run that already has saved progress is started again.
 * Every entry point (topic picker, "Všechny otázky", "Jen moje chyby", the
 * result screen's retry) goes through `start()`, so this one dialog is the only
 * thing standing between the user and silently thrown-away work.
 */
export default function ResumeDialog({ run, label, onResume, onRestart, onCancel }) {
  const { answered, total } = runProgress(run)
  useBackGuard(true, onCancel)

  return (
    <div className="scrim scrim--center" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Pokračovat, nebo začít znovu?</h2>
        <p>
          {label} – rozpracováno {answered} z {total} otázek.
        </p>
        <div className="dialog__actions">
          <button className="btn btn--soft" onClick={onRestart}>
            Začít znovu
          </button>
          <button className="btn btn--go" onClick={onResume}>
            Pokračovat
          </button>
        </div>
      </div>
    </div>
  )
}
