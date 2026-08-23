import React from 'react';
import { LK_LOGO_COLORS, LK_LOGO_VIEWBOX, LK_PATHS } from '@lk-design-system/lds-core/brand-authoring';
import { PRODUCT_LOCKUP_REGISTRY } from './lk-product-lockup-paths.js';

const DEFAULT_HEIGHT = 28;
const [, , MARK_VIEWBOX_WIDTH, MARK_VIEWBOX_HEIGHT] = LK_LOGO_VIEWBOX.mark.split(/\s+/).map(Number);
const PRODUCT_LOCKUP_MOTION_STYLES = `
  @media(prefers-reduced-motion:reduce){[data-product-lockup-motion="reveal"]{transition:none!important}}
`;

/**
 * Approved LK product-shell lockup.
 *
 * Product wordmarks are registered, uppercase Montserrat SemiBold outlines.
 * They keep the Portal-inspired 1X visible height and 0.35 mark-width gap while
 * making the invariant LK mark the stronger parent-brand signal. Runtime output
 * has no font or SVG text dependency.
 */
export function ProductLockup({
  product,
  appearance = 'positive',
  height,
  compact = false,
  decorative = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const entry = PRODUCT_LOCKUP_REGISTRY[product];
  if (!entry) {
    // Name the approved keys and the intake procedure: the failure a product hits
    // here is "my product is not registered yet", and the next step is a brand
    // approval, not a code change at the call site.
    const approved = Object.keys(PRODUCT_LOCKUP_REGISTRY).map((key) => JSON.stringify(key)).join(' | ');
    throw new TypeError(
      `Unsupported ProductLockup product ${JSON.stringify(product)}. Approved registry keys are ${approved}. `
      + 'Register a new product through docs/brand/LK_PRODUCT_LOCKUP_STANDARD.md section 9; do not compose a lockup from live text.',
    );
  }

  const resolvedTone = appearance === 'reverse' ? 'white' : 'ink';
  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT;
  const renderedHeight = Math.max(requestedHeight, entry.minimumRenderedHeightPx);
  const accessibleName = ariaLabel ?? `LK ${entry.label}`;

  const [, , viewBoxWidth, viewBoxHeight] = entry.viewBox.split(/\s+/).map(Number);
  const fullWidth = Number((renderedHeight * viewBoxWidth / viewBoxHeight).toFixed(6));
  const compactWidth = Number((renderedHeight * MARK_VIEWBOX_WIDTH / MARK_VIEWBOX_HEIGHT).toFixed(6));
  const intrinsicWidth = compact ? compactWidth : fullWidth;
  const fill = resolvedTone === 'white' ? LK_LOGO_COLORS.white : LK_LOGO_COLORS.navy;
  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': accessibleName };

  return (
    <svg
      {...rest}
      viewBox={entry.viewBox}
      width={intrinsicWidth}
      height={renderedHeight}
      preserveAspectRatio="xMinYMid slice"
      data-product-lockup=""
      data-product-lockup-product={product}
      data-product-lockup-mode={compact ? 'compact' : 'full'}
      data-product-lockup-motion="reveal"
      data-product-lockup-wordmark={entry.wordmark}
      {...a11y}
      style={{
        display: 'block',
        flex: '0 0 auto',
        maxWidth: '100%',
        overflow: 'hidden',
        transition: 'width var(--dur-base, 200ms) var(--ease-out)',
        ...style,
      }}
    >
      <style>{PRODUCT_LOCKUP_MOTION_STYLES}</style>
      <g fill={fill} fillRule="nonzero">
        {LK_PATHS.map((path, index) => (
          <path key={`lk-${index}`} d={path.d} transform={path.transform} />
        ))}
        <g transform={entry.transform} data-product-lockup-wordmark-paths="">
          {entry.paths.map((path, index) => (
            <path key={`${path.letter}-${index}`} d={path.d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
