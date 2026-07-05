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

/**
 * LK ROBOTICS — Spinner
 * A calm circular loading indicator — a signal-ink arc on a faint cool-gray
 * ring, one steady rotation (no easing pulse). Optional trailing `label`.
 */
export function Spinner({ size = 24, thickness, color = 'var(--lk-accent-ink)', label, style, ...rest }) {
  useKeyframes('lk-spin-kf', '@keyframes lk-spin{to{transform:rotate(360deg)}}');
  const t = thickness || Math.max(2, Math.round(size / 10));
  const ring = (
    <span style={{
      width: size, height: size, borderRadius: '50%', boxSizing: 'border-box',
      border: `${t}px solid var(--fill-strong)`, borderTopColor: color,
      animation: 'lk-spin 0.7s linear infinite', flexShrink: 0,
    }} />
  );
  if (label == null) {
    return <span role="status" aria-label="loading" style={{ display: 'inline-flex', ...style }} {...rest}>{ring}</span>;
  }
  return (
    <span role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'inherit', ...style }} {...rest}>
      {ring}<span>{label}</span>
    </span>
  );
}
