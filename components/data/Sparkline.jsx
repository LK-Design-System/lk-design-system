import React from 'react';

/**
 * LK ROBOTICS — Sparkline
 * A tiny inline trend chart from a number array — signal-ink stroke with a soft
 * area fill. No axes; for compact stat rows.
 */
export function Sparkline({ data = [], width = 120, height = 32, color = 'var(--lk-accent-ink)', fill = true, strokeWidth = 2, style, ...rest }) {
  if (!data.length) return <svg width={width} height={height} style={style} {...rest} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1 || 1)) * width, height - ((d - min) / range) * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', ...style }} {...rest}>
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
