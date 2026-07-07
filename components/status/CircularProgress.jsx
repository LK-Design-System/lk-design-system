import React from 'react';

/**
 * LK ROBOTICS — CircularProgress
 * A determinate ring gauge (완료율, 품질 점수). Signal-ink arc on a faint track;
 * optional centered `showValue` percentage. Calm fill transition.
 */
export function CircularProgress({ value = 0, max = 100, size = 48, thickness = 5, tone = 'signal', showValue = false, style, ...rest }) {
  const c = tone === 'positive' ? 'var(--bw-green)' : tone === 'cautionary' ? 'var(--bw-amber)' : tone === 'negative' ? 'var(--bw-red)' : 'var(--lk-accent-ink)';
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, ...style }} {...rest}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--fill-strong)" strokeWidth={thickness} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset var(--dur-base) var(--ease-out)' }} />
      </svg>
      {showValue && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: Math.round(size * 0.28), fontWeight: 'var(--fw-bold)', color: 'var(--label-normal)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}</span>}
    </span>
  );
}
