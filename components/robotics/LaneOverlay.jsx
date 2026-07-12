import React from 'react';

const AVAILABILITY_LABEL = {
  available: '통행 가능',
  closed: '폐쇄',
  unknown: '상태 미확인',
};

function finitePoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y);
}

function pathFromPoints(points) {
  if (points.length < 2) return '';
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function pointAlong(points, ratio) {
  if (points.length === 0) return { x: 0, y: 0, angle: 0 };
  if (points.length === 1) return { ...points[0], angle: 0 };

  const lengths = [];
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    lengths.push(length);
    total += length;
  }

  if (total === 0) return { ...points[0], angle: 0 };
  let remaining = total * Math.max(0, Math.min(1, ratio));
  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index];
    const start = points[index];
    const end = points[index + 1];
    if (remaining <= length || index === lengths.length - 1) {
      const localRatio = length === 0 ? 0 : remaining / length;
      return {
        x: start.x + (end.x - start.x) * localRatio,
        y: start.y + (end.y - start.y) * localRatio,
        angle: Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI,
      };
    }
    remaining -= length;
  }

  return { ...points[points.length - 1], angle: 0 };
}

function orientationAngle(orientation, fallbackAngle) {
  if (!orientation || orientation === 'unconstrained') return undefined;
  if (orientation === 'backward') return fallbackAngle + 180;
  return fallbackAngle;
}

function laneAccessibleName(lane, availability, conflict, selected, invalid, stale) {
  const entryName = lane.entry?.waypointId ?? '진입점';
  const exitName = lane.exit?.waypointId ?? '이탈점';
  const parts = [
    lane.label ?? `레인 ${lane.id}`,
    `${entryName}에서 ${exitName} 방향`,
    AVAILABILITY_LABEL[availability],
  ];
  if (lane.relation?.kind === 'paired') parts.push(`반대 방향 레인 ${lane.relation.pairedLaneId}와 쌍`);
  if (lane.speedLimitMps != null) parts.push(`속도 제한 ${lane.speedLimitMps} m/s`);
  if (lane.mutexGroupId) parts.push(`상호 배제 그룹 ${lane.mutexGroupId}`);
  if (lane.entry?.transitionIds?.length) parts.push(`진입 전환 ${lane.entry.transitionIds.join(', ')}`);
  if (lane.exit?.transitionIds?.length) parts.push(`이탈 전환 ${lane.exit.transitionIds.join(', ')}`);
  if (conflict) parts.push('충돌 있음');
  if (selected) parts.push('선택됨');
  if (invalid) parts.push('데이터 오류');
  if (stale) parts.push('오래된 데이터');
  return parts.join(', ');
}

function endpointMarker(point, endpoint, kind, fallbackAngle, inverseScale) {
  if (!point || !endpoint) return null;
  const orientation = orientationAngle(endpoint.orientation, fallbackAngle);
  const transitionCount = endpoint.transitionIds?.length ?? 0;
  const markerLabel = kind === 'entry' ? '진입' : '이탈';

  return (
    <g
      key={kind}
      data-lane-endpoint={kind}
      data-waypoint-id={endpoint.waypointId ?? undefined}
      transform={`translate(${point.x} ${point.y}) scale(${inverseScale})`}
      aria-hidden="true"
      pointerEvents="none"
    >
      <circle
        r="4"
        fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
        stroke="var(--viewer-muted, var(--color-semantic-label-neutral))"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <text
        x="0"
        y="-7"
        textAnchor="middle"
        fill="var(--viewer-muted, var(--color-semantic-label-neutral))"
        fontFamily="var(--font-sans)"
        fontSize="7"
        fontWeight="var(--fw-bold)"
      >
        {markerLabel}
      </text>
      {transitionCount > 0 && (
        <g data-lane-transition-count={transitionCount} transform="translate(0 11)">
          <circle
            r="6"
            fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
            stroke="var(--viewer-muted, var(--color-semantic-label-neutral))"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x="0"
            y="2.5"
            textAnchor="middle"
            fill="var(--viewer-foreground, var(--color-semantic-label-strong))"
            fontFamily="var(--font-sans)"
            fontSize="7"
            fontWeight="var(--fw-bold)"
          >
            T{transitionCount}
          </text>
        </g>
      )}
      {orientation != null && (
        <path
          data-lane-orientation={endpoint.orientation}
          d="M -5 0 H 5 M 2 -3 L 5 0 L 2 3"
          transform={`rotate(${orientation}) translate(10 0)`}
          fill="none"
          stroke="var(--viewer-foreground, var(--color-semantic-label-strong))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </g>
  );
}

/** Renderer-neutral SVG fragment for one directed robotics navigation lane. */
export function LaneOverlay({
  lane,
  availability = 'available',
  conflict = false,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  onActivate,
  'aria-label': ariaLabel,
  tabIndex,
  onFocus,
  onBlur,
  style,
  ...rest
}) {
  const [hasFocus, setHasFocus] = React.useState(false);
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const inverseScale = 1 / scale;
  const resolvedAvailability = ['available', 'closed', 'unknown'].includes(availability)
    ? availability
    : 'available';
  const hasConflict = Boolean(conflict);
  const points = (lane?.points ?? []).filter(finitePoint);
  const pathData = pathFromPoints(points);
  const midpoint = pointAlong(points, 0.5);
  const directionPoint = pointAlong(points, 0.64);
  const entryDirection = pointAlong(points.slice(0, 2), 0.5).angle;
  const exitDirection = pointAlong(points.slice(-2), 0.5).angle;
  const interactive = typeof onActivate === 'function';
  const visibleFocus = focused || hasFocus;
  const relation = lane?.relation?.kind === 'paired' ? 'paired' : 'single';

  const availabilityDash = resolvedAvailability === 'closed'
    ? '8 5'
    : resolvedAvailability === 'unknown'
      ? '2 5'
      : undefined;
  const baseColor = invalid
    ? 'var(--color-semantic-status-negative-foreground)'
    : resolvedAvailability === 'available'
      ? 'var(--color-semantic-primary-normal)'
      : 'var(--viewer-muted, var(--color-semantic-label-alternative))';
  const stateGlyphs = [
    resolvedAvailability === 'closed' ? { glyph: '×', ratio: hasConflict ? 0.43 : 0.5, tone: 'var(--viewer-foreground, var(--color-semantic-label-strong))' } : null,
    resolvedAvailability === 'unknown' ? { glyph: '?', ratio: hasConflict ? 0.43 : 0.5, tone: 'var(--viewer-foreground, var(--color-semantic-label-strong))' } : null,
    hasConflict ? { glyph: '!', ratio: resolvedAvailability === 'available' ? 0.5 : 0.57, tone: 'var(--color-semantic-status-negative-text)' } : null,
    invalid ? { glyph: '!', ratio: 0.33, tone: 'var(--color-semantic-status-negative-text)' } : null,
    stale ? { glyph: '~', ratio: 0.72, tone: 'var(--viewer-muted, var(--color-semantic-label-alternative))' } : null,
  ].filter(Boolean);
  const metadata = [
    lane?.speedLimitMps != null
      ? `≤ ${lane.speedLimitMps} m/s`
      : null,
    lane?.mutexGroupId ? `mutex ${lane.mutexGroupId}` : null,
  ].filter(Boolean).join(' · ');

  const activate = (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onActivate?.(lane.id, event);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(event);
  };

  return (
    <g
      {...rest}
      data-lk-lane-overlay=""
      data-lane-id={lane?.id}
      data-map-id={lane?.mapId}
      data-availability={resolvedAvailability}
      data-conflict={hasConflict ? 'true' : 'false'}
      data-relation={relation}
      data-paired-lane-id={lane?.relation?.kind === 'paired' ? lane.relation.pairedLaneId : undefined}
      data-selected={selected ? 'true' : 'false'}
      data-focused={visibleFocus ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-invalid={invalid ? 'true' : 'false'}
      data-stale={stale ? 'true' : 'false'}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? (disabled ? -1 : tabIndex ?? 0) : tabIndex}
      focusable={interactive ? 'true' : undefined}
      aria-label={ariaLabel ?? laneAccessibleName(lane, resolvedAvailability, hasConflict, selected, invalid, stale)}
      aria-pressed={interactive ? selected : undefined}
      aria-disabled={interactive && disabled ? true : undefined}
      aria-invalid={invalid || undefined}
      onClick={interactive ? activate : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      onFocus={(event) => {
        setHasFocus(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setHasFocus(false);
        onBlur?.(event);
      }}
      style={{
        cursor: disabled ? 'not-allowed' : interactive ? 'pointer' : 'default',
        opacity: disabled ? 0.42 : stale ? 0.7 : 1,
        outline: 'none',
        ...style,
      }}
    >
      {visibleFocus && pathData && (
        <path
          data-lane-focus-ring=""
          d={pathData}
          fill="none"
          stroke="var(--color-semantic-focus-indicator)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}
      {selected && pathData && (
        <path
          data-lane-selection-halo=""
          d={pathData}
          fill="none"
          stroke="var(--color-semantic-primary-normal)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.24"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}
      {pathData && (
        <path
          data-lane-path=""
          d={pathData}
          fill="none"
          stroke={baseColor}
          strokeWidth={selected ? 3.5 : 2.5}
          strokeDasharray={availabilityDash}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}
      {hasConflict && pathData && (
        <path
          data-lane-conflict-pattern=""
          d={pathData}
          fill="none"
          stroke="var(--color-semantic-status-negative-foreground)"
          strokeWidth="2"
          strokeDasharray="2 7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}
      {pathData && interactive && (
        <path
          data-lane-hit-target=""
          data-screen-target-size="24"
          d={pathData}
          fill="none"
          stroke="transparent"
          strokeWidth="24"
          vectorEffect="non-scaling-stroke"
          pointerEvents="stroke"
        />
      )}
      {pathData && (
        <path
          data-lane-direction="entry-to-exit"
          d="M -5 -4 L 5 0 L -5 4 Z"
          transform={`translate(${directionPoint.x} ${directionPoint.y}) rotate(${directionPoint.angle}) scale(${inverseScale})`}
          fill={baseColor}
          stroke="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
          strokeWidth="1"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}
      {endpointMarker(points[0], lane?.entry, 'entry', entryDirection, inverseScale)}
      {endpointMarker(points[points.length - 1], lane?.exit, 'exit', exitDirection, inverseScale)}
      {stateGlyphs.map((state, index) => {
        const point = pointAlong(points, state.ratio);
        return (
          <g
            key={`${state.glyph}-${index}`}
            data-lane-state-glyph={state.glyph}
            transform={`translate(${point.x} ${point.y}) scale(${inverseScale})`}
            aria-hidden="true"
            pointerEvents="none"
          >
            <circle
              r="7"
              fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
              stroke={state.tone}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill={state.tone}
              fontFamily="var(--font-sans)"
              fontSize="10"
              fontWeight="var(--fw-bold)"
            >
              {state.glyph}
            </text>
          </g>
        );
      })}
      {showLabel && (lane?.label || metadata) && (
        <g
          data-lane-label=""
          transform={`translate(${midpoint.x} ${midpoint.y}) scale(${inverseScale})`}
          aria-hidden="true"
          pointerEvents="none"
        >
          {lane?.label && (
            <text
              x="0"
              y="-12"
              textAnchor="middle"
              fill="var(--viewer-foreground, var(--color-semantic-label-strong))"
              fontFamily="var(--font-sans)"
              fontSize="10"
              fontWeight="var(--fw-bold)"
            >
              {lane.label}
            </text>
          )}
          {metadata && (
            <text
              x="0"
              y={lane?.label ? 16 : -10}
              textAnchor="middle"
              fill="var(--viewer-muted, var(--color-semantic-label-neutral))"
              fontFamily="var(--font-sans)"
              fontSize="8"
              fontWeight="var(--fw-semibold)"
            >
              {metadata}
            </text>
          )}
        </g>
      )}
    </g>
  );
}
