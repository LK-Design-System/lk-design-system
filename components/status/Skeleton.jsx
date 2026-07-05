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
 * LK ROBOTICS — Skeleton
 * A shimmering placeholder for loading content. `variant` text renders `lines`
 * bars (last one short); rect/circle render a single block. Cool-gray shimmer
 * on the fill tokens — calm, no bright flash.
 */
export function Skeleton({ variant = 'rect', width = '100%', height, radius, lines = 1, align = 'leading', tone = 'normal', style, ...rest }) {
  useKeyframes('lk-skel-kf', '@keyframes lk-skel{0%{background-position:200% 0}100%{background-position:-200% 0}}');
  const shimmer = tone === 'light'
    ? 'linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.20) 37%, rgba(255,255,255,0.10) 63%)'
    : 'linear-gradient(90deg, var(--fill-normal) 25%, var(--fill-strong) 37%, var(--fill-normal) 63%)';
  const base = {
    background: shimmer,
    backgroundSize: '200% 100%',
    animation: 'lk-skel 1.4s ease-in-out infinite',
  };
  if (variant === 'text') {
    const h = height || 14;
    const alignItems = align === 'center' ? 'center' : align === 'trailing' ? 'flex-end' : 'flex-start';
    return (
      <span style={{ display: 'flex', flexDirection: 'column', alignItems, ...style }} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <span key={i} style={{ display: 'block', height: h, width: (i === lines - 1 && lines > 1) ? '70%' : width, borderRadius: 'var(--radius-sm)', marginTop: i ? 10 : 0, ...base }} />
        ))}
      </span>
    );
  }
  const isCircle = variant === 'circle';
  const r = isCircle ? '50%' : (radius != null ? radius : 'var(--radius-lg)');
  const w = isCircle ? (width === '100%' ? 40 : width) : width;
  const h = isCircle ? (height || (width === '100%' ? 40 : width)) : (height || 16);
  return <span style={{ display: 'inline-block', width: w, height: h, borderRadius: r, ...base, ...style }} {...rest} />;
}
