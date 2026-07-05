import React from 'react';

/**
 * LK ROBOTICS — BarChart
 * Simple vertical bars from `data` ({ label, value, color? }). Signal-ink bars
 * on a shared max scale, with value + label. For compact comparisons.
 */
export function BarChart({ data = [], height = 160, gap = 12, showValue = true, color = 'var(--lk-accent-ink)', style, ...rest }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap, height, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
          {showValue && <span style={{ fontSize: 12, fontWeight: 'var(--fw-bold)', color: 'var(--label-neutral)', fontVariantNumeric: 'tabular-nums' }}>{d.value}</span>}
          <div style={{ width: '100%', maxWidth: 48, height: `${(d.value / max) * 100}%`, minHeight: 2, background: d.color || color, borderRadius: 'var(--radius-md) var(--radius-md) 0 0', transition: 'height var(--dur-slow) var(--ease-out)' }} />
          <span style={{ fontSize: 12, color: 'var(--label-alternative)', whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
