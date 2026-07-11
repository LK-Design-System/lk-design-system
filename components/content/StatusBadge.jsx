import React from 'react';

const DOT = {
  positive: 'var(--component-status-badge-positive-indicator)',
  online: 'var(--component-status-badge-positive-indicator)',
  cautionary: 'var(--component-status-badge-cautionary-indicator)',
  warning: 'var(--component-status-badge-cautionary-indicator)',
  negative: 'var(--component-status-badge-negative-indicator)',
  offline: 'var(--component-status-badge-offline-indicator)',
  signal: 'var(--component-status-badge-signal-indicator)',
  critical: 'var(--component-status-badge-critical-indicator)',
};

/**
 * LK ROBOTICS — StatusBadge
 * Filled status badge — a coloured availability dot + label (가동중 / 점검중 /
 * 오프라인) inside a neutral r4 fill, matching the source `_Badge/Status` spec
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
        background: 'var(--component-status-badge-surface)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-semibold)', letterSpacing: 0,
        color: 'var(--component-status-badge-foreground)', ...style,
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
