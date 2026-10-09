import React from 'react';
import {
  LK_LOGO_COLORS,
  LK_LOGO_VIEWBOX,
  LK_PATHS,
  ROBOTICS_INLINE_PATHS,
  ROBOTICS_INLINE_TRANSFORM,
} from './lk-logo-paths.js';
import { PRODUCT_LOCKUP_COMPANY_KEYS, PRODUCT_LOCKUP_REGISTRY } from './lk-product-lockup-paths.js';

const DEFAULT_HEIGHT = 28;
const [, , MARK_VIEWBOX_WIDTH, MARK_VIEWBOX_HEIGHT] = LK_LOGO_VIEWBOX.mark.split(/\s+/).map(Number);
const PRODUCT_LOCKUP_MOTION_STYLES = `
  @media(prefers-reduced-motion:reduce){[data-product-lockup-motion="reveal"]{transition:none!important}}
`;

function approvedKeyList(keys) {
  return keys.map((key) => JSON.stringify(key)).join(' | ');
}

/**
 * Approved LK product-shell lockup.
 *
 * `endorsement="mark"` (default): registered, uppercase Montserrat SemiBold
 * product wordmarks next to the LK mark. They keep the Portal-inspired 1X
 * visible height and 0.35 mark-width gap while making the invariant LK mark the
 * stronger parent-brand signal.
 *
 * `endorsement="company"`: the company inline lockup (LK + Bold 700 ROBOTICS,
 * unchanged) followed by the approved canonical-case product name outlined from
 * pinned Pretendard SemiBold 600 (the LDS UI typography font), for wide
 * first-impression surfaces such as a home hero or sign-in. Only registry
 * entries with an approved `company` form render; there is no compact mode.
 *
 * Runtime output has no font or SVG text dependency.
 */
export function ProductLockup({
  product,
  endorsement = 'mark',
  appearance = 'positive',
  height,
  compact = false,
  decorative = false,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  if (endorsement !== 'mark' && endorsement !== 'company') {
    throw new TypeError(
      `Unsupported ProductLockup endorsement ${JSON.stringify(endorsement)}. Use "mark" or "company".`,
    );
  }
  const entry = PRODUCT_LOCKUP_REGISTRY[product];
  if (!entry) {
    // Name the approved keys and the intake procedure: the failure a product hits
    // here is "my product is not registered yet", and the next step is a brand
    // approval, not a code change at the call site.
    throw new TypeError(
      `Unsupported ProductLockup product ${JSON.stringify(product)}. Approved registry keys are ${approvedKeyList(Object.keys(PRODUCT_LOCKUP_REGISTRY))}. `
      + 'Register a new product through docs/brand/LK_PRODUCT_LOCKUP_STANDARD.md section 9; do not compose a lockup from live text.',
    );
  }

  const resolvedTone = appearance === 'reverse' ? 'white' : 'ink';
  const fill = resolvedTone === 'white' ? LK_LOGO_COLORS.white : LK_LOGO_COLORS.navy;

  if (endorsement === 'company') {
    if (compact) {
      throw new TypeError(
        'ProductLockup endorsement="company" has no compact mode. Switch a narrow slot to the company Lockup variant="inline" or "mark" instead.',
      );
    }
    const company = entry.company;
    if (!company) {
      throw new TypeError(
        `ProductLockup product ${JSON.stringify(product)} has no approved company-endorsed form. Approved company keys are ${approvedKeyList(PRODUCT_LOCKUP_COMPANY_KEYS)}. `
        + 'Register the form through docs/brand/LK_PRODUCT_LOCKUP_STANDARD.md section 9; do not compose a lockup from live text.',
      );
    }
    const requestedHeight = Number.isFinite(height) ? height : company.defaultRenderedHeightPx;
    const renderedHeight = Math.max(requestedHeight, company.minimumRenderedHeightPx);
    const [, , viewBoxWidth, viewBoxHeight] = company.viewBox.split(/\s+/).map(Number);
    const intrinsicWidth = Number((renderedHeight * viewBoxWidth / viewBoxHeight).toFixed(6));
    const a11y = decorative
      ? { 'aria-hidden': true }
      : { role: 'img', 'aria-label': ariaLabel ?? `LK ROBOTICS ${company.label}` };

    // Proportional scaling only: no crop, no wrap. A slot narrower than the
    // minimum width is the shell's cue to switch to the company inline lockup.
    return (
      <svg
        {...rest}
        viewBox={company.viewBox}
        width={intrinsicWidth}
        height={renderedHeight}
        preserveAspectRatio="xMidYMid meet"
        data-product-lockup=""
        data-product-lockup-product={product}
        data-product-lockup-endorsement="company"
        data-product-lockup-wordmark={company.wordmark}
        {...a11y}
        style={{
          display: 'block',
          flex: '0 0 auto',
          maxWidth: '100%',
          height: 'auto',
          ...style,
        }}
      >
        <g fill={fill} fillRule="nonzero">
          {LK_PATHS.map((path, index) => (
            <path key={`lk-${index}`} d={path.d} transform={path.transform} />
          ))}
          <g transform={ROBOTICS_INLINE_TRANSFORM} data-product-lockup-company-paths="">
            {ROBOTICS_INLINE_PATHS.map((path, index) => (
              <path key={`${path.letter}-${index}`} d={path.d} />
            ))}
          </g>
          <g transform={company.transform} data-product-lockup-wordmark-paths="">
            {company.paths.map((path, index) => (
              <path key={`${path.letter}-${index}`} d={path.d} />
            ))}
          </g>
        </g>
      </svg>
    );
  }

  const requestedHeight = Number.isFinite(height) ? height : DEFAULT_HEIGHT;
  const renderedHeight = Math.max(requestedHeight, entry.minimumRenderedHeightPx);
  const accessibleName = ariaLabel ?? `LK ${entry.label}`;

  const [, , viewBoxWidth, viewBoxHeight] = entry.viewBox.split(/\s+/).map(Number);
  const fullWidth = Number((renderedHeight * viewBoxWidth / viewBoxHeight).toFixed(6));
  const compactWidth = Number((renderedHeight * MARK_VIEWBOX_WIDTH / MARK_VIEWBOX_HEIGHT).toFixed(6));
  const intrinsicWidth = compact ? compactWidth : fullWidth;
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
