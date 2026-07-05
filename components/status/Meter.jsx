import React from 'react';

/**
 * LK ROBOTICS — Meter
 * A labelled value bar with optional thresholds (배터리, 신호). Without
 * thresholds it uses the signal ink; with `{ low, high }` (percent) it steps
 * red → amber → steel-green.
 */
export function Meter({ value = 0, max = 100, label, thresholds, size = 'md', showValue = true, style, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  let c = 'var(--lk-accent-ink)';
  if (thresholds) {
    if (pct <= thresholds.low) c = 'var(--bw-red)';
    else if (pct <= thresholds.high) c = 'var(--bw-amber)';
    else c = 'var(--bw-green)';
  }
  const h = size === 'sm' ? 6 : 10;
  return (
    <div style={{ ...style }} {...rest}>
      {(label != null || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 'var(--fw-semibold)', color: 'var(--label-neutral)' }}>
          <span>{label}</span>
          {showValue && <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--label-alternative)' }}>{value}/{max}</span>}
        </div>
      )}
      <div style={{ height: h, borderRadius: 'var(--radius-pill)', background: 'var(--fill-strong)', overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${pct}%`, background: c, borderRadius: 'var(--radius-pill)', transition: 'width var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)' }} />
      </div>
    </div>
  );
}
