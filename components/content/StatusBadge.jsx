import React from 'react';

const DOT = {
  positive: 'var(--bw-green)',
  online: 'var(--bw-green)',
  cautionary: 'var(--bw-amber)',
  warning: 'var(--bw-amber)',
  negative: 'var(--bw-red)',
  offline: 'var(--bw-gray-300)',
  signal: 'var(--lk-accent-ink)',
  critical: 'var(--color-danger-strong)',
};

/**
 * LK ROBOTICS — StatusBadge
 * A coloured status dot + label (가동중 / 점검중 / 오프라인). Optional `pulse`
 * radiates a soft ring — a live "detection" cue. `tone="critical"` is the vivid
 * safety exception (e-stop / collision) and auto-pulses.
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
        display: 'inline-flex', alignItems: 'center', gap: 7,
        fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 'var(--fw-semibold)', letterSpacing: 0,
        color: 'var(--label-neutral)', ...style,
      }}
      {...rest}
    >
      <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }}>
        {(pulse || tone === 'critical') && (
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c, animation: 'lk-status-pulse 1.7s var(--ease-out) infinite' }} />
        )}
      </span>
      {children}
    </span>
  );
}
