import React from 'react';
import { StatusBadge } from '@lk-robotics/lds-core/components/content/StatusBadge';
import { StatusIndicator } from '@lk-robotics/lds-core/components/content/StatusIndicator';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { ScrollArea } from '@lk-robotics/lds-core/components/layout/ScrollArea';

const STATUS_PRESENTATION = {
  normal: {
    tone: 'positive',
    accent: 'var(--color-semantic-primary-normal)',
    currentSurface: 'var(--color-semantic-primary-surface-normal)',
    currentText: 'var(--color-semantic-label-strong)',
  },
  maintenance: {
    tone: 'cautionary',
    accent: 'var(--color-semantic-status-cautionary)',
    currentSurface: 'var(--color-semantic-status-cautionary-surface)',
    currentText: 'var(--color-semantic-status-cautionary-text)',
  },
  fault: {
    tone: 'negative',
    accent: 'var(--color-semantic-status-negative)',
    currentSurface: 'var(--color-semantic-status-negative-surface)',
    currentText: 'var(--color-semantic-status-negative-text)',
  },
  offline: {
    tone: 'offline',
    accent: 'var(--color-semantic-label-alternative)',
    currentSurface: 'var(--color-semantic-background-normal-alternative)',
    currentText: 'var(--color-semantic-label-alternative)',
    borderStyle: 'dashed',
  },
  unknown: {
    tone: 'offline',
    accent: 'var(--color-semantic-label-alternative)',
    currentSurface: 'var(--color-semantic-background-normal-alternative)',
    currentText: 'var(--color-semantic-label-alternative)',
  },
};

const STATUS_PRIORITY = {
  normal: 0,
  unknown: 1,
  maintenance: 2,
  offline: 3,
  fault: 4,
};

function normalizeStatus(status) {
  return STATUS_PRESENTATION[status] ? status : 'unknown';
}

function getBuildingStatus(elevators) {
  if (!elevators.length) return 'unknown';
  return elevators.reduce((current, elevator) => {
    const next = normalizeStatus(elevator.status);
    return STATUS_PRIORITY[next] > STATUS_PRIORITY[current] ? next : current;
  }, 'normal');
}

function getAttentionCount(buildings) {
  const elevators = buildings.flatMap((building) => building.elevators ?? []);
  return elevators.filter((elevator) => normalizeStatus(elevator.status) !== 'normal').length;
}

function useElevatorFleetStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-elevator-fleet-css')) return;
    const element = document.createElement('style');
    element.id = 'lk-elevator-fleet-css';
    element.textContent = [
      '@keyframes lk-elevator-direction-up{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}',
      '@keyframes lk-elevator-direction-down{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}',
      '.lk-elevator-direction[data-direction="up"]{animation:lk-elevator-direction-up calc(var(--dur-slow) * 5) var(--ease-in-out) infinite}',
      '.lk-elevator-direction[data-direction="down"]{animation:lk-elevator-direction-down calc(var(--dur-slow) * 5) var(--ease-in-out) infinite}',
      '.lk-elevator-fleet-scroll:focus-visible{outline-offset:-2px!important}',
      '@media (max-width:600px){.lk-elevator-fleet-heading{align-items:flex-start!important;flex-direction:column!important}}',
      '@container (max-width:600px){.lk-elevator-fleet-heading{align-items:flex-start!important;flex-direction:column!important}}',
      '@media (prefers-reduced-motion:reduce){.lk-elevator-direction{animation:none!important;transform:none!important}}',
    ].join('');
    document.head.appendChild(element);
  }, []);
}

function LandingDoor({ active, color }) {
  const size = active ? 24 : 20;

  return (
    <span
      aria-hidden="true"
      data-door-variant={active ? 'solid' : 'outlined'}
      style={{
        width: size,
        height: size,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
        border: `2px solid ${color}`,
        borderRadius: 2,
        boxSizing: 'border-box',
        background: active ? color : 'transparent',
      }}
    >
      <span style={{ borderRight: `1px solid ${active ? 'var(--color-semantic-static-white)' : color}` }} />
      <span style={{ borderLeft: `1px solid ${active ? 'var(--color-semantic-static-white)' : color}` }} />
    </span>
  );
}

function FloorRow({
  floor,
  active,
  presentation,
  belowGround = false,
  groundLine = false,
}) {
  const inactiveColor = 'var(--color-semantic-line-normal-normal)';
  const iconColor = active ? presentation.accent : inactiveColor;
  // 지면 기준은 건물이 `groundFloor`로 알려줄 때만 그린다. 층 이름에서 지하를
  // 추측하지 않는다 — 라벨 표기는 제품·로케일마다 다르고, 이 컴포넌트는 공급된
  // 값을 투영할 뿐 의미를 파생하지 않는다.
  const rowBorder = groundLine
    ? '2px solid var(--color-semantic-label-assistive)'
    : '1px solid var(--color-semantic-line-normal-normal)';

  return (
    <span
      aria-hidden="true"
      data-current-floor={active ? 'true' : undefined}
      style={{
        height: 40,
        display: 'grid',
        gridTemplateColumns: '40px minmax(32px, 1fr)',
        alignItems: 'center',
        gap: 'var(--space-1)',
        paddingInline: 'var(--space-2)',
        boxSizing: 'border-box',
        borderTop: rowBorder,
        background: active
          ? presentation.currentSurface
          : (belowGround ? 'var(--color-semantic-background-normal-alternative)' : 'transparent'),
        color: active ? presentation.currentText : 'var(--color-semantic-label-alternative)',
        fontSize: 'var(--caption1-size)',
        fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-regular)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <span>{floor}</span>
      <span style={{ display: 'grid', placeItems: 'center' }}>
        <LandingDoor active={active} color={iconColor} />
      </span>
    </span>
  );
}

function ElevatorColumn({ building, elevator }) {
  const floors = building.floors ?? [];
  // `groundFloor`가 `floors`에 실제로 있을 때만 지면 기준을 그린다. 값이 없거나
  // 목록에 없으면 아무 것도 표시하지 않는다 — 없는 기준을 지어내지 않는다.
  const groundIndex = building.groundFloor == null
    ? -1
    : floors.indexOf(building.groundFloor);
  const status = normalizeStatus(elevator.status);
  const presentation = STATUS_PRESENTATION[status];
  const direction = elevator.direction ?? 'idle';
  const offline = status === 'offline';
  const directionIcon = !offline && direction === 'up'
    ? 'chevron-up-small'
    : !offline && direction === 'down'
      ? 'chevron-down-small'
      : null;
  const directionLabel = elevator.directionLabel
    ?? (direction === 'up' ? '상승 중' : direction === 'down' ? '하강 중' : '정지');
  const positionSummary = offline
    ? `${elevator.name} 마지막 확인 위치 ${elevator.currentFloor}, ${elevator.statusLabel ?? status}`
    : `${elevator.name} 현재 위치 ${elevator.currentFloor}, ${directionLabel}, ${elevator.statusLabel ?? status}`;

  return (
    <article
      className="lk-elevator-column"
      data-elevator-id={elevator.id}
      data-elevator-status={status}
      style={{
        position: 'relative',
        flex: '0 0 144px',
        width: 144,
        minWidth: 0,
        display: 'grid',
        alignContent: 'start',
        gap: 'var(--space-2)',
      }}
    >
      <div
        style={{
          minHeight: 72,
          display: 'grid',
          alignContent: 'center',
          gap: 'var(--space-1)',
          padding: 'var(--space-2) var(--space-3)',
          boxSizing: 'border-box',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderStyle: presentation.borderStyle ?? 'solid',
          borderRadius: 'var(--component-card-radius)',
          background: offline
            ? 'var(--color-semantic-background-normal-alternative)'
            : 'var(--color-semantic-background-elevated-normal)',
        }}
      >
        <span style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-2)',
              color: 'var(--color-semantic-label-alternative)',
              fontSize: 'var(--caption2-size)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span>{elevator.id.toUpperCase()}</span>
            <StatusIndicator tone={presentation.tone}>
              {elevator.statusLabel ?? status}
            </StatusIndicator>
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-2)', minWidth: 0 }}>
            <strong
              style={{
                flex: '1 1 auto',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'var(--color-semantic-label-strong)',
                fontSize: 'var(--heading2-size)',
                lineHeight: 'var(--heading2-line)',
              }}
            >
              {elevator.name}
            </strong>
            {status !== 'normal' && elevator.updatedLabel && (
              <span
                style={{
                  flex: '0 0 auto',
                  color: 'var(--color-semantic-label-alternative)',
                  fontSize: 'var(--caption2-size)',
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                }}
              >
                {elevator.updatedLabel}
              </span>
            )}
          </span>
        </span>
      </div>

      <div
        style={{
          overflow: 'hidden',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderStyle: presentation.borderStyle ?? 'solid',
          borderRadius: 'var(--component-card-radius)',
          background: offline
            ? 'var(--color-semantic-background-normal-alternative)'
            : 'var(--color-semantic-background-elevated-normal)',
        }}
      >
        <div
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            paddingInline: 'var(--space-3)',
            boxSizing: 'border-box',
            borderBottom: '1px solid var(--color-semantic-line-solid-_strong)',
            background: 'var(--color-semantic-background-elevated-normal)',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 'var(--space-1)',
            }}
          >
            <strong
              data-position-value={elevator.currentFloor}
              style={{
                color: offline
                  ? 'var(--color-semantic-label-alternative)'
                  : 'var(--color-semantic-label-strong)',
                fontSize: 'var(--body1-size)',
                lineHeight: 'var(--body1-line)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {elevator.currentFloor}
            </strong>
            {offline && (
              <span
                style={{
                  color: 'var(--color-semantic-label-alternative)',
                  fontSize: 'var(--caption2-size)',
                  whiteSpace: 'nowrap',
                }}
              >
                · 마지막 위치
              </span>
            )}
          </span>
          {!offline && (
            <span
              className="lk-elevator-direction"
              aria-hidden="true"
              data-direction={directionIcon ? direction : 'idle'}
              data-direction-glyph={directionIcon ? direction : 'idle'}
              style={{
                width: 16,
                height: 16,
                display: 'inline-grid',
                placeItems: 'center',
                flex: '0 0 auto',
                color: directionIcon
                  ? 'var(--color-semantic-primary-normal)'
                  : 'var(--color-semantic-label-alternative)',
                fontSize: 'var(--body1-size)',
                lineHeight: 1,
              }}
            >
              {directionIcon
                ? <Icon name={directionIcon} size={16} aria-hidden="true" />
                : '—'}
            </span>
          )}
        </div>

        <div
          role="img"
          aria-label={positionSummary}
        >
          {floors.map((floor, index) => (
            <FloorRow
              key={floor}
              floor={floor}
              active={floor === elevator.currentFloor}
              presentation={presentation}
              belowGround={groundIndex >= 0 && index > groundIndex}
              groundLine={groundIndex >= 0 && index === groundIndex + 1}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

function BuildingGroup({ building, headingLevel, headingId }) {
  const Heading = `h${headingLevel}`;
  const elevators = building.elevators ?? [];
  const status = getBuildingStatus(elevators);
  const presentation = STATUS_PRESENTATION[status];
  const attentionCount = elevators.filter(
    (elevator) => normalizeStatus(elevator.status) !== 'normal',
  ).length;

  return (
    <section
      aria-labelledby={headingId}
      data-building-id={building.id}
      style={{
        flex: '0 0 auto',
      }}
    >
      <header
        style={{
          minHeight: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          padding: '0 var(--space-1) var(--space-2)',
          boxSizing: 'border-box',
        }}
      >
        <Heading
          id={headingId}
          style={{
            margin: 0,
            color: 'var(--color-semantic-label-strong)',
            fontSize: 'var(--body1-size)',
            lineHeight: 'var(--body1-line)',
          }}
        >
          {building.name}
        </Heading>
        {attentionCount > 0 && (
          <StatusBadge tone={presentation.tone}>
            {building.statusLabel ?? `${attentionCount}대 확인`}
          </StatusBadge>
        )}
      </header>

      {elevators.length ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
          {elevators.map((elevator) => (
            <ElevatorColumn
              key={elevator.id}
              building={building}
              elevator={elevator}
            />
          ))}
        </div>
      ) : (
        <div
          role="status"
          style={{
            width: 240,
            minHeight: 200,
            display: 'grid',
            placeItems: 'center',
            padding: 'var(--space-4)',
            boxSizing: 'border-box',
            color: 'var(--color-semantic-label-alternative)',
            fontSize: 'var(--label1-size)',
            textAlign: 'center',
          }}
        >
          {building.emptyMessage ?? '표시할 엘리베이터 정보가 없습니다.'}
        </div>
      )}
    </section>
  );
}

/**
 * LDS Product — ElevatorFleetOverview
 * A horizontally scrollable monitoring projection that groups one vertical
 * position column per elevator by building.
 */
export function ElevatorFleetOverview({
  buildings = [],
  label = '건물별 엘리베이터 현황',
  headingLevel = 3,
  emptyMessage = '표시할 건물이 없습니다.',
  style,
  ...rest
}) {
  useElevatorFleetStyles();
  const instanceId = React.useId().replace(/:/g, '');
  const attentionCount = getAttentionCount(buildings);

  if (!buildings.length) {
    return (
      <div
        role="status"
        style={{
          minHeight: 180,
          display: 'grid',
          placeItems: 'center',
          padding: 'var(--space-5)',
          boxSizing: 'border-box',
          border: '1px solid var(--color-semantic-line-solid-_strong)',
          borderRadius: 'var(--component-card-radius)',
          background: 'var(--color-semantic-background-elevated-normal)',
          color: 'var(--color-semantic-label-alternative)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--label1-size)',
          textAlign: 'center',
          ...style,
        }}
        {...rest}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <section
      aria-label={label}
      style={{
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        border: '1px solid var(--color-semantic-line-solid-_strong)',
        borderRadius: 'var(--component-card-radius)',
        background: 'var(--color-semantic-background-elevated-normal)',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        ...style,
      }}
      {...rest}
    >
      <header
        className="lk-elevator-fleet-heading"
        style={{
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--color-semantic-line-solid-_strong)',
          boxSizing: 'border-box',
          background: 'var(--color-semantic-background-normal-alternative)',
        }}
      >
        <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)' }}>
          캠퍼스 엘리베이터 모니터링
        </strong>

        {attentionCount > 0 && (
          <StatusBadge tone="cautionary">
            {attentionCount}대 확인
          </StatusBadge>
        )}
      </header>

      <ScrollArea
        className="lk-elevator-fleet-scroll"
        label="건물 및 엘리베이터 위치 비교"
        maxHeight="none"
        scrollbar="compact"
        gutter="stable"
        style={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          background: 'var(--color-semantic-background-normal-normal)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-6)',
            width: 'max-content',
            minWidth: '100%',
            padding: 'var(--space-3)',
            boxSizing: 'border-box',
          }}
        >
          {buildings.map((building, buildingIndex) => (
            <BuildingGroup
              key={building.id}
              building={building}
              headingLevel={headingLevel}
              headingId={`lk-elevator-${instanceId}-building-${buildingIndex}`}
            />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
