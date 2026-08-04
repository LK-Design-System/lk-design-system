import React from 'react';
import { LK_LOGO_COLORS, LK_LOGO_VIEWBOX, LK_PATHS, ROBOTICS_INLINE_SCALE, ROBOTICS_INLINE_TRANSFORM, ROBOTICS_PATHS } from '../brand/lk-logo-paths.js';

const BRAND_LETTER_COUNT = LK_PATHS.length + ROBOTICS_PATHS.length;
const brandDelay = (order) => (BRAND_LETTER_COUNT > 1 ? (order / (BRAND_LETTER_COUNT - 1)) * 0.55 : 0).toFixed(3);
// Preserves the legacy Brand Spinner's ~3.2px on-screen travel at its default
// 22px height under the official SVG coordinate system.
const BRAND_WAVE_AMPLITUDE = 7;
const ROBOTICS_WAVE_AMPLITUDE = (BRAND_WAVE_AMPLITUDE / ROBOTICS_INLINE_SCALE).toFixed(6);

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
export function Spinner({ size, thickness, color = 'var(--color-semantic-primary-normal)', label, variant = 'circular', style, ...rest }) {
  /* The ring animation is applied as an inline style, so the reduced-motion
     override needs `!important` to win over it — same as the brand wave below
     (WCAG 2.3.3). */
  useKeyframes('lk-spin-kf', '@keyframes lk-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion: reduce){[data-lds-spinner-ring]{animation:none!important}}');
  // ROBOTICS carries the derived inline scale, so its local amplitude derives
  // from that scale and every official source path moves by the same amount.
  useKeyframes('lk-brand-wave-kf', `@keyframes lk-brand-wave-lk{0%,55%,100%{transform:translateY(0)}27%{transform:translateY(${BRAND_WAVE_AMPLITUDE}px)}}@keyframes lk-brand-wave-robo{0%,55%,100%{transform:translateY(0)}27%{transform:translateY(${ROBOTICS_WAVE_AMPLITUDE}px)}}@media (prefers-reduced-motion: reduce){[data-wave]{animation:none!important}}`);
  /* Defaults: circular 28px diameter; brand wordmark 22px cap height. */
  const resolvedSize = size ?? (variant === 'brand' ? 22 : 28);

  if (variant === 'brand') {
    /* LK Theme Override of the source-system brand loader: the real LK ROBOTICS
       wordmark is decomposed into its glyphs (each a single evenodd path so
       counters stay hollow) and every letter rides a staggered vertical wave. */
    const mark = (
      <svg viewBox={LK_LOGO_VIEWBOX.inline} height={resolvedSize} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
        <g fill={LK_LOGO_COLORS.navy} fillRule="nonzero">
          {LK_PATHS.map((path, i) => (
            <g key={`lk${i}`} transform={path.transform}>
              <path data-wave d={path.d} style={{ animation: `lk-brand-wave-lk 1.15s ease-in-out ${brandDelay(i)}s infinite` }} />
            </g>
          ))}
          <g transform={ROBOTICS_INLINE_TRANSFORM}>
            {ROBOTICS_PATHS.map((path, i) => (
              <g key={`ro${i}`} transform={path.transform}>
                <path data-wave d={path.d} style={{ animation: `lk-brand-wave-robo 1.15s ease-in-out ${brandDelay(LK_PATHS.length + i)}s infinite` }} />
              </g>
            ))}
          </g>
        </g>
      </svg>
    );
    const ariaLabel = typeof label === 'string' && label ? label : '불러오는 중';
    if (label == null) {
      return (
        <span role="status" aria-label={ariaLabel} aria-live="polite" style={{ display: 'inline-flex', ...style }} {...rest}>
          {mark}
        </span>
      );
    }
    return (
      <span role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2-5)', fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', color: 'inherit', ...style }} {...rest}>
        {mark}
        <span>{label}</span>
      </span>
    );
  }

  const t = thickness || Math.max(2, Math.round(resolvedSize / 10));
  const ring = (
    <span
      data-lds-spinner-ring
      style={{
        width: resolvedSize,
        height: resolvedSize,
        borderRadius: '50%',
        boxSizing: 'border-box',
        border: `${t}px solid var(--color-semantic-fill-strong)`,
        borderTopColor: color,
        animation: 'lk-spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );

  if (label == null) {
    return (
      <span role="status" aria-label="불러오는 중" aria-live="polite" style={{ display: 'inline-flex', ...style }} {...rest}>
        {ring}
      </span>
    );
  }

  return (
    <span role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2-5)', fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', color: 'inherit', ...style }} {...rest}>
      {ring}
      <span>{label}</span>
    </span>
  );
}
