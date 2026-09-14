import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TopUtilityBar } from '../../components/layout/TopUtilityBar'
import { graduationQuestions } from '../../content/prerequisites/graduationQuiz'
import { allPrereqUnitsComplete, prereqCompletionCount } from '../../lib/prerequisiteProgress'
import { prerequisiteUnits } from '../../content/prerequisites/units'

export function PrerequisiteGraduationPage() {
  const unitIds = prerequisiteUnits.map((u) => u.id)
  const { done, total } = prereqCompletionCount(prerequisiteUnits.length, unitIds)
  const ready = allPrereqUnitsComplete(unitIds)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    let correct = 0
    for (const q of graduationQuestions) {
      if (answers[q.id] === q.correctIndex) correct += 1
    }
    return correct
  }, [answers])

  const pct = Math.round((score / graduationQuestions.length) * 100)

  function pick(qid: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [qid]: idx }))
    setSubmitted(false)
  }

  return (
    <div className="workspace-page prereq-graduation-page">
      <TopUtilityBar
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Prerequisites', to: '/prerequisites' },
          { label: 'Graduation quiz' },
        ]}
      />

      <header className="prereq-unit-header">
        <Link to="/prerequisites" className="back-to-course">← Back to prerequisites hub</Link>
        <h1>Prerequisites graduation</h1>
        <p className="subtitle">
          Self-check before Phase 1. Units completed: <strong>{done}</strong> / {total}.
          {ready ? ' You unlocked the quiz.' : ' Finish all units to mark yourself ready.'}
        </p>
      </header>

      {!ready ? (
        <div className="grad-locked panel-surface">
          <h2>Quiz locked</h2>
          <p className="muted">
            Mark all {total} prerequisite units complete on their unit pages before taking the graduation quiz.
            Progress: <strong>{done}</strong> / {total}.
          </p>
          <Link to="/prerequisites" className="primary">Back to prerequisite units</Link>
        </div>
      ) : (
      <form
        className="grad-quiz"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        {graduationQuestions.map((q, qi) => (
          <fieldset key={q.id} className="grad-question panel-surface">
            <legend>{qi + 1}. {q.prompt}</legend>
            <ul className="grad-choices">
              {q.choices.map((choice, ci) => {
                const selected = answers[q.id] === ci
                const showResult = submitted
                const correct = ci === q.correctIndex
                let cls = 'grad-choice'
                if (showResult && selected && correct) cls += ' correct'
                if (showResult && selected && !correct) cls += ' wrong'
                if (showResult && !selected && correct) cls += ' reveal-correct'
                return (
                  <li key={ci}>
                    <button type="button" className={cls} onClick={() => pick(q.id, ci)}>
                      {choice}
                    </button>
                  </li>
                )
              })}
            </ul>
            {submitted ? <p className="grad-explain muted">{q.explain}</p> : null}
          </fieldset>
        ))}

        <button type="submit" className="primary grad-submit">Check answers</button>
      </form>
      )}

      {ready && submitted ? (
        <div className="grad-score-card panel-surface">
          <p>
            Score: <strong>{score}</strong> / {graduationQuestions.length} ({pct}%)
          </p>
          {pct >= 75 ? (
            <Link to="/chapter/bigram-language-model" className="primary prereq-graduate-btn">
              Enter Chapter 1 →
            </Link>
          ) : (
            <p className="muted">Review units and try again — aim for 75%+.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
