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
  signal: 'var(--lk-accent-ink)',
  positive: 'var(--bw-green)',
  cautionary: 'var(--bw-amber)',
  negative: 'var(--bw-red)',
};

/**
 * LK ROBOTICS — ProgressBar
 * A pill track with a signal-ink fill. Determinate (`value`/`max`) grows the
 * fill; `indeterminate` slides a segment for unknown-duration work. Optional
 * `label` + `showValue`.
 */
export function ProgressBar({ value = 0, max = 100, indeterminate = false, tone = 'signal', size = 'md', label, showValue = false, style, ...rest }) {
  useKeyframes('lk-prog-kf', '@keyframes lk-prog-indet{0%{left:-45%;width:45%}50%{width:55%}100%{left:100%;width:45%}}');
  const c = TONES[tone] || TONES.signal;
  const h = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ ...style }} {...rest}>
      {(label != null || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 'var(--fw-semibold)', color: 'var(--label-neutral)' }}>
          <span>{label}</span>
          {showValue && <span style={{ color: 'var(--label-alternative)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ position: 'relative', height: h, borderRadius: 'var(--radius-pill)', background: 'var(--fill-strong)', overflow: 'hidden' }}
      >
        {indeterminate ? (
          <span style={{ position: 'absolute', top: 0, bottom: 0, background: c, borderRadius: 'var(--radius-pill)', animation: 'lk-prog-indet 1.3s var(--ease-in-out) infinite' }} />
        ) : (
          <span style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: c, borderRadius: 'var(--radius-pill)', transition: 'width var(--dur-base) var(--ease-out)' }} />
        )}
      </div>
    </div>
  );
}
