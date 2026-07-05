import React from 'react';

const PALETTE = ['var(--lk-accent-ink)', 'var(--bw-blue)', 'var(--bw-amber)', 'var(--bw-green)', 'var(--bw-red)', 'var(--bw-gray-300)'];

/**
 * LK ROBOTICS — DonutChart
 * A ring chart from `segments` ({ value, label, color }) with a centered total
 * and a side legend. Muted, cool palette by default.
 */
export function DonutChart({ segments = [], size = 140, thickness = 18, showTotal = true, centerLabel, legend = true, style, ...rest }) {
  const total = segments.reduce((s, x) => s + (x.value || 0), 0) || 1;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, ...style }} {...rest}>
      <span style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--fill-strong)" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const dash = ((s.value || 0) / total) * circ;
            const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color || PALETTE[i % PALETTE.length]} strokeWidth={thickness} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} />;
            offset += dash;
            return el;
          })}
        </svg>
        {(showTotal || centerLabel != null) && (
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: size * 0.2, fontWeight: 'var(--fw-extra)', color: 'var(--label-normal)', fontVariantNumeric: 'tabular-nums' }}>{centerLabel != null ? centerLabel : total}</span>
        )}
      </span>
      {legend && segments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {segments.map((s, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--label-neutral)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color || PALETTE[i % PALETTE.length] }} />
              {s.label}
              <b style={{ marginLeft: 2, color: 'var(--label-normal)' }}>{Math.round((s.value / total) * 100)}%</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
