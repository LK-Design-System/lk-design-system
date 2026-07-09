import React from 'react';

const DOT = {
  positive: 'var(--bw-green)',
  online: 'var(--bw-green)',
  cautionary: 'var(--bw-amber)',
  warning: 'var(--bw-amber)',
  negative: 'var(--bw-red)',
  offline: 'var(--bw-gray-300)',
  signal: 'var(--color-semantic-primary-normal)',
  critical: 'var(--color-semantic-status-negative)',
};

/**
 * LK ROBOTICS — StatusBadge
 * Filled status badge — a coloured availability dot + label (가동중 / 점검중 /
 * 오프라인) inside a neutral r4 fill, matching WDS `_Badge/Status`
 * (r4 / h20 / padX6 / fs12, dot + text). Optional `pulse` radiates a soft ring —
 * a live "detection" cue. `tone="critical"` is the vivid safety exception
 * (e-stop / collision) and auto-pulses.
 */
export function StatusBadge({ children, tone = 'positive', pulse = false, style, ...rest }) {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-status-kf')) return;
    const el = document.createElement('style');
    el.id = 'lk-status-kf';
    el.textContent = '@keyframes lk-status-pulse{0%{transform:scale(1);opacity:.55}70%{transform:scale(2.6);opacity:0}100%{opacity:0}}';
    document.head.appendChild(el);
  }, []);
  const c = DOT[tone] || DOT.positive;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, boxSizing: 'border-box',
        height: 20, padding: '0 6px', borderRadius: 4, /* WDS _Badge/Status r4 */
        background: 'var(--color-semantic-fill-strong)',
        fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 'var(--fw-semibold)', letterSpacing: 0,
        color: 'var(--color-semantic-label-normal)', ...style,
      }}
      {...rest}
    >
      <span style={{ position: 'relative', width: 6, height: 6, borderRadius: '50%', background: c, flexShrink: 0 }}>
        {(pulse || tone === 'critical') && (
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c, animation: 'lk-status-pulse 1.7s var(--ease-out) infinite' }} />
        )}
      </span>
      {children}
    </span>
  );
}
