import React from 'react';
import { ProgressBar } from './ProgressBar.jsx';

/**
 * LK ROBOTICS — Meter
 * A labelled value bar with optional thresholds (완료율, 품질). Without
 * thresholds it uses the signal ink; with `{ low, high }` (percent) it steps
 * red → amber → steel-green. Composes ProgressBar for the track (Meter
 * sm → ProgressBar md, Meter md → ProgressBar lg) and keeps only the
 * threshold-color logic and the "value/max" caption.
 */
export function Meter({ value = 0, max = 100, label, thresholds, size = 'md', showValue = true, style, ...rest }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  let c = 'var(--lk-accent-ink)';
  if (thresholds) {
    if (pct <= thresholds.low) c = 'var(--bw-red)';
    else if (pct <= thresholds.high) c = 'var(--bw-amber)';
    else c = 'var(--bw-green)';
  }
  return (
    <div style={{ ...style }} {...rest}>
      {(label != null || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 'var(--fw-semibold)', color: 'var(--label-neutral)' }}>
          <span>{label}</span>
          {showValue && <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--label-alternative)' }}>{value}/{max}</span>}
        </div>
      )}
      <ProgressBar value={value} max={max} size={size === 'sm' ? 'md' : 'lg'} color={c} />
    </div>
  );
}
