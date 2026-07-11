import React from 'react';

function useKeyframes(id, css) {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

const TONES = {
  signal: 'var(--color-semantic-primary-normal)',
  positive: 'var(--color-semantic-status-positive)',
  cautionary: 'var(--color-semantic-status-cautionary)',
  negative: 'var(--color-semantic-status-negative)',
};

/**
 * LDS Core - CircularProgress
 * Circular determinate or indeterminate progress indicator.
 */
export function CircularProgress({
  value = 0,
  max = 100,
  size = 48,
  thickness = 5,
  tone = 'signal',
  indeterminate = false,
  label,
  showValue = false,
  style,
  ...rest
}) {
  useKeyframes('lk-circular-kf', '@keyframes lk-circular-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion: reduce){[data-lds-circular-progress]{animation:none}}');
  const c = TONES[tone] || TONES.signal;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const dashOffset = indeterminate ? circ * 0.72 : circ * (1 - pct / 100);
  const ariaLabel = typeof label === 'string' ? label : undefined;

  return (
    <span
      role="progressbar"
      aria-label={ariaLabel}
      aria-busy={indeterminate || undefined}
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={indeterminate ? 'loading' : `${Math.round(pct)}%`}
      style={{ position: 'relative', display: 'inline-flex', width: size, height: size, ...style }}
      {...rest}
    >
      <svg
        data-lds-circular-progress
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', animation: indeterminate ? 'lk-circular-spin 0.9s linear infinite' : undefined }}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-semantic-fill-strong)" strokeWidth={thickness} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dashOffset} style={{ transition: indeterminate ? undefined : 'stroke-dashoffset var(--dur-base) var(--ease-out)' }} />
      </svg>
      {showValue && !indeterminate && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', fontSize: Math.round(size * 0.28), fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-normal)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}</span>}
    </span>
  );
}
