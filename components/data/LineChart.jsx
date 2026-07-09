import React from 'react';

/**
 * LK ROBOTICS — LineChart
 * Axed multi-series line chart (loss/metric curves, telemetry over time). Each
 * series is {name, color, dashed, points:[{x, y}]}. Renders gridlines, x/y
 * ticks, series polylines, and an optional legend. Pure SVG, token-driven; the
 * data-family line/area complement to BarChart, DonutChart, and Sparkline.
 */
const PALETTE = [
  'var(--color-semantic-primary-normal)',
  'var(--color-semantic-status-positive)',
  'var(--color-semantic-status-cautionary)',
  'var(--color-semantic-accent-foreground-violet)',
];

export function LineChart({
  series = [],
  width = 520,
  height = 240,
  xLabel,
  yLabel,
  yTicks = 4,
  showLegend = true,
  formatX,
  formatY,
  style,
  ...rest
}) {
  const pad = { top: 12, right: 16, bottom: 28, left: 40 };
  const iw = Math.max(1, width - pad.left - pad.right);
  const ih = Math.max(1, height - pad.top - pad.bottom);
  const all = series.flatMap((s) => s.points || []);
  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const xMin = xs.length ? Math.min(...xs) : 0;
  const xMax = xs.length ? Math.max(...xs) : 1;
  const yMin = ys.length ? Math.min(0, Math.min(...ys)) : 0;
  const yMax = ys.length ? Math.max(...ys) : 1;
  const sx = (x) => pad.left + (xMax === xMin ? 0.5 : (x - xMin) / (xMax - xMin)) * iw;
  const sy = (y) => pad.top + ih - (yMax === yMin ? 0 : (y - yMin) / (yMax - yMin)) * ih;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / yTicks);
  const fx = formatX || ((v) => `${v}`);
  const fy = formatY || ((v) => (Math.abs(v) >= 100 ? Math.round(v) : Math.round(v * 100) / 100));

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', fontFamily: 'var(--font-sans)', width: 'fit-content', ...style }} {...rest}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={yLabel ? `${yLabel} 라인 차트` : '라인 차트'} style={{ display: 'block', maxWidth: '100%', overflow: 'visible' }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.left} y1={sy(t)} x2={pad.left + iw} y2={sy(t)} stroke="var(--color-semantic-line-normal-alternative)" strokeWidth="1" />
            <text x={pad.left - 6} y={sy(t) + 3} textAnchor="end" fontSize="10" fill="var(--color-semantic-label-assistive)" style={{ fontVariantNumeric: 'tabular-nums' }}>{fy(t)}</text>
          </g>
        ))}
        <line x1={pad.left} y1={pad.top + ih} x2={pad.left + iw} y2={pad.top + ih} stroke="var(--color-semantic-line-normal-normal)" strokeWidth="1" />
        {[xMin, xMax].map((x, i) => (
          <text key={i} x={sx(x)} y={height - 8} textAnchor={i === 0 ? 'start' : 'end'} fontSize="10" fill="var(--color-semantic-label-assistive)" style={{ fontVariantNumeric: 'tabular-nums' }}>{fx(x)}</text>
        ))}
        {yLabel && <text x={12} y={pad.top + ih / 2} transform={`rotate(-90 12 ${pad.top + ih / 2})`} textAnchor="middle" fontSize="10" fontWeight="var(--fw-semibold)" fill="var(--color-semantic-label-alternative)">{yLabel}</text>}
        {series.map((s, i) => {
          const color = s.color || PALETTE[i % PALETTE.length];
          const pts = (s.points || []).map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ');
          return <polyline key={s.name || i} points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? '5 4' : undefined} />;
        })}
      </svg>
      {showLegend && series.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', paddingLeft: pad.left }}>
          {series.map((s, i) => (
            <span key={s.name || i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-semantic-label-neutral)' }}>
              <span aria-hidden="true" style={{ width: 14, height: 0, borderTop: `2px ${s.dashed ? 'dashed' : 'solid'} ${s.color || PALETTE[i % PALETTE.length]}` }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
      {xLabel && <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--color-semantic-label-alternative)' }}>{xLabel}</div>}
    </div>
  );
}
