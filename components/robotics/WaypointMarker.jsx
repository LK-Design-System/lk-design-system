import React from 'react';

const ROLE_CODES = {
  holding: 'H',
  passthrough: 'T',
  parking: 'P',
  charger: 'C',
};

const ROLE_LABELS = {
  holding: 'holding point',
  passthrough: 'passthrough point',
  parking: 'parking spot',
  charger: 'charger',
};

const ANNOTATION_CODES = {
  dock: 'dock',
  cleaning: 'clean',
  dispenser: 'disp',
  ingestor: 'ing',
  'lift-approach': 'lift',
  'door-approach': 'door',
  mutex: 'mutex',
  custom: 'custom',
};

const ANNOTATION_LABELS = {
  dock: 'dock',
  cleaning: 'cleaning',
  dispenser: 'dispenser',
  ingestor: 'ingestor',
  'lift-approach': 'lift approach',
  'door-approach': 'door approach',
  mutex: 'mutex',
  custom: 'custom annotation',
};

function normalizeViewportScale(value) {
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function semanticSummary(waypoint) {
  const roleCodes = (waypoint.roles || []).map((role) => ROLE_CODES[role]);
  const annotationCodes = (waypoint.annotations || [])
    .map((annotation) => ANNOTATION_CODES[annotation.kind]);
  const codes = [...roleCodes, ...annotationCodes].filter(Boolean);

  if (codes.length <= 3) return codes.join(' · ');
  return `${codes.slice(0, 3).join(' · ')} +${codes.length - 3}`;
}

function accessibleName(waypoint, { selected, disabled, invalid, stale }) {
  const roles = (waypoint.roles || []).map((role) => ROLE_LABELS[role] || role);
  const annotations = (waypoint.annotations || [])
    .map((annotation) => {
      const kind = ANNOTATION_LABELS[annotation.kind] || annotation.kind;
      return annotation.label ? `${annotation.label} (${kind})` : kind;
    });
  const states = [
    `availability ${waypoint.availability || 'unknown'}`,
    selected && 'selected',
    disabled && 'disabled',
    invalid && 'invalid',
    stale && 'stale',
  ].filter(Boolean);

  return [
    waypoint.label,
    `map ${waypoint.mapId}`,
    roles.length > 0 && `roles ${roles.join(', ')}`,
    annotations.length > 0 && `annotations ${annotations.join(', ')}`,
    ...states,
  ].filter(Boolean).join(', ');
}

/**
 * LK Robotics Extension — renderer reference for one navigation-graph waypoint.
 *
 * The component deliberately returns an SVG `g` fragment. The owning map
 * supplies the SVG root, world transform, clipping, and semantic mirror list.
 */
export function WaypointMarker({
  waypoint,
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
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const [hasDomFocus, setHasDomFocus] = React.useState(false);
  const scale = normalizeViewportScale(viewportScale);
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === 'function';
  const focusVisible = focused || hasDomFocus;
  const availability = waypoint.availability || 'unknown';
  const details = semanticSummary(waypoint);
  const label = ariaLabel ?? accessibleName(waypoint, {
    selected,
    disabled,
    invalid,
    stale,
  });
  const foreground = 'var(--viewer-foreground, var(--color-semantic-label-strong))';
  const muted = 'var(--viewer-muted, var(--color-semantic-label-neutral))';
  const surface = 'var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))';
  const stateColor = invalid || availability === 'unavailable'
    ? 'var(--color-semantic-status-negative-foreground)'
    : availability === 'unknown'
      ? 'var(--color-semantic-status-cautionary-foreground)'
      : foreground;

  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(waypoint.id, event);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(event);
  };

  return (
    <g
      {...rest}
      data-waypoint-marker=""
      data-waypoint-id={waypoint.id}
      data-map-id={waypoint.mapId}
      data-availability={availability}
      data-selected={selected ? 'true' : 'false'}
      data-focused={focusVisible ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
      data-invalid={invalid ? 'true' : 'false'}
      data-stale={stale ? 'true' : 'false'}
      data-role-codes={(waypoint.roles || []).map((role) => ROLE_CODES[role]).filter(Boolean).join('')}
      data-annotation-count={(waypoint.annotations || []).length}
      transform={`translate(${waypoint.position.x} ${waypoint.position.y})`}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? (disabled ? -1 : tabIndex ?? 0) : tabIndex}
      aria-label={label}
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
      <g
        data-waypoint-screen-space=""
        data-viewport-scale={scale}
        transform={`scale(${inverseScale})`}
      >
        {/*
          WCAG 2.2 sets the minimum interactive target at 24 screen px. This
          transparent hit circle lives inside the inverse-scaled screen-space
          group, so its radius is already measured in screen px. Render it at
          26 px (r=13) rather than exactly 24 so sub-pixel rounding never drops
          the measured target below 24 at any world scale (0.5 / 1 / 2).
        */}
        <circle
          data-waypoint-hit-area=""
          data-screen-target-size="24"
          r="13"
          fill="transparent"
          pointerEvents={interactive ? 'all' : 'none'}
        />

        {focusVisible && (
          <rect
            data-waypoint-focus-indicator=""
            x="-11"
            y="-11"
            width="22"
            height="22"
            rx="4"
            fill="none"
            stroke="var(--color-semantic-focus-indicator)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {stale && (
          <circle
            data-waypoint-stale-indicator=""
            r="9.5"
            fill="none"
            stroke={muted}
            strokeWidth="1.5"
            strokeDasharray="2.5 2.5"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {selected && (
          <circle
            data-waypoint-selected-indicator=""
            r="9"
            fill="none"
            stroke="var(--color-semantic-primary-normal)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}

        <circle
          data-waypoint-point=""
          r="6"
          fill={surface}
          stroke={stateColor}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {availability === 'unavailable' && (
          <path
            data-waypoint-unavailable-indicator=""
            d="M-4.5 4.5 L4.5 -4.5"
            fill="none"
            stroke="var(--color-semantic-status-negative-foreground)"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {availability === 'unknown' && !invalid && (
          <text
            data-waypoint-unknown-indicator=""
            x="0"
            y="0.5"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-semantic-status-cautionary-text)"
            fontFamily="var(--font-sans)"
            fontSize="9"
            fontWeight="var(--fw-bold)"
            aria-hidden="true"
          >
            ?
          </text>
        )}

        {invalid && (
          <g
            data-waypoint-invalid-indicator=""
            fill="none"
            stroke="var(--color-semantic-status-negative-foreground)"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M-3 -3 L3 3" vectorEffect="non-scaling-stroke" />
            <path d="M3 -3 L-3 3" vectorEffect="non-scaling-stroke" />
          </g>
        )}

        {showLabel && (
          <g data-waypoint-label="" pointerEvents="none" aria-hidden="true">
            <text
              x="11"
              y={details ? '-1.5' : '3.5'}
              fill={foreground}
              stroke={surface}
              strokeWidth="3"
              strokeLinejoin="round"
              paintOrder="stroke"
              vectorEffect="non-scaling-stroke"
              fontFamily="var(--font-sans)"
              fontSize="var(--label2-size)"
              fontWeight="var(--fw-bold)"
            >
              {waypoint.label}
            </text>
            {details && (
              <text
                x="11"
                y="10"
                fill={muted}
                stroke={surface}
                strokeWidth="3"
                strokeLinejoin="round"
                paintOrder="stroke"
                vectorEffect="non-scaling-stroke"
                fontFamily="var(--font-sans)"
                fontSize="var(--caption2-size)"
                fontWeight="var(--fw-semibold)"
              >
                {details}
              </text>
            )}
          </g>
        )}
      </g>
    </g>
  );
}
