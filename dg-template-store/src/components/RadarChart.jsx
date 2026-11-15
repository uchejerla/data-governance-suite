// Dependency-free SVG radar chart for six dimensions on a 1–5 scale.
export default function RadarChart({ dimensions, size = 360 }) {
  const n = dimensions.length;
  const pad = 70;
  const vb = size + pad * 2;
  const c = vb / 2;
  const r = size / 2;
  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  // Scale: value 0 at center, 5 at the rim.
  const pt = (i, v) => [c + Math.cos(angle(i)) * (r * v) / 5, c + Math.sin(angle(i)) * (r * v) / 5];
  const ring = (v) => dimensions.map((_, i) => pt(i, v).join(',')).join(' ');
  const shape = dimensions.map((d, i) => pt(i, d.score).join(',')).join(' ');

  return (
    <svg className="radar" viewBox={`0 0 ${vb} ${vb}`} role="img" aria-label="Radar chart of maturity scores by dimension">
      {[1, 2, 3, 4, 5].map((v) => (
        <polygon key={v} points={ring(v)} className={v === 5 ? 'radar-rim' : 'radar-ring'} />
      ))}
      {dimensions.map((_, i) => {
        const [x, y] = pt(i, 5);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} className="radar-spoke" />;
      })}
      {[1, 2, 3, 4, 5].map((v) => (
        <text key={v} x={c + 4} y={c - (r * v) / 5 + 4} className="radar-tick">{v}</text>
      ))}
      <polygon points={shape} className="radar-shape" />
      {dimensions.map((d, i) => {
        const [x, y] = pt(i, d.score);
        return <circle key={d.id} cx={x} cy={y} r="5" className="radar-dot" />;
      })}
      {dimensions.map((d, i) => {
        const [x, y] = pt(i, 5.75);
        const cos = Math.cos(angle(i));
        const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
        return (
          <text key={d.id} x={x} y={y} textAnchor={anchor} className="radar-label">
            <tspan x={x} dy="0">{d.short}</tspan>
            <tspan x={x} dy="18" className="radar-val">{d.score.toFixed(1)}</tspan>
          </text>
        );
      })}
    </svg>
  );
}
