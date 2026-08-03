import React from 'react';
import { LK_D, ROBO_D, ROBO_INLINE, LK_LOGO_VIEWBOX, LK_LETTER_GROUPS, ROBO_LETTER_GROUPS, splitSubpaths, joinLetters } from '../brand/lk-logo-paths.js';

const LK_LETTERS = joinLetters(splitSubpaths(LK_D), LK_LETTER_GROUPS);
const ROBO_LETTERS = joinLetters(splitSubpaths(ROBO_D), ROBO_LETTER_GROUPS);
const BRAND_LETTER_COUNT = LK_LETTERS.length + ROBO_LETTERS.length;
const brandDelay = (order) => (BRAND_LETTER_COUNT > 1 ? (order / (BRAND_LETTER_COUNT - 1)) * 0.55 : 0).toFixed(3);

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
  // Two amplitudes: ROBOTICS carries an extra 3.9x group scale, so its local
  // translate is 1/3.9 of LK's to bob by the same on-screen amount.
  useKeyframes('lk-brand-wave-kf', '@keyframes lk-brand-wave-lk{0%,55%,100%{transform:translateY(0)}27%{transform:translateY(300px)}}@keyframes lk-brand-wave-robo{0%,55%,100%{transform:translateY(0)}27%{transform:translateY(77px)}}@media (prefers-reduced-motion: reduce){[data-wave]{animation:none!important}}');
  /* Defaults: circular 28px diameter; brand wordmark 22px cap height. */
  const resolvedSize = size ?? (variant === 'brand' ? 22 : 28);

  if (variant === 'brand') {
    /* LK Theme Override of the source-system brand loader: the real LK ROBOTICS
       wordmark is decomposed into its glyphs (each a single evenodd path so
       counters stay hollow) and every letter rides a staggered vertical wave. */
    const mark = (
      <svg viewBox={LK_LOGO_VIEWBOX.inline} height={resolvedSize} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
        <g transform="translate(0,504) scale(0.1,-0.1)" fill="var(--color-semantic-brand-ink)">
          {LK_LETTERS.map((d, i) => (
            <path key={`lk${i}`} data-wave d={d} fillRule="evenodd" style={{ animation: `lk-brand-wave-lk 1.15s ease-in-out ${brandDelay(i)}s infinite` }} />
          ))}
          <g transform={ROBO_INLINE}>
            {ROBO_LETTERS.map((d, i) => (
              <path key={`ro${i}`} data-wave d={d} fillRule="evenodd" style={{ animation: `lk-brand-wave-robo 1.15s ease-in-out ${brandDelay(LK_LETTERS.length + i)}s infinite` }} />
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
