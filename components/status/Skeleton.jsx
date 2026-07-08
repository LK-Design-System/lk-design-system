import React from 'react';

/* WDS: skeleton bars and rects both use a 3px corner radius. */
const SKELETON_RADIUS = 3;

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
 * LDS Core - Skeleton
 * Shimmering placeholder for loading content. `text` renders line bars;
 * `rect` and `circle` render a single block.
 */
export function Skeleton({
  variant = 'rect',
  width = '100%',
  length,
  height,
  radius,
  lines = 1,
  align = 'leading',
  tone = 'normal',
  color,
  animate = true,
  opacity,
  style,
  ...rest
}) {
  useKeyframes(
    'lk-skel-kf',
    '@keyframes lk-skel{0%{background-position:200% 0}100%{background-position:-200% 0}}@media (prefers-reduced-motion: reduce){[data-lds-skeleton]{animation:none;background-position:0 0}}'
  );
  const normalizedTone = color === 'white' || tone === 'white' ? 'light' : tone;
  const customColor = color && color !== 'normal' && color !== 'white' ? color : undefined;
  const resolvedWidth = length ?? width;
  /* Light tone: WDS uses white@28%; --inverse-fill-normal (12%) is the closest
     available token — kept rather than hardcoding an rgba literal. */
  const shimmer = customColor ? `linear-gradient(90deg, ${customColor} 25%, color-mix(in srgb, ${customColor} 84%, white) 37%, ${customColor} 63%)` : normalizedTone === 'light'
    ? 'linear-gradient(90deg, var(--inverse-fill-normal) 25%, var(--inverse-line-strong) 37%, var(--inverse-fill-normal) 63%)'
    : 'linear-gradient(90deg, var(--color-semantic-fill-normal) 25%, var(--color-semantic-fill-strong) 37%, var(--color-semantic-fill-normal) 63%)';
  const base = {
    background: shimmer,
    backgroundSize: '200% 100%',
    animation: animate ? 'lk-skel 1.4s ease-in-out infinite' : 'none',
  };

  if (variant === 'text') {
    const h = height || 14;
    const alignItems = align === 'center' ? 'center' : align === 'trailing' ? 'flex-end' : 'flex-start';
    return (
      <span aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems, ...style }} {...rest}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            data-lds-skeleton
            key={i}
            style={{
              display: 'block',
              height: h,
              width: i === lines - 1 && lines > 1 && length == null ? '70%' : resolvedWidth,
              borderRadius: SKELETON_RADIUS,
              marginTop: i ? 10 : 0,
              opacity,
              ...base,
            }}
          />
        ))}
      </span>
    );
  }

  const isCircle = variant === 'circle';
  const r = isCircle ? '50%' : (radius != null ? radius : SKELETON_RADIUS);
  const w = isCircle ? (resolvedWidth === '100%' ? 40 : resolvedWidth) : resolvedWidth;
  const h = isCircle ? (height || (resolvedWidth === '100%' ? 40 : resolvedWidth)) : (height || 16);

  return (
    <span
      data-lds-skeleton
      aria-hidden="true"
      style={{ display: 'inline-block', width: w, height: h, borderRadius: r, opacity, ...base, ...style }}
      {...rest}
    />
  );
}
