import { DIMENSIONS, LEVELS, QUESTION_COUNT } from '../data/assessment.js';
import { bundleBySlug, templateBySlug } from '../data/catalog.js';

// Answers travel in the results link as a 30-digit string, e.g. ?a=3423...
// so a result can be bookmarked or shared and needs no account or storage.
export function encodeAnswers(answers) {
  return answers.map((v) => (v ? String(v) : '0')).join('');
}

export function decodeAnswers(str) {
  if (typeof str !== 'string' || str.length !== QUESTION_COUNT || !/^[1-5]+$/.test(str)) return null;
  return str.split('').map(Number);
}

export function levelFor(score) {
  let found = LEVELS[0];
  for (const l of LEVELS) if (score >= l.min) found = l;
  return found;
}

const round1 = (n) => Math.round(n * 10) / 10;

export function scoreAnswers(answers) {
  const dimensions = DIMENSIONS.map((d, di) => {
    const slice = answers.slice(di * 5, di * 5 + 5);
    const score = round1(slice.reduce((a, b) => a + b, 0) / slice.length);
    return { ...d, score, level: levelFor(score) };
  });
  const overall = round1(answers.reduce((a, b) => a + b, 0) / answers.length);
  const level = levelFor(overall);
  // Weakest two dimensions get specific template picks.
  const focus = [...dimensions].sort((a, b) => a.score - b.score).slice(0, 2);
  const picks = focus.map((d) => ({ dimension: d, templates: d.recommends.map(templateBySlug).filter(Boolean) }));
  const bundle = bundleBySlug(level.bundle);
  return { dimensions, overall, level, focus, picks, bundle };
}
