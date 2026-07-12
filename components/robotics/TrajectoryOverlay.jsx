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

function statusTone(status, invalid) {
  if (invalid || status === 'blocked') return 'var(--color-semantic-status-negative-foreground)';
  if (status === 'waiting' || status === 'rerouting') return 'var(--color-semantic-status-cautionary-foreground)';
  if (status === 'completed') return 'var(--color-semantic-status-positive-foreground)';
  if (status === 'active') return 'var(--color-semantic-primary-normal)';
  return 'var(--viewer-muted, var(--color-semantic-label-alternative))';
}

function statusDash(status) {
  if (status === 'planned') return '3 5';
  if (status === 'waiting') return '9 3 2 3';
  if (status === 'blocked') return '1 5';
  if (status === 'rerouting') return '6 4';
  if (status === 'completed') return '8 4';
  return undefined;
}

function trajectoryAccessibleName(trajectory, selected, invalid, stale) {
  const samples = trajectory?.samples ?? [];
  const currentIndex = Number.isInteger(trajectory?.currentSampleIndex)
    && trajectory.currentSampleIndex >= 0
    && trajectory.currentSampleIndex < samples.length
    ? trajectory.currentSampleIndex
    : undefined;
  const timedSamples = samples.filter((sample) => Number.isFinite(sample.timeMs));
  const firstTime = timedSamples[0]?.timeMs;
  const lastTime = timedSamples[timedSamples.length - 1]?.timeMs;
  const currentTime = currentIndex == null ? undefined : samples[currentIndex]?.timeMs;
  const parts = [
    trajectory.label ?? `궤적 ${trajectory.id}`,
    `지도 ${trajectory.mapId}`,
    STATUS_LABEL[trajectory.status] ?? trajectory.status,
    `sample ${samples.length}개`,
  ];
  if (firstTime != null && lastTime != null) parts.push(`시간 ${firstTime}에서 ${lastTime} 밀리초`);
  if (currentIndex != null) parts.push(`현재 sample ${currentIndex + 1}`);
  if (currentTime != null) parts.push(`현재 시간 ${currentTime} 밀리초`);
  if (selected) parts.push('선택됨');
  if (invalid) parts.push('데이터 오류');
  if (stale) parts.push('오래된 데이터');
  return parts.join(', ');
}

/** SVG fragment for one dense, single-map trajectory supplied by the runtime. */
export function TrajectoryOverlay({
  trajectory,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  onActivate,
  tabIndex,
  onFocus,
  onBlur,
  'aria-label': ariaLabel,
  style,
  ...rest
}) {
  const [hasDomFocus, setHasDomFocus] = React.useState(false);
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === 'function';
  const focusVisible = focused || hasDomFocus;
  const samples = trajectory?.samples ?? [];
  const points = samples.map((sample) => sample.position).filter(finitePoint);
  const pathData = pathFromPoints(points);
  const currentIndex = Number.isInteger(trajectory?.currentSampleIndex)
    && trajectory.currentSampleIndex >= 0
    && trajectory.currentSampleIndex < samples.length
    ? trajectory.currentSampleIndex
    : undefined;
  const currentSample = currentIndex == null ? undefined : samples[currentIndex];
  const markerPoint = finitePoint(currentSample?.position)
    ? currentSample.position
    : pointAlong(points, 0.5);
  const statePoint = pointAlong(points, 0.12);
  const headingDegrees = Number.isFinite(currentSample?.headingRad)
    ? currentSample.headingRad * 180 / Math.PI
    : undefined;
  const tone = statusTone(trajectory?.status, invalid);
  const dash = statusDash(trajectory?.status);
  const foreground = 'var(--viewer-foreground, var(--color-semantic-label-strong))';
  const surface = 'var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))';

  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(trajectory.id, event);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(event);
  };

  return (
    <g
      {...rest}
      data-lk-trajectory-overlay=""
      data-trajectory-id={trajectory?.id}
      data-map-id={trajectory?.mapId}
      data-trajectory-status={trajectory?.status}
      data-current-sample-index={currentIndex}
      data-selected={selected ? 'true' : 'false'}
      data-focused={focusVisible ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-invalid={invalid ? 'true' : 'false'}
      data-stale={stale ? 'true' : 'false'}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? (disabled ? -1 : tabIndex ?? 0) : tabIndex}
      focusable={interactive ? 'true' : undefined}
      aria-label={ariaLabel ?? trajectoryAccessibleName(trajectory, selected, invalid, stale)}
      aria-pressed={interactive ? selected : undefined}
      aria-disabled={interactive && disabled ? true : undefined}
      aria-invalid={invalid || undefined}
      onClick={activate}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        setHasDomFocus(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setHasDomFocus(false);
        onBlur?.(event);
      }}
      style={{
        cursor: disabled ? 'not-allowed' : interactive ? 'pointer' : 'default',
        opacity: disabled ? 0.42 : stale ? 0.76 : 1,
        outline: 'none',
        ...style,
      }}
    >
      {focusVisible && pathData && (
        <path
          data-trajectory-focus-indicator=""
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
          data-trajectory-selected-indicator=""
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
          data-trajectory-path=""
          d={pathData}
          fill="none"
          stroke={tone}
          strokeWidth={selected || trajectory?.status === 'active' ? 3.5 : 2.5}
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
            data-trajectory-hit-target=""
            data-screen-target-size="24"
            d={pathData}
            fill="none"
            stroke="transparent"
            strokeWidth="24"
            vectorEffect="non-scaling-stroke"
            pointerEvents="stroke"
          />
          <circle
            data-trajectory-hit-target-core=""
            data-screen-target-size="24"
            cx={statePoint.x}
            cy={statePoint.y}
            r={17 * inverseScale}
            fill="transparent"
            pointerEvents="all"
          />
        </>
      )}
      {pathData && currentSample && (
        <g
          data-trajectory-current-marker=""
          transform={`translate(${markerPoint.x} ${markerPoint.y}) scale(${inverseScale})`}
          aria-hidden="true"
          pointerEvents="none"
        >
          <circle
            r="8"
            fill={surface}
            stroke={tone}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {headingDegrees == null ? (
            <circle r="3" fill={tone} />
          ) : (
            <path
              data-trajectory-current-heading=""
              d="M -5 -4 L 5 0 L -5 4 Z"
              transform={`rotate(${headingDegrees})`}
              fill={tone}
              stroke={surface}
              strokeWidth="1"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </g>
      )}
      {pathData && (
        <g
          data-trajectory-status-marker=""
          data-trajectory-status-glyph={trajectory?.status}
          transform={`translate(${statePoint.x} ${statePoint.y}) scale(${inverseScale})`}
          aria-hidden="true"
          pointerEvents="none"
        >
          <circle
            r="7"
            fill={surface}
            stroke={tone}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <text x="0" y="3" textAnchor="middle" fill={tone} fontFamily="var(--font-sans)" fontSize="9" fontWeight="var(--fw-bold)">
            {STATUS_GLYPH[trajectory?.status] ?? '•'}
          </text>
        </g>
      )}
      {pathData && [
        invalid ? { state: 'invalid', glyph: '!', ratio: 0.8, tone: 'var(--color-semantic-status-negative-foreground)' } : null,
        stale ? { state: 'stale', glyph: '~', ratio: invalid ? 0.9 : 0.8, tone: 'var(--viewer-muted, var(--color-semantic-label-alternative))' } : null,
      ].filter(Boolean).map((item) => {
        const point = pointAlong(points, item.ratio);
        return (
          <g
            key={item.state}
            data-trajectory-overlay-state={item.state}
            transform={`translate(${point.x} ${point.y}) scale(${inverseScale})`}
            aria-hidden="true"
            pointerEvents="none"
          >
            <circle
              r="7"
              fill={surface}
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
      {showLabel && trajectory?.label && pathData && (
        <text
          data-trajectory-label=""
          x="0"
          y="-13"
          textAnchor="middle"
          transform={`translate(${markerPoint.x} ${markerPoint.y}) scale(${inverseScale})`}
          fill={foreground}
          stroke={surface}
          strokeWidth="3"
          strokeLinejoin="round"
          paintOrder="stroke"
          vectorEffect="non-scaling-stroke"
          fontFamily="var(--font-sans)"
          fontSize="var(--caption1-size)"
          fontWeight="var(--fw-bold)"
          aria-hidden="true"
          pointerEvents="none"
        >
          {trajectory.label}
        </text>
      )}
    </g>
  );
}
