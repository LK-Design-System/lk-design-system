import React from 'react';
import { LK_D, ROBO_D, ROBO_INLINE, LK_LOGO_VIEWBOX as VIEWBOX } from './lk-logo-paths.js';

/**
 * LK ROBOTICS — Lockup
 * The brand logo, drawn inline (self-contained SVG, no asset files). Geometry
 * and composition are copied verbatim from the original trace assets
 * (assets/brand/lk-logo-*.svg) — do NOT rescale or reposition the wordmark.
 * `variant`: 'mark' (LK symbol only), 'stacked' (primary — LK over ROBOTICS),
 * 'inline' (LK ROBOTICS horizontal). `tone` maps to a fill ('ink' brand navy ·
 * 'white' · 'brand' = alias of 'ink' (the logo is never tinted with the UI
 * signal blue) · 'current' = currentColor for arbitrary tint). Size via
 * `height`. Decorative instances get aria-hidden.
 */
export function Lockup({ variant = 'inline', tone = 'ink', color, height, title = 'LK ROBOTICS', decorative = false, style, ...rest }) {
  const fill = color || (tone === 'white' ? 'var(--color-semantic-static-white)' : tone === 'current' ? 'currentColor' : 'var(--color-semantic-brand-ink)');
  const vb = VIEWBOX[variant] || VIEWBOX.inline;
  const h = height != null ? height : (variant === 'mark' ? 32 : variant === 'stacked' ? 64 : 28);
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': title };
  return (
    <svg viewBox={vb} height={h} {...a11y} style={{ display: 'block', ...style }} {...rest}>
      <g transform="translate(0,504) scale(0.1,-0.1)" fill={fill}>
        <path fillRule="evenodd" d={LK_D} />
        {variant === 'stacked' && <path fillRule="evenodd" d={ROBO_D} />}
        {variant === 'inline' && <g transform={ROBO_INLINE}><path fillRule="evenodd" d={ROBO_D} /></g>}
      </g>
    </svg>
  );
}
