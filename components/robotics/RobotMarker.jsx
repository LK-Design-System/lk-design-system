import React from 'react';
import { isFocusVisibleTarget } from './_NavigationFocus.js';
import { NavigationStateGlyph } from './_NavigationStateGlyph.js';
import { NAV_ROBOT_POSE } from './_navigationVectorGlyph.js';
import { NavigationAnnotationBlock, annotationPriority, useNavigationObstacles } from './_navigationAnnotations.js';
import { navStateOpacity, NAV_DASH, NAV_HIT, NAV_LABEL_HALO, NAV_FOCUS, NAV_MARKER_SHADOW } from './_navigationVocabulary.js';

// Korean accessible-name copy to match every sibling navigation overlay
// (Waypoint / Lane / Region / Route / Trajectory / Facility) — a Korean-first
// map must not announce mixed-language part names (WCAG 3.1.2).
const HEADING_LABELS = ['동쪽', '북동쪽', '북쪽', '북서쪽', '서쪽', '남서쪽', '남쪽', '남동쪽'];

function normalizeViewportScale(value) {
  return Number.isFinite(value) && value > 0 ? value : 1;
}

// SVG space is y-down, so 0 rad points +x (동/right) and a positive heading
// turns clockwise — the same convention every sibling tangent uses.
function headingCompass(headingRad) {
  if (!Number.isFinite(headingRad)) return undefined;
  const octant = ((Math.round((-headingRad) / (Math.PI / 4)) % 8) + 8) % 8;
  return HEADING_LABELS[octant];
}

function accessibleName(pose, { selected, focused, disabled, invalid, stale }) {
  const compass = headingCompass(pose.headingRad);
  return [
    pose.label ?? `로봇 ${pose.id}`,
    `지도 ${pose.mapId}`,
    compass && `방향 ${compass}`,
    invalid ? '데이터 오류' : stale ? '오래된 데이터' : '실시간 위치',
    selected && '선택됨',
    focused && '포커스됨',
    disabled && '선택할 수 없음',
  ].filter(Boolean).join(', ');
}

/**
 * LK Robotics Extension — renderer reference for one robot's live pose
 * (position + heading). The owning map supplies the SVG root, world transform,
 * and semantic mirror. This renderer OWNS robot bearing/pose/footprint — the
 * concept every navigation overlay defers to it — and never encodes lane
 * topology, route progress, or facility state.
 */
export function RobotMarker({
  pose,
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

  if (!pose || !Number.isFinite(pose.position?.x) || !Number.isFinite(pose.position?.y)) return null;

  const hasHeading = Number.isFinite(pose.headingRad);
  const headingDeg = hasHeading ? pose.headingRad * 180 / Math.PI : 0;
  const footprintRadius = Number.isFinite(pose.footprintRadius) && pose.footprintRadius > 0
    ? pose.footprintRadius
    : undefined;

  const surface = 'var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))';
  const foreground = 'var(--viewer-foreground, var(--color-semantic-label-strong))';
  const muted = 'var(--viewer-muted, var(--color-semantic-label-neutral))';
  const accent = 'var(--viewer-accent, var(--color-semantic-primary-normal))';
  const danger = 'var(--viewer-danger, var(--color-semantic-status-negative-foreground))';
  // Body tone conveys liveness only; heading and identity carry the rest.
  const bodyColor = invalid ? danger : stale ? muted : accent;

  const label = ariaLabel ?? accessibleName(pose, {
    selected,
    focused: focusVisible,
    disabled,
    invalid,
    stale,
  });

  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(pose.id, event);
  };

  const handleKeyDown = (event) => {
    if (!pointerOnly) setHasDomFocus(true);
    if (pointerOnly || disabled || !interactive || event.repeat) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(event);
  };

  // The round body + heading nose paint as one silhouette: a surface casing
  // halo underneath, the body tone on top. Rotated by heading; the circle is
  // symmetric so rotating the whole silhouette only orients the nose.
  const silhouette = (fill, strokeProps) => (
    <>
      {hasHeading && (
        <path
          d={NAV_ROBOT_POSE.nosePath}
          fill={fill}
          strokeLinejoin="round"
          {...strokeProps}
        />
      )}
      <circle r={NAV_ROBOT_POSE.bodyRadius} fill={fill} {...strokeProps} />
    </>
  );

  return (
    <g
      {...rest}
      data-robot-marker=""
      data-robot-id={pose.id}
      data-map-id={pose.mapId}
      data-has-heading={hasHeading ? 'true' : 'false'}
      data-heading-deg={hasHeading ? headingDeg : undefined}
      data-viewport-scale={scale}
      data-selected={selected ? 'true' : 'false'}
      data-focused={focusVisible ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-invalid={invalid ? 'true' : 'false'}
      data-stale={stale ? 'true' : 'false'}
      transform={`translate(${pose.position.x} ${pose.position.y})`}
      role={pointerOnly ? undefined : role ?? (interactive ? 'button' : 'img')}
      tabIndex={pointerOnly ? undefined : interactive ? (disabled ? -1 : tabIndex ?? 0) : tabIndex}
      focusable={pointerOnly ? 'false' : interactive && !disabled ? 'true' : undefined}
      aria-hidden={pointerOnly || undefined}
      aria-label={pointerOnly ? undefined : label}
      aria-pressed={!pointerOnly && interactive ? selected : undefined}
      aria-disabled={!pointerOnly && interactive && disabled ? true : undefined}
      aria-invalid={!pointerOnly && invalid ? true : undefined}
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
        opacity: navStateOpacity(disabled, stale),
        outline: 'none',
        ...style,
      }}
    >
      {/*
        World-space footprint: the robot's physical extent in map units, so it
        grows with zoom (unlike the screen-fixed body). Drawn under everything.
      */}
      {footprintRadius && (
        <circle
          data-robot-footprint=""
          r={footprintRadius}
          fill={bodyColor}
          opacity={NAV_ROBOT_POSE.footprintOpacity}
          stroke={bodyColor}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}

      <g
        data-robot-screen-space=""
        transform={`scale(${inverseScale})`}
      >
        {/*
          WCAG 2.2 target: a transparent screen-px hit circle. r=17.5 contains a
          24×24 CSS px square with rendering tolerance.
        */}
        <circle
          data-robot-hit-area=""
          data-screen-target-size={NAV_HIT.screenTargetSize}
          r={NAV_HIT.radius}
          fill="transparent"
          pointerEvents={interactive ? 'all' : 'none'}
        />

        {/*
          Shared marker cast shadow: the body silhouette shifted straight down
          in screen space — the offset stays OUTSIDE the heading rotation so
          the shadow always falls downward regardless of bearing.
        */}
        <g
          data-robot-shadow=""
          transform={`translate(0 ${NAV_MARKER_SHADOW.chipOffsetY})`}
          opacity={NAV_MARKER_SHADOW.opacity}
          pointerEvents="none"
        >
          <g transform={`rotate(${headingDeg})`}>
            {silhouette(NAV_MARKER_SHADOW.fill, {})}
          </g>
        </g>

        {stale && (
          <circle
            data-robot-stale-indicator=""
            r={NAV_ROBOT_POSE.bodyRadius + 3.5}
            fill="none"
            stroke={muted}
            strokeWidth="1.5"
            strokeDasharray={NAV_DASH.staleRing}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/*
          Focus traces the robot's OWN silhouette scaled OUT; selection hugs it
          tighter IN. Two independent axes (§2.5), focus always outside.
        */}
        {focusVisible && (
          <g
            data-robot-focus-indicator=""
            transform={`rotate(${headingDeg}) scale(${NAV_ROBOT_POSE.focusScale})`}
          >
            {silhouette('none', {
              stroke: 'var(--color-semantic-focus-indicator)',
              strokeWidth: NAV_FOCUS.strokeWidth,
              vectorEffect: 'non-scaling-stroke',
            })}
          </g>
        )}
        {selected && (
          <g
            data-robot-selected-indicator=""
            transform={`rotate(${headingDeg}) scale(${NAV_ROBOT_POSE.selectionRingScale})`}
          >
            {silhouette('none', {
              stroke: accent,
              strokeWidth: '2',
              vectorEffect: 'non-scaling-stroke',
            })}
          </g>
        )}

        <g
          {...obstacle(`robot:${pose.id}:body`)}
          data-robot-body=""
          transform={`rotate(${headingDeg})`}
        >
          {/* Casing halo: surface silhouette bloated by the casing stroke. */}
          {silhouette(surface, {
            stroke: surface,
            strokeWidth: NAV_ROBOT_POSE.casingWidth * 2,
            vectorEffect: 'non-scaling-stroke',
          })}
          {/* Body tone on top; the last circle covers the nose base seam. */}
          {silhouette(bodyColor, {})}
        </g>

        {invalid && (
          <g
            data-robot-invalid-indicator=""
            aria-hidden="true"
          >
            <NavigationStateGlyph
              kind="invalid"
              size={10}
              color="var(--color-semantic-static-white)"
              data-robot-state-glyph-geometry="invalid"
            />
          </g>
        )}

        {showLabel && (pose.label || pose.id) && (
          <NavigationAnnotationBlock
            id={`robot:${pose.id}:label`}
            kind="robot-label"
            anchor={pose.position}
            priority={annotationPriority({
              selected,
              focused: focusVisible,
              alarm: invalid,
              emphasized: true,
            })}
          >
            <g data-robot-label="" data-robot-label-offset-x="15" pointerEvents="none" aria-hidden="true">
              <text
                data-robot-primary-label=""
                x="15"
                y="3.5"
                fill={foreground}
                stroke={surface}
                strokeWidth={NAV_LABEL_HALO.primary}
                strokeLinejoin="round"
                paintOrder="stroke"
                vectorEffect="non-scaling-stroke"
                fontFamily="var(--font-sans)"
                fontSize="var(--label2-size)"
                fontWeight="var(--fw-bold)"
              >
                {pose.label ?? `로봇 ${pose.id}`}
              </text>
            </g>
          </NavigationAnnotationBlock>
        )}
      </g>
    </g>
  );
}
