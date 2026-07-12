import React from 'react';

const CATEGORY_PATTERNS = {
  behavior: 'diagonal',
  facility: 'grid',
  terrain: 'contour',
};

const BEHAVIOR_LABELS = {
  'keep-out': '진입 금지',
  'speed-limit': '속도 제한',
  preferred: '우선 통행',
  'operation-area': '작업 구역',
};

const FACILITY_LABELS = {
  'lift-cabin': '승강기 객실',
  'lift-lobby': '승강기 로비',
  'door-area': '문 주변',
  'dock-area': '도킹 구역',
  'charger-area': '충전 구역',
  custom: '사용자 정의 설비',
};

const TERRAIN_LABELS = {
  slope: '경사 구역',
  rough: '거친 노면',
  clearance: '여유 폭 제한',
  custom: '사용자 정의 지형',
};

const TRAVERSABILITY_LABELS = {
  allowed: '통행 가능',
  restricted: '제한 통행',
  blocked: '통행 불가',
  unknown: '통행 여부 미확인',
};

function safeScale(viewportScale) {
  const scale = Number(viewportScale);
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

function polygonPoints(shape) {
  return shape.points.map((point) => `${point.x},${point.y}`).join(' ');
}

function regionCenter(shape) {
  if (shape.kind === 'circle') return shape.center;
  if (shape.points.length === 0) return { x: 0, y: 0 };

  const total = shape.points.reduce(
    (next, point) => ({ x: next.x + point.x, y: next.y + point.y }),
    { x: 0, y: 0 },
  );
  return {
    x: total.x / shape.points.length,
    y: total.y / shape.points.length,
  };
}

function RegionShape({ shape, ...props }) {
  if (shape.kind === 'circle') {
    return (
      <circle
        cx={shape.center.x}
        cy={shape.center.y}
        r={shape.radius}
        {...props}
      />
    );
  }

  return <polygon points={polygonPoints(shape)} {...props} />;
}

function patternContent(pattern, stroke) {
  if (pattern === 'grid') {
    return (
      <path
        d="M0 0H10M0 0V10"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.42"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  if (pattern === 'contour') {
    return (
      <path
        d="M-2 3C1 1 4 1 7 3S13 5 16 3M-2 9C1 7 4 7 7 9S13 11 16 9"
        fill="none"
        stroke={stroke}
        strokeOpacity="0.48"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    );
  }

  return (
    <path
      d="M-3 12L12-3M3 15L15 3"
      fill="none"
      stroke={stroke}
      strokeOpacity="0.5"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  );
}

function regionKind(region) {
  return region.category === 'behavior' ? region.rule.kind : region.kind;
}

function strokeForRegion(region, { disabled, invalid }) {
  if (invalid) return 'var(--color-semantic-status-negative-foreground)';
  if (disabled) return 'var(--viewer-muted, var(--color-semantic-label-alternative))';

  if (region.category === 'behavior') {
    if (region.rule.kind === 'keep-out') return 'var(--color-semantic-status-negative-foreground)';
    if (region.rule.kind === 'speed-limit') return 'var(--color-semantic-status-cautionary-foreground)';
    return 'var(--color-semantic-primary-normal)';
  }

  if (region.category === 'terrain') {
    if (region.traversability === 'blocked') return 'var(--color-semantic-status-negative-foreground)';
    if (region.traversability === 'restricted') return 'var(--color-semantic-status-cautionary-foreground)';
    if (region.traversability === 'unknown') return 'var(--viewer-muted, var(--color-semantic-label-alternative))';
  }

  return 'var(--viewer-foreground, var(--color-semantic-label-neutral))';
}

function gradeLabel(grade) {
  if (!grade) return undefined;
  const unit = grade.unit === 'percent' ? '%' : '°';
  const direction = Number.isFinite(grade.directionRad)
    ? `방향 ${grade.directionRad} rad`
    : undefined;
  return [`${grade.value}${unit}`, direction].filter(Boolean).join(' · ');
}

function semanticLabel(region) {
  if (region.category === 'behavior') {
    const kind = region.rule.kind === 'custom'
      ? region.rule.label
      : BEHAVIOR_LABELS[region.rule.kind];
    const detail = region.rule.kind === 'speed-limit'
      ? `${region.rule.speedLimitMps} m/s`
      : region.rule.kind === 'operation-area'
        ? region.rule.operation
        : undefined;
    return [kind, detail, region.label].filter(Boolean).join(' · ');
  }

  if (region.category === 'facility') {
    return [FACILITY_LABELS[region.kind], region.label].filter(Boolean).join(' · ');
  }

  return [
    TERRAIN_LABELS[region.kind],
    gradeLabel(region.grade),
    TRAVERSABILITY_LABELS[region.traversability],
    region.label,
  ].filter(Boolean).join(' · ');
}

/**
 * LK Robotics — SpatialRegion
 *
 * Renderer-neutral behavior, facility, and terrain region rendered as an SVG
 * fragment. The application owns map filtering and the surrounding SVG.
 */
export function SpatialRegion({
  region,
  hidden = false,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  onActivate,
  style,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  onFocus,
  onBlur,
  ...rest
}) {
  const reactId = React.useId();
  const [focusVisible, setFocusVisible] = React.useState(false);
  const kind = regionKind(region);
  const pattern = CATEGORY_PATTERNS[region.category] ?? CATEGORY_PATTERNS.behavior;
  const safeId = `${region.id}-${reactId}`.replace(/[^a-zA-Z0-9_-]/g, '');
  const patternId = `lk-spatial-region-${safeId}`;
  const center = regionCenter(region.shape);
  const inverseScale = 1 / safeScale(viewportScale);
  const interactive = typeof onActivate === 'function';
  const activeFocus = focused || focusVisible;
  const computedLabel = [
    semanticLabel(region),
    invalid ? '잘못된 영역' : undefined,
    stale ? '데이터 지연' : undefined,
    disabled ? '선택할 수 없음' : undefined,
  ].filter(Boolean).join(' · ');
  const stroke = strokeForRegion(region, { disabled, invalid });
  const unknownTerrain = region.category === 'terrain' && region.traversability === 'unknown';
  const stateDash = invalid ? '4 3' : stale ? '2 4' : unknownTerrain ? '1 3' : undefined;

  if (hidden) return null;

  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(region.id, event);
  };

  const handleKeyDown = (event) => {
    if (disabled || !interactive || event.repeat) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(event);
  };

  const patternSize = pattern === 'grid' ? 10 : pattern === 'contour' ? 12 : 9;

  return (
    <g
      {...rest}
      role={role ?? (interactive ? 'button' : 'img')}
      tabIndex={interactive ? (disabled ? -1 : (tabIndex ?? 0)) : tabIndex}
      focusable={interactive && !disabled ? 'true' : undefined}
      aria-label={ariaLabel ?? computedLabel}
      aria-pressed={interactive ? selected : undefined}
      aria-disabled={interactive && disabled ? true : undefined}
      data-lds-spatial-region=""
      data-region-id={region.id}
      data-map-id={region.mapId}
      data-region-category={region.category}
      data-region-kind={kind}
      data-region-pattern={pattern}
      data-traversability={region.category === 'terrain' ? region.traversability : undefined}
      data-selected={selected || undefined}
      data-invalid={invalid || undefined}
      data-stale={stale || undefined}
      data-disabled={disabled || undefined}
      onClick={activate}
      onKeyDown={handleKeyDown}
      onFocus={(event) => {
        setFocusVisible(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocusVisible(false);
        onBlur?.(event);
      }}
      style={{
        cursor: interactive && !disabled ? 'pointer' : disabled ? 'not-allowed' : 'default',
        opacity: disabled ? 0.52 : 1,
        outline: 'none',
        ...style,
      }}
    >
      <defs>
        <pattern
          id={patternId}
          width={patternSize}
          height={patternSize}
          patternUnits="userSpaceOnUse"
          data-region-pattern-definition={pattern}
        >
          {patternContent(pattern, stroke)}
        </pattern>
      </defs>

      {activeFocus && (
        <RegionShape
          shape={region.shape}
          fill="none"
          stroke="var(--color-semantic-focus-indicator)"
          strokeWidth="5"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}
      {selected && (
        <RegionShape
          shape={region.shape}
          fill="none"
          stroke="var(--color-semantic-primary-normal)"
          strokeWidth="3.5"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
          data-region-selection-ring=""
        />
      )}
      <RegionShape
        shape={region.shape}
        fill={`url(#${patternId})`}
        stroke={stroke}
        strokeWidth="1.5"
        strokeDasharray={stateDash}
        vectorEffect="non-scaling-stroke"
        data-region-geometry={region.shape.kind}
      />

      {invalid && (
        <g transform={`translate(${center.x} ${center.y}) scale(${inverseScale})`} pointerEvents="none" data-region-invalid-mark="">
          <path d="M-6-6L6 6M6-6L-6 6" fill="none" stroke="var(--color-semantic-status-negative-foreground)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </g>
      )}

      {showLabel && (
        <g transform={`translate(${center.x} ${center.y}) scale(${inverseScale})`} pointerEvents="none" data-region-label="">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--viewer-foreground, var(--color-semantic-label-strong))"
            stroke="var(--viewer-surface, var(--color-semantic-background-normal-normal))"
            strokeWidth="4"
            paintOrder="stroke"
            vectorEffect="non-scaling-stroke"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)' }}
          >
            {region.label?.trim() || semanticLabel(region)}
          </text>
        </g>
      )}
    </g>
  );
}
