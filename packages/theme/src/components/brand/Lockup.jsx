import React from 'react';
import {
  LK_LOGO_COLORS,
  LK_LOGO_USAGE,
  LK_LOGO_VIEWBOX as VIEWBOX,
  LK_PATHS,
  ROBOTICS_INLINE_TRANSFORM,
  ROBOTICS_PATHS,
} from '@lk-design-system/lds-core/brand-authoring';
import {
  PORTAL_INLINE_TRANSFORM,
  PORTAL_LOCKUP_VIEWBOX,
  PORTAL_PATHS,
  PORTAL_MINIMUM_RENDERED_HEIGHT_PX,
} from './lk-portal-lockup-paths.js';

/* 고정 `portal` 정본도 회사 variant와 같은 렌더 계약(최소 높이 보정,
   intrinsic width, viewBox 검증)을 유지한다. ProductLockup의 portal registry와
   생성 경로를 동기화하며, 생성 모듈만 다르므로 렌더 로직은 한 표로 둔다. */
const VARIANT_VIEWBOX = Object.freeze({ ...VIEWBOX, portal: PORTAL_LOCKUP_VIEWBOX });
const MINIMUM_HEIGHT = Object.freeze({
  ...LK_LOGO_USAGE.minimumRenderedHeightPx,
  portal: PORTAL_MINIMUM_RENDERED_HEIGHT_PX,
});
const DEFAULT_HEIGHT = Object.freeze({ mark: 32, stacked: 64, inline: 28, portal: 28 });
const VIEWBOX_METRICS = Object.freeze(Object.fromEntries(
  Object.entries(VARIANT_VIEWBOX).map(([variant, value]) => {
    const [, , width, height] = value.split(/\s+/).map(Number);
    return [variant, Object.freeze({ width, height })];
  }),
));

/**
 * LK ROBOTICS — Lockup
 * Self-contained SVG generated from the regulated brand construction. LK is
 * custom vector geometry; ROBOTICS is outlined from pinned Montserrat ExtraBold
 * 800 and the canonical fixed PORTAL from pinned Montserrat SemiBold 600 v7.222.
 * ProductLockup's Portal registry entry uses the same paths. No runtime font is required.
 * `tone`: 'ink'/'brand' = official #05132B · 'white' · compatibility currentColor.
 * Constrained black-only output uses the existing explicit `color="#000000"` escape hatch.
 * `height` is the requested natural height; narrow parents scale both axes down
 * together instead of clipping or distorting. Decorative instances get aria-hidden.
 *
 * `title` defaults per variant: the canonical Portal asset names itself `LK Portal`,
 * every company variant names itself `LK ROBOTICS`.
 */
export function Lockup({ variant = 'inline', tone = 'ink', color, height, title, decorative = false, style, ...rest }) {
  const resolvedVariant = Object.prototype.hasOwnProperty.call(VARIANT_VIEWBOX, variant) ? variant : 'inline';
  const fill = color || (tone === 'white' ? LK_LOGO_COLORS.white : tone === 'current' ? 'currentColor' : LK_LOGO_COLORS.navy);
  const vb = VARIANT_VIEWBOX[resolvedVariant];
  const minimumHeight = MINIMUM_HEIGHT[resolvedVariant];
  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT[resolvedVariant];
  const h = Math.max(requestedHeight, minimumHeight);
  const metrics = VIEWBOX_METRICS[resolvedVariant];
  const intrinsicWidth = Number((h * metrics.width / metrics.height).toFixed(6));
  const accessibleTitle = title ?? (resolvedVariant === 'portal' ? 'LK Portal' : 'LK ROBOTICS');
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': accessibleTitle };
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
        {resolvedVariant === 'portal' && (
          <g transform={PORTAL_INLINE_TRANSFORM}>
            {PORTAL_PATHS.map((path, index) => (
              <path key={`${path.letter}-${index}`} d={path.d} />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
