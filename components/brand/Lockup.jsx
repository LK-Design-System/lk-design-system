import React from 'react';
import {
  LK_LOGO_COLORS,
  LK_LOGO_VIEWBOX as VIEWBOX,
  LK_PATHS,
  ROBOTICS_INLINE_TRANSFORM,
  ROBOTICS_PATHS,
} from './lk-logo-paths.js';

/**
 * LK ROBOTICS — Lockup
 * Self-contained SVG generated from the regulated brand construction. LK is
 * custom vector geometry; ROBOTICS is outlined from the pinned Montserrat
 * ExtraBold 800 v7.222 font. No runtime font is required.
 * `tone`: 'ink'/'brand' = official #05132B · 'white' · 'current'. Size via
 * `height`. Decorative instances get aria-hidden.
 */
export function Lockup({ variant = 'inline', tone = 'ink', color, height, title = 'LK ROBOTICS', decorative = false, style, ...rest }) {
  const fill = color || (tone === 'white' ? LK_LOGO_COLORS.white : tone === 'current' ? 'currentColor' : LK_LOGO_COLORS.navy);
  const vb = VIEWBOX[variant] || VIEWBOX.inline;
  const h = height != null ? height : (variant === 'mark' ? 32 : variant === 'stacked' ? 64 : 28);
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': title };
  return (
    <svg viewBox={vb} height={h} {...a11y} style={{ display: 'block', ...style }} {...rest}>
      <g fill={fill} fillRule="nonzero">
        {LK_PATHS.map((path, index) => (
          <path key={`lk-${index}`} d={path.d} transform={path.transform} />
        ))}
        {variant === 'stacked' && ROBOTICS_PATHS.map((path, index) => (
          <path key={`${path.letter}-${index}`} d={path.d} transform={path.transform} />
        ))}
        {variant === 'inline' && (
          <g transform={ROBOTICS_INLINE_TRANSFORM}>
            {ROBOTICS_PATHS.map((path, index) => (
              <path key={`${path.letter}-${index}`} d={path.d} transform={path.transform} />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
