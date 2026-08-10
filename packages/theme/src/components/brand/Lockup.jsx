import React from 'react';
import {
  LK_LOGO_COLORS,
  LK_LOGO_USAGE,
  LK_LOGO_VIEWBOX as VIEWBOX,
  LK_PATHS,
  ROBOTICS_INLINE_TRANSFORM,
  ROBOTICS_PATHS,
} from '@lk-design-system/lds-core/components/brand/lk-logo-paths';

const DEFAULT_HEIGHT = Object.freeze({ mark: 32, stacked: 64, inline: 28 });
const VIEWBOX_METRICS = Object.freeze(Object.fromEntries(
  Object.entries(VIEWBOX).map(([variant, value]) => {
    const [, , width, height] = value.split(/\s+/).map(Number);
    return [variant, Object.freeze({ width, height })];
  }),
));

/**
 * LK ROBOTICS — Lockup
 * Self-contained SVG generated from the regulated brand construction. LK is
 * custom vector geometry; ROBOTICS is outlined from the pinned Montserrat
 * ExtraBold 800 v7.222 font. No runtime font is required.
 * `tone`: 'ink'/'brand' = official #05132B · 'white' · compatibility currentColor.
 * Constrained black-only output uses the existing explicit `color="#000000"` escape hatch.
 * `height` is the requested natural height; narrow parents scale both axes down
 * together instead of clipping or distorting. Decorative instances get aria-hidden.
 */
export function Lockup({ variant = 'inline', tone = 'ink', color, height, title = 'LK ROBOTICS', decorative = false, style, ...rest }) {
  const resolvedVariant = Object.prototype.hasOwnProperty.call(VIEWBOX, variant) ? variant : 'inline';
  const fill = color || (tone === 'white' ? LK_LOGO_COLORS.white : tone === 'current' ? 'currentColor' : LK_LOGO_COLORS.navy);
  const vb = VIEWBOX[resolvedVariant];
  const minimumHeight = LK_LOGO_USAGE.minimumRenderedHeightPx[resolvedVariant];
  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT[resolvedVariant];
  const h = Math.max(requestedHeight, minimumHeight);
  const metrics = VIEWBOX_METRICS[resolvedVariant];
  const intrinsicWidth = Number((h * metrics.width / metrics.height).toFixed(6));
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': title };
  return (
    <svg
      viewBox={vb}
      width={intrinsicWidth}
      height={h}
      preserveAspectRatio="xMidYMid meet"
      data-lockup-variant={resolvedVariant}
      {...a11y}
      {...rest}
      style={{ display: 'block', maxWidth: '100%', height: 'auto', ...style }}
    >
      <g fill={fill} fillRule="nonzero">
        {LK_PATHS.map((path, index) => (
          <path key={`lk-${index}`} d={path.d} transform={path.transform} />
        ))}
        {resolvedVariant === 'stacked' && ROBOTICS_PATHS.map((path, index) => (
          <path key={`${path.letter}-${index}`} d={path.d} transform={path.transform} />
        ))}
        {resolvedVariant === 'inline' && (
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
