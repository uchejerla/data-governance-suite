// Builds the downloadable maturity report as a PDF, entirely in the browser.
// Nothing is sent anywhere: the PDF is made from the answers in the results link.
import { jsPDF } from 'jspdf';
import { DIMENSIONS, LEVELS, SCALE } from '../data/assessment.js';
import { bundleTemplates, formatPrice, tierById } from '../data/catalog.js';
import { encodeAnswers, scoreAnswers } from './scoring.js';

// Next steps by overall level. DRAFTED for launch; Uday to review.
const PLAN = {
  1: [
    ['Days 1 to 30', 'Name an executive sponsor and a program lead. Draft a one-page charter: scope, goals and the first two data domains.'],
    ['Days 31 to 60', 'Build a business case from two or three problems leadership already feels. Agree funding for a small core team.'],
    ['Days 61 to 90', 'Name owners and stewards for the first domains and hold the first council meeting with a decision on the agenda.'],
  ],
  2: [
    ['Days 1 to 30', 'Write down what already happens: who decides what, which teams do governance work and where it stalls.'],
    ['Days 31 to 60', 'Choose an operating model and agree decision rights. Give stewards written responsibilities and protected time.'],
    ['Days 61 to 90', 'Approve a charter and a first governance policy. Start a monthly council with a tracked decision log.'],
  ],
  3: [
    ['Days 1 to 30', 'Get core policies approved with owners and review dates. Set up an exception process.'],
    ['Days 31 to 60', 'Stand up the business glossary: approve the first 50 terms that appear in executive and regulatory reports.'],
    ['Days 61 to 90', 'Give stewards a playbook and document quality rules for critical data elements in one domain.'],
  ],
  4: [
    ['Days 1 to 30', 'Agree five to eight governance KPIs with targets and owners, and where each number comes from.'],
    ['Days 31 to 60', 'Build a quality scorecard for critical data elements and report it to data owners monthly.'],
    ['Days 61 to 90', 'Quantify benefits delivered so far and present an executive dashboard at the next leadership review.'],
  ],
  5: [
    ['Days 1 to 30', 'Extend governance to AI and machine learning: inventory models and the data they use, with owners.'],
    ['Days 31 to 60', 'Map regulatory obligations to policies, controls and data so evidence is ready before it is asked for.'],
    ['Days 61 to 90', 'Reassess maturity, compare with this report and reset the roadmap for the next year.'],
  ],
};

const ACCENT = [29, 63, 158];
const INK = [28, 33, 43];
const MUTED = [98, 106, 120];
const RULE = [214, 219, 228];
const FOCUS = [162, 98, 12];

// The standard PDF fonts cover Latin-1 only, so keep text to plain characters.
const plain = (s) => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...');

export function buildReport(answers, { date = new Date(), resultsUrl = '' } = {}) {
  const r = scoreAnswers(answers);
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 54;
  const CW = W - M * 2;
  let y = 0;

  const color = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const font = (style, size) => { doc.setFont('helvetica', style); doc.setFontSize(size); };
  const text = (s, x, yy, opts) => doc.text(plain(s), x, yy, opts);
  const para = (s, x, width, size = 10, style = 'normal', c = INK, lead = 1.4) => {
    font(style, size); color(c);
    const lines = doc.splitTextToSize(plain(s), width);
    lines.forEach((ln, i) => doc.text(ln, x, y + i * size * lead));
    y += lines.length * size * lead;
    return lines.length;
  };
  const rule = (yy) => { doc.setDrawColor(...RULE); doc.setLineWidth(0.6); doc.line(M, yy, W - M, yy); };
  const heading = (s) => {
    y += 8;
    font('bold', 13); color(ACCENT); text(s, M, y);
    y += 6; rule(y); y += 16;
  };
  const ensure = (needed) => { if (y + needed > H - 60) { doc.addPage(); y = 64; } };

  // ── Page 1: headline, radar, dimension table ──────────────────────────────
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, W, 92, 'F');
  font('bold', 9); doc.setTextColor(255, 255, 255);
  text('DG TEMPLATE SUITE  |  FREE MATURITY ASSESSMENT', M, 34);
  font('bold', 22); text('Data Governance Maturity Report', M, 64);
  font('normal', 10);
  text(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), W - M, 34, { align: 'right' });

  y = 128;
  font('normal', 10); color(MUTED); text('Overall result', M, y);
  y += 26;
  font('bold', 24); color(INK); text(`Level ${r.level.level}: ${r.level.name}`, M, y);
  font('bold', 24); color(ACCENT); text(`${r.overall.toFixed(1)}`, W - M - 64, y, { align: 'right' });
  font('normal', 10); color(MUTED); text('out of 5', W - M, y, { align: 'right' });
  y += 20;
  para(r.level.summary, M, CW, 11);

  // Radar chart, drawn as vectors so it stays sharp when printed.
  y += 14;
  const cx = M + 128, cy = y + 140, rad = 100;
  const n = r.dimensions.length;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i, v) => [cx + Math.cos(ang(i)) * rad * v / 5, cy + Math.sin(ang(i)) * rad * v / 5];
  doc.setLineWidth(0.6);
  for (let v = 1; v <= 5; v++) {
    doc.setDrawColor(...(v === 5 ? [160, 168, 182] : RULE));
    const pts = r.dimensions.map((_, i) => pt(i, v));
    pts.forEach((p, i) => { const q = pts[(i + 1) % n]; doc.line(p[0], p[1], q[0], q[1]); });
  }
  r.dimensions.forEach((_, i) => { const [x2, y2] = pt(i, 5); doc.setDrawColor(...RULE); doc.line(cx, cy, x2, y2); });
  const shape = r.dimensions.map((d, i) => pt(i, d.score));
  const segs = shape.slice(1).map((p, i) => [p[0] - shape[i][0], p[1] - shape[i][1]]);
  doc.setFillColor(205, 215, 240); doc.setDrawColor(...ACCENT); doc.setLineWidth(1.6);
  doc.lines(segs, shape[0][0], shape[0][1], [1, 1], 'FD', true);
  doc.setFillColor(...ACCENT);
  shape.forEach(([x2, y2]) => doc.circle(x2, y2, 2.6, 'F'));
  r.dimensions.forEach((d, i) => {
    const [lx, ly] = pt(i, 6.15);
    const cos = Math.cos(ang(i));
    const align = Math.abs(cos) < 0.2 ? 'center' : cos > 0 ? 'left' : 'right';
    font('bold', 8.5); color(INK); text(d.short, lx, ly, { align });
    font('normal', 8.5); color(MUTED); text(d.score.toFixed(1), lx, ly + 11, { align });
  });

  // Dimension table to the right of the chart.
  const tx = M + 318, tw = W - M - tx;
  let ty = cy - 112;
  font('bold', 8); color(MUTED);
  text('DIMENSION', tx, ty); text('SCORE', tx + tw, ty, { align: 'right' });
  ty += 8;
  r.dimensions.forEach((d) => {
    const isFocus = r.focus.some((f) => f.id === d.id);
    doc.setDrawColor(...RULE); doc.setLineWidth(0.6); doc.line(tx, ty, tx + tw, ty);
    ty += 15;
    font('bold', 9.5); color(isFocus ? FOCUS : INK); text(d.name, tx, ty);
    font('bold', 9.5); text(d.score.toFixed(1), tx + tw, ty, { align: 'right' });
    ty += 12;
    font('normal', 8); color(MUTED); text(`Level ${d.level.level}, ${d.level.name}${isFocus ? '  |  focus area' : ''}`, tx, ty);
    ty += 9;
  });
  doc.setDrawColor(...RULE); doc.line(tx, ty, tx + tw, ty);

  y = cy + 150;
  heading('How to read this report');
  para('Each dimension is the average of five statements you rated from 1 (not in place) to 5 (optimized). Your overall score is the average of all 30. The two lowest dimensions, shown in amber, are where a small effort will move your program furthest. This is a self-assessment: it reflects how the people who answered see the program today.', M, CW, 9.5, 'normal', MUTED);

  // ── Page 2: focus areas, plan, recommended templates ──────────────────────
  doc.addPage(); y = 64;
  heading('Your two focus areas');
  r.focus.forEach((d) => {
    ensure(120);
    font('bold', 11); color(FOCUS); text(`${d.name}  ${d.score.toFixed(1)} / 5`, M, y);
    y += 15;
    const di = DIMENSIONS.findIndex((x) => x.id === d.id);
    const low = d.questions
      .map((q, qi) => ({ q, v: answers[di * 5 + qi] }))
      .filter((x) => x.v <= 2);
    if (low.length) {
      para('Statements you rated 1 or 2:', M, CW, 9.5, 'normal', MUTED);
      low.forEach(({ q, v }) => { y += 2; const before = y; para(q, M + 14, CW - 14, 9.5); font('normal', 9.5); color(MUTED); text(`${v}`, M, before); });
    } else {
      para('No statement scored below 3 here, but this is still your lowest area relative to the others.', M, CW, 9.5, 'normal', MUTED);
    }
    y += 6;
    const recs = (d.recommends || []).map((s) => ({ s }));
    if (recs.length) {
      para(`Templates that help: ${r.picks.find((p) => p.dimension.id === d.id).templates.map((t) => `${t.name} (${formatPrice(t.price)})`).join('; ')}.`, M, CW, 9.5, 'italic', INK);
    }
    y += 14;
  });

  heading(`Next 90 days for a Level ${r.level.level} program`);
  PLAN[r.level.level].forEach(([when, what]) => {
    ensure(40);
    font('bold', 9.5); color(ACCENT); text(when, M, y);
    para(what, M + 92, CW - 92, 9.5);
    y += 8;
  });

  ensure(110);
  heading(`Recommended bundle: ${r.bundle.name}`);
  const items = bundleTemplates(r.bundle);
  para(`${r.bundle.summary} ${items.length} templates for ${formatPrice(r.bundle.price)}.`, M, CW, 9.5);
  y += 4;
  items.forEach((t) => {
    ensure(16);
    font('normal', 9.5); color(INK); text(`-  ${t.name}`, M + 6, y);
    color(MUTED); text(tierById(t.tier).name, W - M, y, { align: 'right' });
    y += 14;
  });

  // ── Page 3: every answer ──────────────────────────────────────────────────
  doc.addPage(); y = 64;
  heading('Your answers');
  font('normal', 8.5); color(MUTED);
  text(SCALE.map((s) => `${s.value} ${s.label}`).join('   |   '), M, y);
  y += 14;
  DIMENSIONS.forEach((d, di) => {
    ensure(30 + 5 * 22);
    y += 4;
    font('bold', 10); color(INK); text(d.name, M, y);
    font('bold', 10); text(r.dimensions[di].score.toFixed(1), W - M, y, { align: 'right' });
    y += 13;
    d.questions.forEach((q, qi) => {
      const v = answers[di * 5 + qi];
      const label = SCALE.find((s) => s.value === v).label;
      const startY = y;
      para(q, M + 10, CW - 130, 9);
      font('normal', 9); color(v <= 2 ? FOCUS : MUTED);
      text(`${v}  ${label}`, W - M, startY, { align: 'right' });
      y += 3;
    });
    y += 6;
  });

  ensure(80);
  heading('All five levels');
  LEVELS.forEach((l) => {
    ensure(30);
    const cur = l.level === r.level.level;
    font('bold', 9.5); color(cur ? ACCENT : INK); text(`${l.level}  ${l.name}${cur ? '  (you)' : ''}`, M, y);
    para(l.summary, M + 110, CW - 110, 9, 'normal', cur ? INK : MUTED);
    y += 5;
  });

  // Footer on every page.
  const total = doc.getNumberOfPages();
  const code = encodeAnswers(answers);
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setDrawColor(...RULE); doc.setLineWidth(0.6); doc.line(M, H - 44, W - M, H - 44);
    font('normal', 7.5); color(MUTED);
    text(resultsUrl ? `Your results: ${resultsUrl}` : `Answer code: ${code}`, M, H - 30);
    text(`Page ${p} of ${total}`, W - M, H - 30, { align: 'right' });
    text('DG Template Suite free maturity assessment. General guidance, not legal or regulatory advice.', M, H - 20);
  }
  return doc;
}

export function downloadReport(answers, options = {}) {
  const doc = buildReport(answers, options);
  doc.save(`data-governance-maturity-report.pdf`);
}
