import React from 'react';
import { Lockup } from './Lockup.jsx';
import { LK_LOGO_COLORS, LK_PATHS } from '@lk-design-system/lds-core/components/brand/lk-logo-paths';
import { PRODUCT_LOCKUP_REGISTRY } from './lk-product-lockup-paths.js';

const DEFAULT_HEIGHT = 28;

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
    throw new TypeError(`Unsupported ProductLockup product ${JSON.stringify(product)}. Use an approved registry key.`);
  }

  const resolvedTone = appearance === 'reverse' ? 'white' : 'ink';
  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT;
  const renderedHeight = Math.max(requestedHeight, entry.minimumRenderedHeightPx);
  const accessibleName = ariaLabel ?? `LK ${entry.label}`;

  if (compact) {
    return (
      <Lockup
        {...rest}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : accessibleName}
        aria-hidden={decorative ? true : undefined}
        data-product-lockup=""
        data-product-lockup-product={product}
        data-product-lockup-mode="compact"
        variant="mark"
        tone={resolvedTone}
        height={renderedHeight}
        title={accessibleName}
        decorative={decorative}
        style={style}
      />
    );
  }

  const [, , viewBoxWidth, viewBoxHeight] = entry.viewBox.split(/\s+/).map(Number);
  const intrinsicWidth = Number((renderedHeight * viewBoxWidth / viewBoxHeight).toFixed(6));
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
      preserveAspectRatio="xMidYMid meet"
      data-product-lockup=""
      data-product-lockup-product={product}
      data-product-lockup-mode="full"
      data-product-lockup-wordmark={entry.wordmark}
      {...a11y}
      style={{ display: 'block', maxWidth: '100%', height: 'auto', ...style }}
    >
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
