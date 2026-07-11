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
 * LDS Core - ProgressBar
 * Linear determinate or indeterminate progress indicator.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  indeterminate = false,
  tone = 'signal',
  color,
  size = 'md',
  label,
  showValue = false,
  style,
  'aria-label': ariaLabelProp,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-valuetext': ariaValueText,
  ...rest
}) {
  useKeyframes('lk-prog-kf', '@keyframes lk-prog-indet{0%{left:-45%;width:45%}50%{width:55%}100%{left:100%;width:45%}}@media (prefers-reduced-motion: reduce){[data-lds-progress-indeterminate]{animation:none}}');
  const c = color || TONES[tone] || TONES.signal;
  const h = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const ariaLabel = ariaLabelProp ?? (typeof label === 'string' ? label : undefined);

  return (
    <div style={{ ...style }} {...rest}>
      {(label != null || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8, fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-neutral)' }}>
          <span>{label}</span>
          {showValue && <span style={{ color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-busy={indeterminate || undefined}
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={ariaValueText ?? (indeterminate ? '진행 중' : `${Math.round(pct)}%`)}
        style={{ position: 'relative', height: h, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-strong)', overflow: 'hidden' }}
      >
        {indeterminate ? (
          <span data-lds-progress-indeterminate style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '45%', background: c, borderRadius: 'var(--radius-pill)', animation: 'lk-prog-indet 1.3s var(--ease-in-out) infinite' }} />
        ) : (
          <span style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: c, borderRadius: 'var(--radius-pill)', transition: 'width var(--dur-base) var(--ease-out)' }} />
        )}
      </div>
    </div>
  );
}
