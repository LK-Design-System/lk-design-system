import React from 'react';

const STATUS_LABEL = {
  planned: '계획됨',
  active: '이동 중',
  waiting: '대기 중',
  blocked: '차단됨',
  rerouting: '경로 재계산 중',
  completed: '완료됨',
};

const STATUS_GLYPH = {
  planned: '○',
  active: '▶',
  waiting: 'Ⅱ',
  blocked: '×',
  rerouting: '↻',
  completed: '✓',
};

const PHASE_LABEL = {
  completed: '통과 완료',
  current: '현재 구간',
  upcoming: '예정 구간',
};

const CONDITION_LABEL = {
  normal: '정상',
  waiting: '대기',
  blocked: '차단',
  conflict: '충돌',
};

const CONDITION_GLYPH = {
  waiting: 'Ⅱ',
  blocked: '×',
  conflict: '!',
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

function normalizedProgress(route) {
  if (!route?.progress) return undefined;
  return {
    segmentId: route.progress.segmentId,
    fraction: Math.max(0, Math.min(1, Number(route.progress.fraction) || 0)),
    position: finitePoint(route.progress.position) ? route.progress.position : undefined,
  };
}

function statusTone(status) {
  if (status === 'waiting' || status === 'rerouting') return 'var(--color-semantic-status-cautionary-foreground)';
  if (status === 'blocked') return 'var(--color-semantic-status-negative-foreground)';
  if (status === 'completed') return 'var(--color-semantic-status-positive-foreground)';
  if (status === 'active') return 'var(--color-semantic-primary-normal)';
  return 'var(--viewer-muted, var(--color-semantic-label-alternative))';
}

function segmentTone(segment, invalid) {
  if (invalid || segment.condition === 'blocked' || segment.condition === 'conflict') {
    return 'var(--color-semantic-status-negative-foreground)';
  }
  if (segment.condition === 'waiting') return 'var(--color-semantic-status-cautionary-foreground)';
  if (segment.phase === 'completed') return 'var(--color-semantic-status-positive-foreground)';
  if (segment.phase === 'current') return 'var(--color-semantic-primary-normal)';
  return 'var(--viewer-muted, var(--color-semantic-label-alternative))';
}

function segmentDash(segment) {
  if (segment.condition === 'waiting') return '10 3 2 3';
  if (segment.condition === 'blocked') return '1 5';
  if (segment.condition === 'conflict') return '5 3 1 3';
  if (segment.phase === 'completed') return '7 4';
  if (segment.phase === 'upcoming') return '2 6';
  return undefined;
}

function routeAccessibleName(route, progress, selected, invalid, stale) {
  const parts = [
    route.label ?? `경로 ${route.id}`,
    STATUS_LABEL[route.status] ?? route.status,
  ];
  if (progress) parts.push(`현재 구간 ${Math.round(progress.fraction * 100)}%`);
  if (selected) parts.push('선택됨');
  if (invalid) parts.push('데이터 오류');
  if (stale) parts.push('오래된 데이터');
  return parts.join(', ');
}

/** Map-filtered SVG fragments for the graph segments of one planned route. */
export function RouteOverlay({
  route,
  activeMapId,
  selectedSegmentId,
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
  const [focusedSegment, setFocusedSegment] = React.useState(null);
  const [hasRootFocus, setHasRootFocus] = React.useState(false);
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const inverseScale = 1 / scale;
  const progress = normalizedProgress(route);
  const interactive = typeof onActivate === 'function';
  const visibleSegments = (route?.segments ?? []).filter((segment) => segment.mapId === activeMapId);
  const baseAccessibleName = ariaLabel ?? routeAccessibleName(route, progress, selected, invalid, stale);

  const activate = (segmentId, event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onActivate?.({ routeId: route.id, segmentId }, event);
  };

  const handleKeyDown = (segmentId, event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(segmentId, event);
  };

  const progressSegment = progress
    ? visibleSegments.find((segment) => segment.id === progress.segmentId)
    : undefined;
  const statusSegment = progressSegment
    ?? visibleSegments.find((segment) => segment.phase === 'current')
    ?? visibleSegments[0];
  const statusPoints = statusSegment?.points?.filter(finitePoint) ?? [];
  const statusPoint = progressSegment && progress?.position
    ? progress.position
    : pointAlong(statusPoints, progressSegment ? progress.fraction : 0.18);

  return (
    <g
      {...rest}
      data-lk-route-overlay=""
      data-route-id={route?.id}
      data-active-map-id={activeMapId}
      data-route-status={route?.status}
      data-progress-segment-id={progress?.segmentId}
      data-progress-fraction={progress?.fraction}
      data-selected={selected ? 'true' : 'false'}
      data-focused={focused || hasRootFocus || focusedSegment != null ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-invalid={invalid ? 'true' : 'false'}
      data-stale={stale ? 'true' : 'false'}
      role={interactive ? 'group' : 'img'}
      tabIndex={!interactive ? tabIndex : undefined}
      focusable={!interactive && tabIndex != null ? 'true' : undefined}
      aria-label={baseAccessibleName}
      aria-disabled={interactive && disabled ? true : undefined}
      aria-invalid={invalid || undefined}
      onFocus={!interactive ? (event) => {
        setHasRootFocus(true);
        onFocus?.(event);
      } : undefined}
      onBlur={!interactive ? (event) => {
        setHasRootFocus(false);
        onBlur?.(event);
      } : undefined}
      style={{ opacity: disabled ? 0.42 : stale ? 0.7 : 1, outline: 'none', ...style }}
    >
      {visibleSegments.map((segment) => {
        const points = (segment.points ?? []).filter(finitePoint);
        const pathData = pathFromPoints(points);
        const midpoint = pointAlong(points, 0.5);
        const directionPoint = pointAlong(points, 0.7);
        const segmentSelected = selected || segment.id === selectedSegmentId;
        const segmentFocused = focused || hasRootFocus || focusedSegment === segment.id;
        const condition = ['normal', 'waiting', 'blocked', 'conflict'].includes(segment.condition)
          ? segment.condition
          : 'normal';
        const phase = ['completed', 'current', 'upcoming'].includes(segment.phase)
          ? segment.phase
          : 'upcoming';
        const normalizedSegment = { ...segment, condition, phase };
        const tone = segmentTone(normalizedSegment, invalid);
        const dash = segmentDash(normalizedSegment);
        const conditionGlyph = CONDITION_GLYPH[condition];
        const segmentName = [
          segment.label ?? `구간 ${segment.id}`,
          PHASE_LABEL[phase],
          CONDITION_LABEL[condition],
          segment.laneIds?.length ? `graph lane ${segment.laneIds.length}개` : null,
          segment.entryTransitionId ? `진입 전환 ${segment.entryTransitionId}` : null,
          segment.exitTransitionId ? `이탈 전환 ${segment.exitTransitionId}` : null,
        ].filter(Boolean).join(', ');

        return (
          <g
            key={segment.id}
            data-route-segment=""
            data-segment-id={segment.id}
            data-map-id={segment.mapId}
            data-phase={phase}
            data-condition={condition}
            data-selected={segmentSelected ? 'true' : 'false'}
            data-focused={segmentFocused ? 'true' : 'false'}
            data-disabled={disabled ? 'true' : 'false'}
            data-invalid={invalid ? 'true' : 'false'}
            data-stale={stale ? 'true' : 'false'}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? (disabled ? -1 : tabIndex ?? 0) : undefined}
            focusable={interactive ? 'true' : undefined}
            aria-label={interactive ? `${baseAccessibleName}, ${segmentName}` : undefined}
            aria-pressed={interactive ? segmentSelected : undefined}
            aria-disabled={interactive && disabled ? true : undefined}
            aria-invalid={invalid || undefined}
            onClick={interactive ? (event) => activate(segment.id, event) : undefined}
            onKeyDown={interactive ? (event) => handleKeyDown(segment.id, event) : undefined}
            onFocus={(event) => {
              setFocusedSegment(segment.id);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocusedSegment((current) => current === segment.id ? null : current);
              onBlur?.(event);
            }}
            style={{ cursor: interactive && !disabled ? 'pointer' : 'default' }}
          >
            {segmentFocused && pathData && (
              <path
                data-route-focus-ring=""
                d={pathData}
                fill="none"
                stroke="var(--color-semantic-focus-indicator)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
            )}
            {segmentSelected && pathData && (
              <path
                data-route-selection-halo=""
                d={pathData}
                fill="none"
                stroke="var(--color-semantic-primary-normal)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.24"
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
            )}
            {pathData && (
              <path
                data-route-path=""
                d={pathData}
                fill="none"
                stroke={tone}
                strokeWidth={phase === 'current' || segmentSelected ? 4 : 3}
                strokeDasharray={dash}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
            )}
            {pathData && interactive && (
              <>
                <path
                  data-route-hit-target=""
                  data-screen-target-size="24"
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="24"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="stroke"
                />
                <circle
                  data-route-hit-target-core=""
                  data-screen-target-size="24"
                  cx={midpoint.x}
                  cy={midpoint.y}
                  r={17 * inverseScale}
                  fill="transparent"
                  pointerEvents="all"
                />
              </>
            )}
            {pathData && (
              <path
                data-route-direction=""
                d="M -5 -4 L 5 0 L -5 4 Z"
                transform={`translate(${directionPoint.x} ${directionPoint.y}) rotate(${directionPoint.angle}) scale(${inverseScale})`}
                fill={tone}
                stroke="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
                strokeWidth="1"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
            )}
            {conditionGlyph && (
              <g
                data-route-condition-glyph={condition}
                transform={`translate(${midpoint.x} ${midpoint.y}) scale(${inverseScale})`}
                aria-hidden="true"
                pointerEvents="none"
              >
                <circle
                  r="7"
                  fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
                  stroke={tone}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <text x="0" y="3" textAnchor="middle" fill={tone} fontFamily="var(--font-sans)" fontSize="10" fontWeight="var(--fw-bold)">
                  {conditionGlyph}
                </text>
              </g>
            )}
            {[
              segment.entryTransitionId && points[0] ? { kind: 'entry', id: segment.entryTransitionId, point: points[0] } : null,
              segment.exitTransitionId && points[points.length - 1] ? { kind: 'exit', id: segment.exitTransitionId, point: points[points.length - 1] } : null,
            ].filter(Boolean).map((transition) => (
              <g
                key={transition.kind}
                data-route-transition={transition.kind}
                data-transition-id={transition.id}
                transform={`translate(${transition.point.x} ${transition.point.y}) scale(${inverseScale})`}
                aria-hidden="true"
                pointerEvents="none"
              >
                <circle
                  r="6"
                  fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
                  stroke="var(--viewer-muted, var(--color-semantic-label-neutral))"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <text x="0" y="2.5" textAnchor="middle" fill="var(--viewer-foreground, var(--color-semantic-label-strong))" fontFamily="var(--font-sans)" fontSize="7" fontWeight="var(--fw-bold)">
                  T
                </text>
              </g>
            ))}
            {showLabel && segment.label && (
              <text
                data-route-segment-label=""
                x="0"
                y="-12"
                textAnchor="middle"
                transform={`translate(${midpoint.x} ${midpoint.y}) scale(${inverseScale})`}
                fill="var(--viewer-foreground, var(--color-semantic-label-strong))"
                fontFamily="var(--font-sans)"
                fontSize="9"
                fontWeight="var(--fw-semibold)"
                aria-hidden="true"
                pointerEvents="none"
              >
                {segment.label}
              </text>
            )}
          </g>
        );
      })}
      {statusPoints.length >= 2 && [
        invalid ? { state: 'invalid', glyph: '!', ratio: 0.82, tone: 'var(--color-semantic-status-negative-foreground)' } : null,
        stale ? { state: 'stale', glyph: '~', ratio: invalid ? 0.9 : 0.82, tone: 'var(--viewer-muted, var(--color-semantic-label-alternative))' } : null,
      ].filter(Boolean).map((item) => {
        const point = pointAlong(statusPoints, item.ratio);
        return (
          <g
            key={item.state}
            data-route-overlay-state={item.state}
            transform={`translate(${point.x} ${point.y}) scale(${inverseScale})`}
            aria-hidden="true"
            pointerEvents="none"
          >
            <circle
              r="7"
              fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
              stroke={item.tone}
              strokeWidth="1.5"
              strokeDasharray={item.state === 'stale' ? '2 2' : undefined}
              vectorEffect="non-scaling-stroke"
            />
            <text x="0" y="3" textAnchor="middle" fill={item.tone} fontFamily="var(--font-sans)" fontSize="10" fontWeight="var(--fw-bold)">
              {item.glyph}
            </text>
          </g>
        );
      })}
      {progressSegment && statusPoints.length >= 2 && (
        <g
          data-route-progress-marker=""
          data-current-segment-id={progressSegment.id}
          transform={`translate(${statusPoint.x} ${statusPoint.y}) scale(${inverseScale})`}
          aria-hidden="true"
          pointerEvents="none"
        >
          <circle
            r="8"
            fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
            stroke={statusTone(route.status)}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fill={statusTone(route.status)}
            fontFamily="var(--font-sans)"
            fontSize="9"
            fontWeight="var(--fw-bold)"
          >
            {STATUS_GLYPH[route.status] ?? '•'}
          </text>
          {showLabel && (
            <text
              x="0"
              y="19"
              textAnchor="middle"
              fill="var(--viewer-foreground, var(--color-semantic-label-strong))"
              fontFamily="var(--font-sans)"
              fontSize="9"
              fontWeight="var(--fw-bold)"
            >
              현재 {Math.round(progress.fraction * 100)}%
            </text>
          )}
        </g>
      )}
      {!progressSegment && statusSegment && statusPoints.length >= 2 && (
        <g
          data-route-status-marker=""
          transform={`translate(${statusPoint.x} ${statusPoint.y}) scale(${inverseScale})`}
          aria-hidden="true"
          pointerEvents="none"
        >
          <circle
            r="8"
            fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
            stroke={statusTone(route.status)}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <text x="0" y="3" textAnchor="middle" fill={statusTone(route.status)} fontFamily="var(--font-sans)" fontSize="9" fontWeight="var(--fw-bold)">
            {STATUS_GLYPH[route.status] ?? '•'}
          </text>
        </g>
      )}
    </g>
  );
}
