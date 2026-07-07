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
 * LDS Core - Spinner
 * Circular loading indicator with an optional visible label.
 */
export function Spinner({ size = 24, thickness, color = 'var(--lk-accent-ink)', label, variant = 'circular', style, ...rest }) {
  useKeyframes('lk-spin-kf', '@keyframes lk-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion: reduce){[data-lds-spinner-ring]{animation:none}}');
  useKeyframes('lk-wanted-loading-kf', '@keyframes lk-wanted-loading{0%,100%{transform:translateY(0) scale(1);opacity:.92}50%{transform:translateY(-4px) scale(1.05);opacity:1}}@media (prefers-reduced-motion: reduce){[data-lds-wanted-loading]>*{animation:none}}');

  if (variant === 'wanted') {
    const unit = Math.max(8, Math.round(size / 3));
    const mark = (
      <span data-lds-wanted-loading style={{ display: 'inline-flex', alignItems: 'center', gap: Math.max(5, Math.round(unit * 0.45)), height: size }}>
        <span style={{ width: unit, height: unit, borderRadius: '50%', background: 'var(--lk-accent-ink)', animation: 'lk-wanted-loading .9s ease-in-out infinite' }} />
        <span style={{ width: unit, height: unit, background: 'var(--accent-background-pink)', transform: 'rotate(45deg)', animation: 'lk-wanted-loading .9s ease-in-out .12s infinite' }} />
        <span style={{ width: 0, height: 0, borderTop: `${unit * 0.62}px solid transparent`, borderBottom: `${unit * 0.62}px solid transparent`, borderLeft: `${unit * 1.08}px solid var(--accent-background-orange)`, animation: 'lk-wanted-loading .9s ease-in-out .24s infinite' }} />
      </span>
    );
    if (label == null) {
      return (
        <span role="status" aria-label="loading" aria-live="polite" style={{ display: 'inline-flex', ...style }} {...rest}>
          {mark}
        </span>
      );
    }
    return (
      <span role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'inherit', ...style }} {...rest}>
        {mark}
        <span>{label}</span>
      </span>
    );
  }

  const t = thickness || Math.max(2, Math.round(size / 10));
  const ring = (
    <span
      data-lds-spinner-ring
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        boxSizing: 'border-box',
        border: `${t}px solid var(--fill-strong)`,
        borderTopColor: color,
        animation: 'lk-spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );

  if (label == null) {
    return (
      <span role="status" aria-label="loading" aria-live="polite" style={{ display: 'inline-flex', ...style }} {...rest}>
        {ring}
      </span>
    );
  }

  return (
    <span role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 14, color: 'inherit', ...style }} {...rest}>
      {ring}
      <span>{label}</span>
    </span>
  );
}
