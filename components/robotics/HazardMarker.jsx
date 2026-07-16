import React from 'react';
import { isFocusVisibleTarget } from './_NavigationFocus.js';
import { FACILITY_GLYPH_PATHS } from './_FacilityGlyph.js';
import { NavigationAnnotationBlock, annotationPriority, useNavigationObstacles } from './_navigationAnnotations.js';

// Accessible-name copy is Korean to match every sibling navigation overlay
// (Waypoint / Lane / Region / Route / Trajectory / Facility) so a Korean-first
// product never announces mixed-language part names in one map (WCAG 3.1.2).
const KIND_LABELS = {
  stairs: '계단',
  ramp: '경사로',
  dropoff: '단차·낙하',
  // Reads as "충돌 위험" in the `${kind} 위험` accessible-name slot.
  obstacle: '충돌',
};

// Hazard severity is the visual axis (not availability): products classify the
// avoidance weight; the marker never infers it from position or kind.
const SEVERITY_PRESENTATION = {
  caution: {
    label: '주의',
    fill: 'var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))',
  },
  danger: {
    label: '위험',
    fill: 'var(--viewer-danger, var(--color-semantic-status-negative-foreground))',
  },
};

// Knockout hazard glyphs, painted white on the severity-colored pin badge.
// `stairs` is Material Symbols (Google, Apache 2.0) rounded fill `stairs_2` —
// the unboxed solid staircase — embedded verbatim (viewBox 0 -960 960 960).
// `ramp` reuses the LDS incline silhouette from _FacilityGlyph so the same
// physical slope reads as the same object whether a product classifies it as a
// traversable facility or as a hazard. `dropoff` is LDS-authored on the same
// 960 grid (Material Symbols has no ledge/fall glyph): a one-step edge profile
// with a falling arrow over the lower level — deliberately a single step so it
// stays distinct from the multi-step stairs zigzag at badge size. `obstacle`
// is an LDS traffic-cone silhouette — the operational symbol for a physical
// obstruction; Material Symbols' closest fills (fence, dangerous) read as a
// mushy grid and as a prohibition X at badge size. See
// docs/references/ATTRIBUTIONS.md. FIT recenters the 960u artwork (center
// 480,-480) onto the pin-head origin and scales it to the ~21px badge slot.
const HAZARD_GLYPHS = {
  stairs: 'M120-200q-17 0-28.5-11.5T80-240q0-17 11.5-28.5T120-280h200v-200q0-17 11.5-28.5T360-520h200v-200q0-17 11.5-28.5T600-760h240q17 0 28.5 11.5T880-720q0 17-11.5 28.5T840-680H640v200q0 17-11.5 28.5T600-440H400v200q0 17-11.5 28.5T360-200H120Z',
  ramp: FACILITY_GLYPH_PATHS.ramp,
  dropoff: 'M140-660H460V-320H820V-240H380V-580H140Z M620-760H700V-520H780L660-380L540-520H620Z',
  obstacle: 'M430-760H530L630-360H330Z M240-320H720V-240H240Z',
};
const GLYPH_FIT = 'scale(0.016) translate(-480 480)';

// The same map-pin silhouette as FacilityTransition, so hazards read as part of
// the one marker family; what marks them as "avoid" is the severity fill
// (cautionary/negative instead of the facility accent), the hazard glyph, and
// the accessible name — not a competing shape. Shared by the fill AND the
// focus/selection outlines so a selected hazard reads as the same pin.
const PIN_PATH = 'M0 15 Q-6 10 -9.2 5 A10.5 10.5 0 1 1 9.2 5 Q6 10 0 15 Z';

function normalizeViewportScale(value) {
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function accessibleName(hazard, severity, { selected, focused, disabled }) {
  const kind = KIND_LABELS[hazard.kind] || hazard.kind;
  return [
    hazard.label,
    `지도 ${hazard.mapId}`,
    `${kind} 위험`,
    `심각도 ${severity.label}`,
    selected && '선택됨',
    focused && '포커스됨',
    disabled && '선택할 수 없음',
  ].filter(Boolean).join(', ');
}

/**
 * LK Robotics Extension — renderer reference for one point hazard the AGV must
 * avoid (stairs, and future drop-offs / obstacles). It visualizes product-owned
 * classification and never plans avoidance or issues a command.
 *
 * Returns an SVG `g` fragment: the owning map supplies the root, world
 * transform, clipping, and named semantic mirror. Not a transition — facility
 * passages the AGV *uses* are `FacilityTransition`; broad keep-out *areas* are
 * `SpatialRegion`.
 */
export function HazardMarker({
  hazard,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  onActivate,
  role,
  tabIndex,
  onFocus,
  onBlur,
  onMouseDown,
  style,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  ...rest
}) {
  const [hasDomFocus, setHasDomFocus] = React.useState(false);
  const obstacle = useNavigationObstacles();
  const scale = normalizeViewportScale(viewportScale);
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === 'function';
  const pointerOnly = ariaHidden === true || ariaHidden === 'true';
  const focusVisible = !pointerOnly && (focused || hasDomFocus);
  const severity = SEVERITY_PRESENTATION[hazard.severity] ?? SEVERITY_PRESENTATION.caution;
  const glyph = HAZARD_GLYPHS[hazard.kind] ?? HAZARD_GLYPHS.stairs;
  const surface = 'var(--viewer-surface-elevated, var(--color-semantic-static-white))';
  const label = ariaLabel ?? accessibleName(hazard, severity, { selected, focused: focusVisible, disabled });

  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(hazard.id, event);
  };

  const handleKeyDown = (event) => {
    if (!pointerOnly) setHasDomFocus(true);
    if (pointerOnly || disabled || !interactive || event.repeat) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(event);
  };

  return (
    <g
      {...rest}
      data-lds-hazard-marker=""
      data-hazard-id={hazard.id}
      data-hazard-kind={hazard.kind}
      data-hazard-severity={hazard.severity}
      data-map-id={hazard.mapId}
      data-selected={selected ? 'true' : 'false'}
      data-focused={focusVisible ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      transform={`translate(${hazard.position.x} ${hazard.position.y})`}
      role={pointerOnly ? undefined : role ?? (interactive ? 'button' : 'img')}
      tabIndex={pointerOnly ? undefined : interactive ? (disabled ? -1 : tabIndex ?? 0) : tabIndex}
      focusable={pointerOnly ? 'false' : interactive && !disabled ? 'true' : undefined}
      aria-hidden={pointerOnly || undefined}
      aria-label={pointerOnly ? undefined : label}
      aria-pressed={!pointerOnly && interactive ? selected : undefined}
      aria-disabled={!pointerOnly && interactive && disabled ? true : undefined}
      aria-invalid={!pointerOnly && invalid ? true : undefined}
      data-invalid={invalid ? 'true' : 'false'}
      data-stale={stale ? 'true' : 'false'}
      onClick={activate}
      onKeyDown={handleKeyDown}
      onMouseDown={(event) => {
        if (pointerOnly) event.preventDefault();
        onMouseDown?.(event);
      }}
      onFocus={(event) => {
        if (!pointerOnly) setHasDomFocus(isFocusVisibleTarget(event.currentTarget));
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setHasDomFocus(false);
        onBlur?.(event);
      }}
      style={{
        cursor: disabled ? 'not-allowed' : interactive ? 'pointer' : 'default',
        opacity: disabled ? 0.45 : stale ? 0.76 : 1,
        outline: 'none',
        ...style,
      }}
    >
      <g data-hazard-screen-space="" data-viewport-scale={scale} transform={`scale(${inverseScale})`}>
        {/* Cast shadow + focus/selection outlines all trace the SAME pin
            silhouette (shared with FacilityTransition), so every state reads as
            one marker instead of a pin ringed by a mismatched circle. */}
        <path d={PIN_PATH} transform="translate(0 0.8)" fill="var(--color-semantic-static-black)" opacity="0.16" pointerEvents="none" data-hazard-shadow="" />
        {focusVisible && (
          <path d={PIN_PATH} transform="scale(1.34)" fill="none" stroke="var(--color-semantic-focus-indicator)" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" pointerEvents="none" data-hazard-focus-ring="" />
        )}
        {selected && (
          <path d={PIN_PATH} transform="scale(1.16)" fill="none" stroke="var(--viewer-accent, var(--color-semantic-primary-normal))" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" pointerEvents="none" data-hazard-selection-ring="" />
        )}
        {/* WCAG 2.2 minimum target: a transparent 24px-equivalent hit circle in
            screen space, wider than the pin. */}
        <circle r="17" fill="transparent" stroke="none" pointerEvents={interactive ? 'all' : 'none'} data-hazard-hit-area="" data-screen-target-size="24" />
        <path
          {...obstacle(`hazard:${hazard.id}:sign`)}
          d={PIN_PATH}
          fill={severity.fill}
          vectorEffect="non-scaling-stroke"
          data-hazard-sign=""
        />
        <g fill={surface} pointerEvents="none" transform={GLYPH_FIT} data-hazard-glyph="">
          <path d={glyph} />
        </g>

        {showLabel && (
          <NavigationAnnotationBlock
            id={`hazard:${hazard.id}:label`}
            kind="hazard-label"
            anchor={hazard.position}
            priority={annotationPriority({ selected, focused: focusVisible, alarm: hazard.severity === 'danger' })}
          >
            <text
              x="20"
              y="-8"
              textAnchor="start"
              fill="var(--viewer-foreground, var(--color-semantic-label-strong))"
              stroke="var(--viewer-surface, var(--color-semantic-background-normal-normal))"
              strokeWidth="4"
              paintOrder="stroke"
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
              data-hazard-label=""
              style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)' }}
            >
              {hazard.label} · {severity.label}
            </text>
          </NavigationAnnotationBlock>
        )}
      </g>
    </g>
  );
}
