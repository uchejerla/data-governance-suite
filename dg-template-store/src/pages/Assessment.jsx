import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DIMENSIONS, SCALE, QUESTION_COUNT, LEVELS } from '../data/assessment.js';
import { encodeAnswers } from '../lib/scoring.js';

const KEY = 'dg-assessment-draft';
const load = () => {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY));
    if (Array.isArray(v) && v.length === QUESTION_COUNT) return v;
  } catch { /* storage unavailable */ }
  return Array(QUESTION_COUNT).fill(null);
};

export default function Assessment() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => Array(QUESTION_COUNT).fill(null));

  useEffect(() => { setAnswers(load()); }, []);
  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  const answered = answers.filter(Boolean).length;
  const dim = DIMENSIONS[step];
  const base = step * 5;
  const stepDone = answers.slice(base, base + 5).every(Boolean);
  const isLast = step === DIMENSIONS.length - 1;

  const setAnswer = (i, v) => setAnswers((a) => a.map((x, j) => (j === i ? v : x)));
  const next = () => {
    if (isLast) {
      try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
      navigate(`/assessment/results?a=${encodeAnswers(answers)}`);
    } else {
      setStep(step + 1);
      if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }
  };

  if (!started) {
    return (
      <div className="wrap page narrow">
        <header className="page-head">
          <p className="eyebrow">Free tool</p>
          <h1>Data Governance Maturity Assessment</h1>
          <p className="lede">
            {QUESTION_COUNT} statements across {DIMENSIONS.length} dimensions. Rate how true each is for your organization today.
            You get a score for each dimension, a radar chart, your maturity level and the templates that would help most.
          </p>
        </header>
        <ul className="dim-list">
          {DIMENSIONS.map((d, i) => (
            <li key={d.id}><span className="step-num">{i + 1}</span>{d.name}</li>
          ))}
        </ul>
        <p className="muted">About 8 minutes. No sign-up. Answers stay in your browser.</p>
        <div className="cta-row">
          <button type="button" className="btn btn-lg" onClick={() => setStarted(true)}>
            {answered > 0 ? `Continue (${answered} of ${QUESTION_COUNT} answered)` : 'Start the assessment'}
          </button>
        </div>
        <h2 className="h-sm">The five levels</h2>
        <ol className="level-list">
          {LEVELS.map((l) => <li key={l.level}><strong>Level {l.level}, {l.name}.</strong> {l.summary}</li>)}
        </ol>
      </div>
    );
  }

  return (
    <div className="wrap page narrow">
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTION_COUNT} aria-valuenow={answered} aria-label="Questions answered">
        <span style={{ width: `${(answered / QUESTION_COUNT) * 100}%` }} />
      </div>
      <p className="muted progress-label">Section {step + 1} of {DIMENSIONS.length} · {answered} of {QUESTION_COUNT} answered</p>
      <h1 className="h-md">{dim.name}</h1>

      <ol className="questions" start={base + 1}>
        {dim.questions.map((q, qi) => {
          const idx = base + qi;
          return (
            <li key={idx} className="question">
              <fieldset>
                <legend>{q}</legend>
                <div className="scale">
                  {SCALE.map((s) => {
                    const id = `q${idx}-${s.value}`;
                    return (
                      <label key={s.value} htmlFor={id} className={`scale-opt${answers[idx] === s.value ? ' on' : ''}`} title={s.hint}>
                        <input id={id} type="radio" name={`q${idx}`} value={s.value} checked={answers[idx] === s.value} onChange={() => setAnswer(idx, s.value)} />
                        <span className="scale-num">{s.value}</span>
                        <span className="scale-lbl">{s.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="cta-row step-nav">
        <button type="button" className="btn btn-ghost" onClick={() => (step === 0 ? setStarted(false) : setStep(step - 1))}>Back</button>
        <button type="button" className="btn" disabled={!stepDone} onClick={next}>
          {isLast ? 'See my results' : `Next: ${DIMENSIONS[step + 1].name}`}
        </button>
      </div>
      {!stepDone && <p className="muted">Answer all five to continue.</p>}
      <p className="muted"><Link to="/templates">Browse templates instead</Link></p>
    </div>
  );
}
