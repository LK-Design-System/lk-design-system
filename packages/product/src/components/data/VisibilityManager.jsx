import React from 'react';
import { ReorderList } from '../content/ReorderList.jsx';
import { Checkbox } from '@lk-robotics/lds-core/components/forms/Checkbox';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

function textLabel(node, fallback) {
  return typeof node === 'string' || typeof node === 'number' ? String(node) : fallback;
}

function LockedLabel() {
  return (
    <span
      title="표시 설정 고정"
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 22,
        padding: '0 7px',
        flexShrink: 0,
        boxSizing: 'border-box',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-semantic-fill-normal)',
        color: 'var(--color-semantic-label-neutral)',
        fontSize: 'var(--caption1-size)',
        lineHeight: 'var(--caption1-line)',
        fontWeight: 'var(--fw-semibold)',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="lock" size={12} aria-hidden="true" />
      <span>고정</span>
    </span>
  );
}

/**
 * LK Product Data — VisibilityManager
 *
 * Controlled visibility and peer ordering for table columns or dashboard
 * widgets. ReorderList supplies drag, explicit buttons, and Alt+Arrow keyboard
 * movement; persistence and apply/reset behavior remain product-owned.
 */
export function VisibilityManager({
  items = [],
  onVisibilityChange,
  onOrderChange,
  title = '표시 및 순서',
  description,
  resetAction,
  density = 'compact',
  disabled = false,
  emptyLabel = '관리할 항목이 없습니다.',
  listLabel = '표시 및 순서를 관리할 항목',
  className,
  style,
  role = 'group',
  'aria-label': ariaLabel,
  ...rest
}) {
  const titleId = React.useId();
  const visibilityDisabled = disabled || typeof onVisibilityChange !== 'function';
  const orderDisabled = disabled || typeof onOrderChange !== 'function';
  const mappedItems = items.map((item, index) => {
    const accessibleText = item.accessibleLabel || textLabel(item.label, `${index + 1}번째 항목`);
    const visibleText = item.visible ? '표시됨' : '숨김';
    const lockedText = item.locked ? ', 표시 설정 고정' : '';

    return {
      id: item.id,
      label: item.label,
      detail: item.description,
      accessibleText: `${accessibleText}, ${visibleText}${lockedText}`,
      disabled,
      trailing: (
        <span
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onMouseDown={(event) => event.stopPropagation()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
          {item.locked && <LockedLabel />}
          <Checkbox
            checked={Boolean(item.visible)}
            disabled={visibilityDisabled || item.locked}
            aria-label={item.locked ? `${accessibleText} 표시 설정 고정됨` : `${accessibleText} 표시`}
            onChange={(nextVisible) => {
              if (!visibilityDisabled && !item.locked) {
                onVisibilityChange(item.id, nextVisible);
              }
            }}
            tight
          />
        </span>
      ),
    };
  });

  const hasHeader = title != null || description != null || resetAction != null;

  return (
    <div
      className={['lk-visibility-manager', className].filter(Boolean).join(' ')}
      data-visibility-manager=""
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={!ariaLabel && title != null ? titleId : undefined}
      style={{
        display: 'grid',
        gap: 10,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {hasHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            minWidth: 0,
          }}
        >
          {(title != null || description != null) && (
            <span style={{ display: 'grid', gap: 3, flex: '1 1 180px', minWidth: 0 }}>
              {title != null && (
                <span
                  id={titleId}
                  style={{
                    minWidth: 0,
                    color: 'var(--color-semantic-label-strong)',
                    fontSize: 'var(--label1-size)',
                    lineHeight: 'var(--label1-line)',
                    fontWeight: 'var(--fw-bold)',
                    letterSpacing: 0,
                  }}
                >
                  {title}
                </span>
              )}
              {description != null && (
                <span
                  style={{
                    minWidth: 0,
                    color: 'var(--color-semantic-label-neutral)',
                    fontSize: 'var(--label2-size)',
                    lineHeight: 'var(--label2-reading-line)',
                    fontWeight: 'var(--fw-medium)',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {description}
                </span>
              )}
            </span>
          )}
          {resetAction != null && (
            <span style={{ display: 'inline-flex', flex: '0 0 auto', maxWidth: '100%' }}>
              {resetAction}
            </span>
          )}
        </div>
      )}

      <ReorderList
        items={mappedItems}
        onReorder={onOrderChange}
        density={density}
        showMoveButtons={!orderDisabled}
        disabled={disabled}
        emptyLabel={emptyLabel}
        getItemLabel={(item) => item.accessibleText}
        aria-label={listLabel}
      />
    </div>
  );
}
