import React from 'react';
import { Icon } from '../icon/Icon.jsx';

// Small map badges cannot rely on font ascent, baseline, or fallback-glyph
// metrics. Reuse the LDS icon registry for filled glyphs and keep the three
// map-specific shapes on the same centered 24-unit geometry contract.
const REGISTRY_ICON_BY_KIND = {
  unknown: 'question',
  conflict: 'exclamation',
  invalid: 'exclamation',
  closed: 'close',
  blocked: 'close',
  waiting: 'pause',
  rerouting: 'refresh',
  completed: 'check',
};
const CUSTOM_KINDS = new Set(['planned', 'active', 'stale']);

// Direction chevrons use the same optically centered triangle as `active`.
// Its area centroid is the local origin: (-2 - 2 + 4) / 3 = 0.
export const NAVIGATION_DIRECTION_PATH = 'M -2 -3.4 L 4 0 L -2 3.4 Z';

function customGlyph(kind, size) {
  const strokeWidth = Math.max(1.25, size * 0.14);

  if (kind === 'planned') {
    return React.createElement('circle', {
      cx: 0,
      cy: 0,
      r: size * 0.27,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      vectorEffect: 'non-scaling-stroke',
    });
  }

  if (kind === 'active') {
    const scale = size / 10;
    return React.createElement('path', {
      d: NAVIGATION_DIRECTION_PATH,
      transform: scale === 1 ? undefined : `scale(${scale})`,
      fill: 'currentColor',
    });
  }

  if (kind === 'stale') {
    // Clock hands are intrinsically asymmetric. Shift their painted bounds
    // back onto the badge center so the tiny glyph reads optically centered.
    const offsetX = size * -0.125;
    const offsetY = size * 0.06;
    return React.createElement('path', {
      // Adapted from the hands of assets/icons/clock.svg. The badge outline
      // itself is the clock perimeter, avoiding a visually noisy double ring.
      d: `M ${offsetX} ${offsetY + size * -0.31} V ${offsetY} L ${offsetX + size * 0.25} ${offsetY + size * 0.19}`,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      vectorEffect: 'non-scaling-stroke',
    });
  }

  return null;
}

/** Internal, font-independent state geometry for Robotics Navigation SVG badges. */
export function NavigationStateGlyph({
  kind,
  size = 10,
  color = 'currentColor',
  ...rest
}) {
  const resolvedKind = (REGISTRY_ICON_BY_KIND[kind] || CUSTOM_KINDS.has(kind)) ? kind : 'unknown';
  const resolvedSize = Math.max(10, Number(size) || 10);
  const iconName = REGISTRY_ICON_BY_KIND[resolvedKind];
  const source = iconName ? `lds-icon:${iconName}` : 'lds-icon:adapted-map-geometry';

  return React.createElement(
    'g',
    {
      ...rest,
      'data-navigation-state-glyph': resolvedKind,
      'data-navigation-state-glyph-source': source,
      'data-navigation-state-glyph-size': resolvedSize,
      'aria-hidden': 'true',
      focusable: 'false',
      pointerEvents: 'none',
      style: { color },
    },
    iconName
      ? React.createElement(Icon, {
        name: iconName,
        size: resolvedSize,
        x: -resolvedSize / 2,
        y: -resolvedSize / 2,
        'aria-hidden': 'true',
        focusable: 'false',
        style: { color, overflow: 'visible' },
      })
      : customGlyph(resolvedKind, resolvedSize),
  );
}

export default NavigationStateGlyph;
