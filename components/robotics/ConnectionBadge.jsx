import React from 'react';

const CFG = {
  connecting: { c: 'var(--color-semantic-primary-normal)', bars: 1, label: '연결 중' },
  ready: { c: 'var(--color-semantic-primary-normal)', bars: 3, label: '연결 준비됨' },
  online: { c: 'var(--color-semantic-status-positive)', bars: 3, label: '온라인' },
  reconnecting: { c: 'var(--color-semantic-status-cautionary)', bars: 2, label: '재연결 중' },
  weak: { c: 'var(--color-semantic-status-cautionary)', bars: 1, label: '신호 약함' },
  stale: { c: 'var(--color-semantic-status-cautionary)', bars: 1, label: '데이터 지연' },
  error: { c: 'var(--color-semantic-status-negative)', bars: 0, label: '연결 오류' },
  offline: { c: 'var(--color-semantic-label-disable)', bars: 0, label: '오프라인' },
};

/**
 * LK ROBOTICS — ConnectionBadge
 * Connection-state indicator (signal bars + label) for MQTT / rosbridge links.
 * `ready` is a signal-coloured prerequisite state; it does not claim that a
 * composed control surface has passed every gate. Connecting/reconnecting/
 * stale states blink. Bars fill by strength, while the label keeps the state
 * distinguishable without colour. Recovery actions and freshness details
 * belong in a product composition with DescriptionList and ActionArea.
 */
export function ConnectionBadge({ status = 'online', label, showLabel = true, size = 'md', style, ...rest }) {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-conn-kf')) return;
    const el = document.createElement('style');
    el.id = 'lk-conn-kf';
    el.textContent = '@keyframes lk-conn-blink{0%,100%{opacity:1}50%{opacity:.35}}@media (prefers-reduced-motion: reduce){[data-lds-connection-motion]{animation:none!important}}';
    document.head.appendChild(el);
  }, []);
  const cfg = CFG[status] || CFG.offline;
  const animated = status === 'connecting' || status === 'reconnecting' || status === 'stale';
  const h = size === 'sm' ? 11 : 14;
  const bw = size === 'sm' ? 3 : 4;
  return (
    <span data-status={status} role={typeof (label || cfg.label) === 'string' ? 'img' : undefined} aria-label={typeof (label || cfg.label) === 'string' ? (label || cfg.label) : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)',
      fontSize: size === 'sm' ? 12 : 13, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-neutral)', ...style }} {...rest}>
      <span data-lds-connection-motion="" style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: h,
        animation: animated ? 'lk-conn-blink 1s var(--ease-in-out) infinite' : 'none' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: bw, height: Math.round(h * ((i + 1) / 3)), borderRadius: 1,
            background: i < cfg.bars ? cfg.c : 'var(--color-semantic-fill-strong)' }} />
        ))}
      </span>
      {showLabel && <span>{label || cfg.label}</span>}
    </span>
  );
}
