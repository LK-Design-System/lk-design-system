import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

const DENSITY = {
  comfortable: {
    minHeight: 60,
    padding: '10px 14px',
    paddingX: 14,
    gap: 12,
    titleSize: 'var(--label1-size)',
    titleLine: 'var(--label1-line)',
    detailSize: 'var(--label2-size)',
    detailLine: 'var(--label2-line)',
  },
  compact: {
    minHeight: 48,
    padding: '7px 12px',
    paddingX: 12,
    gap: 10,
    titleSize: 'var(--label2-size)',
    titleLine: 'var(--label2-line)',
    detailSize: 12,
    detailLine: '16px',
  },
};

const HANDLE_COLUMN_WIDTH = 24;
const INDEX_COLUMN_WIDTH = 32;
const TRAILING_DIVIDER_OFFSET = 32;

const hiddenStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function nodeLabel(node, fallback) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  return fallback;
}

/*
 * The move buttons use `aria-disabled` instead of the native `disabled`
 * attribute: an item dragged to the top or bottom would otherwise disable the
 * very button that holds focus, dropping focus to <body> mid-task. Keeping the
 * control focusable preserves the keyboard position while still refusing the
 * move (APG "focusable disabled control" convention).
 */
function MoveButton({ direction, label, disabled, onClick }) {
  const icon = direction === 'up' ? 'arrow-up' : 'arrow-down';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-disabled={disabled || undefined}
      draggable={false}
      onClick={(event) => {
        event.stopPropagation();
        if (!disabled) onClick(event);
      }}
      onKeyDown={(event) => {
        if (!disabled) return;
        if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
      }}
      onMouseDown={(event) => event.stopPropagation()}
      style={{
        width: 28,
        height: 28,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-sm)',
        background: disabled
          ? 'var(--color-semantic-fill-normal)'
          : 'var(--color-semantic-background-elevated-normal)',
        color: disabled
          ? 'var(--color-semantic-label-disable)'
          : 'var(--color-semantic-label-neutral)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: 1,
        fontFamily: 'var(--font-sans)',
        lineHeight: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Icon name={icon} size={15} aria-hidden="true" />
    </button>
  );
}

/**
 * LDS Product Content — ReorderList
 * Generic sortable list primitive for reordering dashboards, queues, rules, or
 * other peer rows. Task-step authoring should use StepList instead.
 */
export function ReorderList({
  items = [],
  onReorder,
  density = 'comfortable',
  showIndex = false,
  showMoveButtons = true,
  disabled = false,
  emptyLabel = '정렬할 항목이 없습니다.',
  getItemLabel,
  style,
  role = 'list',
  'aria-label': ariaLabel,
  ...rest
}) {
  const [dragId, setDragId] = React.useState(null);
  const [dropTarget, setDropTarget] = React.useState(null);
  const [focusId, setFocusId] = React.useState(null);
  const [hoverId, setHoverId] = React.useState(null);
  const [announcement, setAnnouncement] = React.useState('');
  const ids = items.map((item) => item.id);
  const instructionId = React.useId();
  const liveId = React.useId();
  const cfg = DENSITY[density] || DENSITY.comfortable;
  const listCanReorder = !disabled && typeof onReorder === 'function';

  const getAccessibleLabel = (item, index) => {
    if (getItemLabel) return getItemLabel(item, index);
    return nodeLabel(item?.label, `${index + 1}번째 항목`);
  };

  const move = (from, to, reason) => {
    if (!listCanReorder || from < 0 || from >= ids.length) return false;
    const boundedTo = Math.max(0, Math.min(to, ids.length - 1));
    if (from === boundedTo) return false;

    const activeItem = items[from];
    if (activeItem?.disabled) return false;

    const next = ids.slice();
    next.splice(boundedTo, 0, next.splice(from, 1)[0]);
    onReorder && onReorder(next, {
      activeId: activeItem.id,
      from,
      to: boundedTo,
      reason,
    });
    setAnnouncement(`${getAccessibleLabel(activeItem, boundedTo)} ${boundedTo + 1}/${ids.length} 위치로 이동`);
    return true;
  };

  const handleDrop = (event, item, index) => {
    event.preventDefault();
    if (!listCanReorder || dragId == null || item.disabled) return;

    const from = ids.indexOf(dragId);
    const position = dropTarget?.id === item.id ? dropTarget.position : 'before';
    let to = index + (position === 'after' ? 1 : 0);
    if (from < to) to -= 1;

    move(from, to, 'drag');
    setDragId(null);
    setDropTarget(null);
  };

  const gridColumns = [
    `${HANDLE_COLUMN_WIDTH}px`,
    showIndex ? `${INDEX_COLUMN_WIDTH}px` : null,
    'minmax(0, 1fr)',
    showMoveButtons || items.some((item) => item.trailing != null) ? 'auto' : null,
  ].filter(Boolean).join(' ');

  return (
    <>
      <span id={instructionId} style={hiddenStyle}>
        Alt와 위쪽 또는 아래쪽 화살표 키로 항목 순서를 바꿀 수 있습니다.
      </span>
      <span id={liveId} role="status" aria-live="polite" style={hiddenStyle}>
        {announcement}
      </span>

      <ul
        role={role}
        aria-label={ariaLabel || '정렬 가능한 목록'}
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 4,
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          overflow: 'hidden',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-semantic-background-elevated-normal)',
          fontFamily: 'var(--font-sans)',
          ...style,
        }}
        {...rest}
      >
        {items.length === 0 && (
          <li
            aria-disabled="true"
            style={{
              minHeight: cfg.minHeight,
              display: 'flex',
              alignItems: 'center',
              padding: cfg.padding,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-semantic-label-neutral)',
              fontSize: cfg.detailSize,
              lineHeight: cfg.detailLine,
              boxSizing: 'border-box',
            }}
          >
            {emptyLabel}
          </li>
        )}

        {items.map((item, index) => {
          const itemDisabled = disabled || item.disabled;
          const reorderDisabled = itemDisabled || !listCanReorder;
          const label = getAccessibleLabel(item, index);
          const dragging = dragId === item.id;
          const focused = focusId === item.id;
          const hovered = hoverId === item.id;
          const dropBefore = !dragging && dropTarget?.id === item.id && dropTarget.position === 'before';
          const dropAfter = !dragging && dropTarget?.id === item.id && dropTarget.position === 'after';
          const canMoveUp = !reorderDisabled && index > 0;
          const canMoveDown = !reorderDisabled && index < items.length - 1;
          const hasTrailing = item.trailing != null || showMoveButtons;
          const dividerLeft =
            cfg.paddingX + HANDLE_COLUMN_WIDTH + cfg.gap + (showIndex ? INDEX_COLUMN_WIDTH + cfg.gap : 0);
          const dividerRight = cfg.paddingX + (hasTrailing ? TRAILING_DIVIDER_OFFSET : 0);

          return (
            <li
              key={item.id}
              role="listitem"
              aria-roledescription="정렬 가능한 항목"
              aria-posinset={index + 1}
              aria-setsize={items.length}
              aria-disabled={itemDisabled || undefined}
              aria-describedby={reorderDisabled ? undefined : `${instructionId} ${liveId}`}
              aria-label={`${index + 1}/${items.length}. ${label}`}
              tabIndex={reorderDisabled ? -1 : 0}
              draggable={!reorderDisabled}
              onDragStart={(event) => {
                if (reorderDisabled) return;
                setDragId(item.id);
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(item.id));
              }}
              onDragEnd={() => {
                setDragId(null);
                setDropTarget(null);
              }}
              onDragOver={(event) => {
                if (reorderDisabled || dragId == null) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                const rect = event.currentTarget.getBoundingClientRect();
                const position = event.clientY > rect.top + rect.height / 2 ? 'after' : 'before';
                setDropTarget({ id: item.id, position });
              }}
              onDragLeave={(event) => {
                const nextTarget = event.relatedTarget;
                if (!nextTarget || !event.currentTarget.contains(nextTarget)) setDropTarget(null);
              }}
              onDrop={(event) => handleDrop(event, item, index)}
              onKeyDown={(event) => {
                if (reorderDisabled || !event.altKey) return;
                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  move(index, index - 1, 'keyboard');
                }
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  move(index, index + 1, 'keyboard');
                }
              }}
              onFocus={() => setFocusId(item.id)}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget;
                if (!nextTarget || !event.currentTarget.contains(nextTarget)) setFocusId(null);
              }}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                position: 'relative',
                margin: 0,
                opacity: dragging ? 0.58 : 1,
                outline: 'none',
              }}
            >
              {(dropBefore || dropAfter) && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    [dropBefore ? 'top' : 'bottom']: 0,
                    zIndex: 1,
                    height: 2,
                    background: 'var(--color-semantic-primary-normal)',
                    boxShadow: '0 0 0 1px var(--color-semantic-primary-surface-normal)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridColumns,
                  alignItems: 'center',
                  gap: cfg.gap,
                  minHeight: cfg.minHeight,
                  padding: cfg.padding,
                  position: 'relative',
                  boxSizing: 'border-box',
                  borderRadius: 'var(--radius-sm)',
                  background: itemDisabled
                    ? 'transparent'
                    : focused && !reorderDisabled
                      ? 'var(--color-semantic-fill-normal)'
                      : hovered || dragging
                        ? 'var(--color-semantic-fill-alternative)'
                        : 'transparent',
                  boxShadow: focused && !reorderDisabled ? 'inset 0 0 0 2px var(--color-semantic-focus-indicator)' : 'none',
                  cursor: itemDisabled ? 'not-allowed' : reorderDisabled ? 'default' : dragging ? 'grabbing' : 'grab',
                  transition: 'background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
                }}
              >
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: dividerLeft,
                      right: dividerRight,
                      top: 0,
                      height: 1,
                      background: 'var(--color-semantic-line-normal-normal)',
                      opacity: 0.72,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <span
                  aria-hidden="true"
                  style={{
                    width: HANDLE_COLUMN_WIDTH,
                    height: 24,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: itemDisabled || reorderDisabled
                      ? 'var(--color-semantic-label-disable)'
                      : focused
                        ? 'var(--color-semantic-primary-normal)'
                        : 'var(--color-semantic-label-assistive)',
                    cursor: itemDisabled ? 'not-allowed' : reorderDisabled ? 'default' : dragging ? 'grabbing' : 'grab',
                  }}
                >
                  <Icon name="handle" size={18} aria-hidden="true" />
                </span>

              {showIndex && (
                <span
                  aria-hidden="true"
                  style={{
                    color: itemDisabled
                      ? 'var(--color-semantic-label-disable)'
                      : 'var(--color-semantic-label-neutral)',
                    fontSize: cfg.detailSize,
                    lineHeight: cfg.detailLine,
                    fontWeight: 'var(--fw-semibold)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: 0,
                  }}
                >
                  {index + 1}
                </span>
              )}

              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: itemDisabled
                      ? 'var(--color-semantic-label-disable)'
                      : 'var(--color-semantic-label-normal)',
                    fontSize: cfg.titleSize,
                    lineHeight: cfg.titleLine,
                    fontWeight: 'var(--fw-semibold)',
                    letterSpacing: 0,
                  }}
                >
                  {item.label}
                </span>
                {item.detail != null && (
                  <span
                    style={{
                      display: 'block',
                      minWidth: 0,
                      marginTop: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: itemDisabled
                        ? 'var(--color-semantic-label-disable)'
                        : 'var(--color-semantic-label-neutral)',
                      fontSize: cfg.detailSize,
                      lineHeight: cfg.detailLine,
                      fontWeight: 'var(--fw-medium)',
                      letterSpacing: 0,
                    }}
                  >
                    {item.detail}
                  </span>
                )}
              </span>

              {(item.trailing != null || showMoveButtons) && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 6,
                    minWidth: 0,
                    color: itemDisabled
                      ? 'var(--color-semantic-label-disable)'
                      : 'var(--color-semantic-label-neutral)',
                  }}
                >
                  {item.trailing != null && (
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.trailing}
                    </span>
                  )}
                  {showMoveButtons && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <MoveButton
                        direction="up"
                        label={`${label} 위로 이동`}
                        disabled={!canMoveUp}
                        onClick={() => move(index, index - 1, 'button')}
                      />
                      <MoveButton
                        direction="down"
                        label={`${label} 아래로 이동`}
                        disabled={!canMoveDown}
                        onClick={() => move(index, index + 1, 'button')}
                      />
                    </span>
                  )}
                </span>
              )}
            </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
