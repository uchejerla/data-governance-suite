import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { decodeAnswers, encodeAnswers, scoreAnswers } from '../lib/scoring.js';
import { LEVELS } from '../data/assessment.js';
import { bundleTemplates, bundleListPrice, formatPrice, isBuyable, templateBuyable } from '../data/catalog.js';
import RadarChart from '../components/RadarChart.jsx';
import TemplateCard from '../components/TemplateCard.jsx';

// The PDF library is only loaded when someone asks for the report.
async function saveReport(answers) {
  const { downloadReport } = await import('../lib/reportPdf.js');
  const inArtifact = import.meta.env.VITE_ROUTER === 'memory';
  const resultsUrl = inArtifact || typeof window === 'undefined'
    ? ''
    : `${window.location.origin}/assessment/results?a=${encodeAnswers(answers)}`;
  downloadReport(answers, { resultsUrl });
}

export default function AssessmentResults() {
  const [params] = useSearchParams();
  const answers = decodeAnswers(params.get('a'));
  const [pdfState, setPdfState] = useState('idle');

  if (!answers) {
    return (
      <div className="wrap page narrow">
        <h1>No results to show</h1>
        <p className="lede">This results link is incomplete. Take the assessment to get your score.</p>
        <div className="cta-row"><Link className="btn" to="/assessment">Take the assessment</Link></div>
      </div>
    );
  }

  const r = scoreAnswers(answers);
  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">Your results</p>
        <h1>Level {r.level.level}: {r.level.name}</h1>
        <p className="lede">{r.level.summary}</p>
        <div className="cta-row">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={pdfState === 'working'}
            onClick={async () => {
              setPdfState('working');
              try { await saveReport(answers); setPdfState('done'); } catch (e) { console.error(e); setPdfState('error'); }
            }}
          >
            {pdfState === 'working' ? 'Preparing your report...' : 'Download report (PDF)'}
          </button>
          {pdfState === 'done' && <span className="muted">Saved. Check your downloads.</span>}
          {pdfState === 'error' && <span className="muted">The report could not be made in this browser. Bookmark this page instead.</span>}
        </div>
      </header>

      <div className="results-grid">
        <div className="panel">
          <RadarChart dimensions={r.dimensions} />
        </div>
        <div className="panel">
          <p className="overall"><span className="overall-num">{r.overall.toFixed(1)}</span><span className="muted"> out of 5 overall</span></p>
          <ul className="dim-bars">
            {r.dimensions.map((d) => (
              <li key={d.id} className={r.focus.some((f) => f.id === d.id) ? 'focus' : ''}>
                <span className="dim-name">{d.name}</span>
                <span className="bar"><span style={{ width: `${(d.score / 5) * 100}%` }} /></span>
                <span className="dim-score">{d.score.toFixed(1)}</span>
              </li>
            ))}
          </ul>
          <p className="muted">Highlighted: your two lowest dimensions.</p>
        </div>
      </div>

      <section className="rec-bundle">
        <div>
          <p className="eyebrow">Recommended for Level {r.level.level}</p>
          <h2>{r.bundle.name}</h2>
          <p>{r.bundle.summary} {bundleTemplates(r.bundle).length} templates for {formatPrice(r.bundle.price)} <span className="muted">(list {formatPrice(bundleListPrice(r.bundle))})</span>.</p>
        </div>
        <div className="cta-row">
          <Link className="btn btn-lg" to={`/bundles/${r.bundle.slug}`}>{isBuyable({ kind: 'bundle', item: r.bundle }) ? 'Get template bundle' : 'See the bundle (coming soon)'}</Link>
        </div>
      </section>

      {!isBuyable({ kind: 'bundle', item: r.bundle }) && bundleTemplates(r.bundle).some(templateBuyable) && (
        <section className="tier-block">
          <div className="tier-block-head"><h2>Available now from this bundle</h2></div>
          <div className="card-grid">
            {bundleTemplates(r.bundle).filter(templateBuyable).map((t) => <TemplateCard key={t.slug} template={t} />)}
          </div>
        </section>
      )}

      {r.picks.map(({ dimension, templates }) => (
        <section key={dimension.id} className="tier-block">
          <div className="tier-block-head">
            <h2>To raise {dimension.name} ({dimension.score.toFixed(1)})</h2>
          </div>
          <div className="card-grid">
            {templates.map((t) => <TemplateCard key={t.slug} template={t} />)}
          </div>
        </section>
      ))}

      <section className="tier-block">
        <h2 className="h-sm">All five levels</h2>
        <ol className="level-list">
          {LEVELS.map((l) => (
            <li key={l.level} className={l.level === r.level.level ? 'current' : ''}>
              <strong>Level {l.level}, {l.name}.</strong> {l.summary}
            </li>
          ))}
        </ol>
        <div className="cta-row">
          <Link className="btn btn-ghost" to="/assessment">Retake the assessment</Link>
          <Link className="btn btn-ghost" to="/templates">Browse all templates</Link>
        </div>
        <p className="muted">Bookmark this page to keep your results. They are saved in the link, not on our servers.</p>
      </section>
    </div>
  );
}
