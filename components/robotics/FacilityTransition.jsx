import React from 'react';

const AVAILABILITY_PRESENTATION = {
  available: {
    label: '사용 가능',
    stroke: 'var(--color-semantic-primary-normal)',
    dash: undefined,
  },
  unavailable: {
    label: '사용 불가',
    stroke: 'var(--color-semantic-status-negative-foreground)',
    dash: '6 3',
  },
  unknown: {
    label: '가용성 미확인',
    stroke: 'var(--viewer-muted, var(--color-semantic-label-alternative))',
    dash: '1 3',
  },
};

const KIND_LABELS = {
  door: '문 전이',
  lift: '승강기 전이',
  dock: '도킹 전이',
};

const DOOR_STATE_LABELS = {
  closed: '문 닫힘',
  moving: '문 이동 중',
  open: '문 열림',
  offline: '문 오프라인',
  unknown: '문 상태 미확인',
};

const DOOR_EVENT_LABELS = {
  open: '열기 이벤트',
  close: '닫기 이벤트',
  pass: '통과 이벤트',
};

const LIFT_PHASE_LABELS = {
  approach: '접근 중',
  waiting: '대기 중',
  boarding: '탑승 중',
  moving: '층간 이동 중',
  arrival: '도착',
  exiting: '하차 중',
};

const MOTION_LABELS = {
  stopped: '정지',
  up: '상승',
  down: '하강',
  unknown: '이동 미확인',
};

const OPERATING_MODE_LABELS = {
  human: '사람 모드',
  agv: 'AGV 모드',
  fire: '소방 모드',
  offline: '운영 오프라인',
  emergency: '비상 모드',
  unknown: '운영 모드 미확인',
};

const SESSION_LABELS = {
  none: '세션 없음',
  requested: '세션 요청됨',
  owned: '현재 fleet 세션',
  other: '다른 세션 사용 중',
  unknown: '세션 소유 미확인',
};

const DOCK_PHASE_LABELS = {
  approach: '도킹 접근 중',
  docking: '도킹 중',
  docked: '도킹 완료',
  undocking: '도킹 해제 중',
  complete: '전이 완료',
};

function safeScale(viewportScale) {
  const scale = Number(viewportScale);
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function endpointForMap(transition, activeMapId) {
  const fromMatches = transition.from.mapId === activeMapId;
  const toMatches = transition.to?.mapId === activeMapId;

  if (fromMatches && toMatches) {
    return {
      position: midpoint(transition.from.position, transition.to.position),
      side: 'both',
    };
  }
  if (fromMatches) return { position: transition.from.position, side: 'from' };
  if (toMatches) return { position: transition.to.position, side: 'to' };
  return null;
}

function detailRows(transition, availabilityLabel) {
  if (transition.kind === 'lift') {
    return [
      [
        LIFT_PHASE_LABELS[transition.phase],
        DOOR_STATE_LABELS[transition.doorState],
        MOTION_LABELS[transition.motionState],
      ].filter(Boolean).join(' · '),
      [
        OPERATING_MODE_LABELS[transition.operatingMode],
        SESSION_LABELS[transition.sessionState],
        availabilityLabel,
      ].filter(Boolean).join(' · '),
    ];
  }

  if (transition.kind === 'door') {
    return [[
      DOOR_EVENT_LABELS[transition.event],
      DOOR_STATE_LABELS[transition.doorState],
      availabilityLabel,
    ].filter(Boolean).join(' · ')];
  }

  return [[DOCK_PHASE_LABELS[transition.phase], availabilityLabel].filter(Boolean).join(' · ')];
}

function visibleDetailRows(transition, availabilityLabel) {
  if (transition.kind === 'lift') {
    return [
      [LIFT_PHASE_LABELS[transition.phase], availabilityLabel].filter(Boolean).join(' · '),
      [
        DOOR_STATE_LABELS[transition.doorState],
        MOTION_LABELS[transition.motionState],
        OPERATING_MODE_LABELS[transition.operatingMode],
      ].filter(Boolean).join(' · '),
    ];
  }

  if (transition.kind === 'door') {
    return [[
      DOOR_EVENT_LABELS[transition.event],
      DOOR_STATE_LABELS[transition.doorState],
      availabilityLabel,
    ].filter(Boolean).join(' · ')];
  }

  return [[DOCK_PHASE_LABELS[transition.phase], availabilityLabel].filter(Boolean).join(' · ')];
}

function computedAccessibleLabel(transition, availabilityLabel) {
  const from = transition.from.label ?? transition.from.mapId;
  const endpointDescription = transition.to
    ? `${from}에서 ${transition.to.label ?? transition.to.mapId}까지`
    : `${from}에서 시작`;
  const maps = transition.kind === 'lift'
    ? [
        transition.currentMapId ? `현재 지도 ${transition.currentMapId}` : undefined,
        transition.destinationMapId ? `목적 지도 ${transition.destinationMapId}` : undefined,
      ]
    : [];
  return [
    KIND_LABELS[transition.kind],
    transition.label,
    endpointDescription,
    ...maps,
    ...detailRows(transition, availabilityLabel),
  ].filter(Boolean).join(' · ');
}

function FacilityGlyph({ kind, stroke }) {
  if (kind === 'door') {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round">
        <path d="M-6-7V7M6-7V7" vectorEffect="non-scaling-stroke" />
        <path d="M-3 0H3" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      </g>
    );
  }

  if (kind === 'lift') {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-7" y="-7" width="14" height="14" rx="2" vectorEffect="non-scaling-stroke" />
        <path d="M-3 2V-3M-5-1L-3-3L-1-1M3-2V3M1 1L3 3L5 1" vectorEffect="non-scaling-stroke" />
      </g>
    );
  }

  return (
    <g fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-7-6V6H2" vectorEffect="non-scaling-stroke" />
      <path d="M2-4L7 0L2 4Z" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

/**
 * LK Robotics — FacilityTransition
 *
 * Renderer-neutral SVG reference fragment for a door, lift, or dock transition.
 * It visualizes product-provided state and never requests or controls equipment.
 */
export function FacilityTransition({
  transition,
  activeMapId,
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
  const [focusVisible, setFocusVisible] = React.useState(false);
  const endpoint = endpointForMap(transition, activeMapId);
  const availability = AVAILABILITY_PRESENTATION[transition.availability]
    ?? AVAILABILITY_PRESENTATION.unknown;
  const interactive = typeof onActivate === 'function';
  const activeFocus = focused || focusVisible;
  const inverseScale = 1 / safeScale(viewportScale);
  const stroke = invalid
    ? 'var(--color-semantic-status-negative-foreground)'
    : disabled
      ? 'var(--viewer-muted, var(--color-semantic-label-alternative))'
      : availability.stroke;
  const dash = invalid ? '4 3' : stale ? '2 4' : availability.dash;
  const rows = visibleDetailRows(transition, availability.label);
  const computedLabel = [
    computedAccessibleLabel(transition, availability.label),
    invalid ? '잘못된 설비 전이' : undefined,
    stale ? '데이터 지연' : undefined,
    disabled ? '선택할 수 없음' : undefined,
  ].filter(Boolean).join(' · ');

  if (hidden || !endpoint) return null;

  const endpointLabel = endpoint.side === 'from'
    ? '출발'
    : endpoint.side === 'to'
      ? '도착'
      : '연결';

  const activate = (event) => {
    if (disabled || !interactive) return;
    onActivate(transition.id, event);
  };

  const handleKeyDown = (event) => {
    if (disabled || !interactive || event.repeat) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(event);
  };

  return (
    <g
      {...rest}
      role={role ?? (interactive ? 'button' : 'img')}
      tabIndex={interactive ? (disabled ? -1 : (tabIndex ?? 0)) : tabIndex}
      focusable={interactive && !disabled ? 'true' : undefined}
      aria-label={ariaLabel ?? computedLabel}
      aria-pressed={interactive ? selected : undefined}
      aria-disabled={interactive && disabled ? true : undefined}
      transform={`translate(${endpoint.position.x} ${endpoint.position.y})`}
      data-lds-facility-transition=""
      data-transition-id={transition.id}
      data-facility-id={transition.facilityId}
      data-transition-kind={transition.kind}
      data-transition-availability={transition.availability}
      data-active-map-id={activeMapId}
      data-from-map-id={transition.from.mapId}
      data-to-map-id={transition.to?.mapId}
      data-visible-endpoint={endpoint.side}
      data-door-state={transition.doorState}
      data-door-event={transition.kind === 'door' ? transition.event : undefined}
      data-lift-phase={transition.kind === 'lift' ? transition.phase : undefined}
      data-motion-state={transition.kind === 'lift' ? transition.motionState : undefined}
      data-operating-mode={transition.kind === 'lift' ? transition.operatingMode : undefined}
      data-session-state={transition.kind === 'lift' ? transition.sessionState : undefined}
      data-current-map-id={transition.kind === 'lift' ? transition.currentMapId : undefined}
      data-destination-map-id={transition.kind === 'lift' ? transition.destinationMapId : undefined}
      data-dock-phase={transition.kind === 'dock' ? transition.phase : undefined}
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
      <g transform={`scale(${inverseScale})`}>
        {activeFocus && (
          <circle r="16" fill="none" stroke="var(--color-semantic-focus-indicator)" strokeWidth="4" vectorEffect="non-scaling-stroke" pointerEvents="none" />
        )}
        {selected && (
          <circle r="14" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="3" vectorEffect="non-scaling-stroke" pointerEvents="none" data-transition-selection-ring="" />
        )}
        <circle
          r="17"
          fill="transparent"
          stroke="none"
          pointerEvents={interactive ? 'all' : 'none'}
          data-transition-hit-area=""
          data-screen-target-size="24"
        />
        <circle
          r="11"
          fill="var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))"
          stroke={stroke}
          strokeWidth="1.8"
          strokeDasharray={dash}
          vectorEffect="non-scaling-stroke"
          data-transition-marker=""
        />
        <FacilityGlyph kind={transition.kind} stroke={stroke} />

        {transition.availability === 'unavailable' && (
          <path d="M-8 8L8-8" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" pointerEvents="none" data-transition-unavailable-mark="" />
        )}
        {transition.availability === 'unknown' && (
          <text
            x="8"
            y="-8"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--viewer-foreground, var(--color-semantic-label-strong))"
            stroke="var(--viewer-surface, var(--color-semantic-background-normal-normal))"
            strokeWidth="3"
            paintOrder="stroke"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)' }}
          >
            ?
          </text>
        )}
        {invalid && (
          <text
            x="0"
            y="1"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--color-semantic-status-negative-foreground)"
            stroke="var(--viewer-surface, var(--color-semantic-background-normal-normal))"
            strokeWidth="3"
            paintOrder="stroke"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
            data-transition-invalid-mark=""
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-bold)' }}
          >
            !
          </text>
        )}

        {showLabel && (
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
            data-transition-label=""
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)' }}
          >
            <tspan x="20" dy="0">{endpointLabel} · {transition.label}</tspan>
            {rows.map((row, index) => (
              <tspan key={`${transition.id}-row-${index}`} x="20" dy="13" style={{ fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-semibold)' }}>
                {row}
              </tspan>
            ))}
          </text>
        )}
      </g>
    </g>
  );
}
