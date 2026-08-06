import { topicIcon, topicLabel } from '../topics'

const LETTERS = ['a', 'b', 'c', 'd', 'e']

export const imgUrl = (name) => `${import.meta.env.BASE_URL}img/${name}`

function Figures({ names, alt }) {
  if (!names?.length) return null
  return (
    <div className="figures">
      {names.map((n) => (
        <img key={n} src={imgUrl(n)} alt={alt} loading="lazy" />
      ))}
    </div>
  )
}

/**
 * One question with its options.
 *
 * `reveal` decides how much is shown: 'none' keeps everything neutral,
 * 'correct' marks the right option, and once an answer is picked a wrong pick
 * is marked too.
 */
export default function QuestionView({
  item,
  categoryId,
  chosen,
  onChoose,
  reveal = 'none',
  locked = false,
}) {
  const { q, order, correctIdx } = item
  const revealing = reveal === 'correct'

  return (
    <div className="question">
      <div className="question__meta">
        <span className="chip chip--num">otázka č. {q.n}</span>
        <span className="chip">
          <span aria-hidden="true">{topicIcon(q.topic)}</span>{' '}
          {topicLabel(categoryId, q.topic)}
        </span>
      </div>

      <h2 className="question__text">{q.t}</h2>
      <Figures names={q.img} alt="Obrázek k otázce" />

      <ul className="options-list">
        {order.map((srcIdx, i) => {
          const ans = q.a[srcIdx]
          const isChosen = chosen === i
          const isCorrect = i === correctIdx
          const cls = [
            'answer',
            isChosen && 'is-chosen',
            revealing && isCorrect && 'is-correct',
            revealing && isChosen && !isCorrect && 'is-wrong',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={i}>
              <button
                type="button"
                className={cls}
                onClick={() => !locked && onChoose(i)}
                aria-pressed={isChosen}
                disabled={locked && !isChosen && !revealing}
              >
                <span className="answer__letter">{LETTERS[i]}</span>
                <span className="answer__body">
                  {ans.t && <span className="answer__text">{ans.t}</span>}
                  <Figures names={ans.img} alt={`Možnost ${LETTERS[i]}`} />
                </span>
                {revealing && (
                  <span className="answer__mark" aria-hidden="true">
                    {isCorrect ? '✓' : isChosen ? '✕' : ''}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
