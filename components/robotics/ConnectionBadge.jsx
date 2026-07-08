import React from 'react';

const CFG = {
  online: { c: 'var(--color-positive)', bars: 3, label: '온라인' },
  reconnecting: { c: 'var(--color-cautionary)', bars: 2, label: '재연결' },
  weak: { c: 'var(--color-cautionary)', bars: 1, label: '약함' },
  offline: { c: 'var(--label-disable)', bars: 0, label: '오프라인' },
};

/**
 * LK ROBOTICS — ConnectionBadge
 * Connection-state indicator (signal bars + label) for MQTT / rosbridge links.
 * `reconnecting` blinks. Bars fill by strength; colour follows the state.
 */
export function ConnectionBadge({ status = 'online', label, showLabel = true, size = 'md', style, ...rest }) {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-conn-kf')) return;
    const el = document.createElement('style');
    el.id = 'lk-conn-kf';
    el.textContent = '@keyframes lk-conn-blink{0%,100%{opacity:1}50%{opacity:.35}}';
    document.head.appendChild(el);
  }, []);
  const cfg = CFG[status] || CFG.online;
  const h = size === 'sm' ? 11 : 14;
  const bw = size === 'sm' ? 3 : 4;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)',
      fontSize: size === 'sm' ? 12 : 13, fontWeight: 'var(--fw-semibold)', color: 'var(--label-neutral)', ...style }} {...rest}>
      <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: h,
        animation: status === 'reconnecting' ? 'lk-conn-blink 1s var(--ease-in-out) infinite' : 'none' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: bw, height: Math.round(h * ((i + 1) / 3)), borderRadius: 1,
            background: i < cfg.bars ? cfg.c : 'var(--fill-strong)' }} />
        ))}
      </span>
      {showLabel && <span>{label || cfg.label}</span>}
    </span>
  );
}
