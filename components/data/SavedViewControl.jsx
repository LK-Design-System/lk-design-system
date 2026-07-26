import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { StatusBadge } from '../content/StatusBadge.jsx';
import { Spinner } from '../status/Spinner.jsx';

const HEIGHTS = {
  sm: 'var(--control-h-sm)',
  md: 'var(--control-h-md)',
  lg: 'var(--control-h-lg)',
};

// Library-standard visually-hidden recipe (DataGrid, Chip, ToastStack): out of
// flow, so the always-mounted announcer adds no grid track or gap.
const SR_ONLY_STYLE = {
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

/**
 * LK Product Data — SavedViewControl
 *
 * A controlled selector for named data or dashboard views. Persistence, URL
 * synchronization, permissions, confirmations, and action flows stay with the
 * product; this component only exposes the selected id and places action slots.
 */
export function SavedViewControl({
  views = [],
  value,
  onChange,
  label = '저장된 보기',
  placeholder = '보기를 선택해 주세요.',
  emptyLabel = '저장된 보기가 없습니다.',
  dirty = false,
  dirtyLabel = '저장되지 않은 변경',
  saving = false,
  savingLabel = '저장 중',
  saveAction,
  saveAsAction,
  renameAction,
  deleteAction,
  disabled = false,
  size = 'sm',
  selectId,
  name,
  className,
  style,
  role = 'group',
  'aria-label': ariaLabel,
  ...rest
}) {
  const autoId = React.useId();
  const controlId = selectId || `saved-view-${autoId}`;
  const labelId = `${controlId}-label`;
  const statusId = `${controlId}-status`;
  const hasVisibleLabel = label != null;
  // Saving wins over dirty because the visible slot shows the same precedence.
  const statusText = saving ? savingLabel : dirty ? dirtyLabel : '';
  const normalizedSize = HEIGHTS[size] ? size : 'sm';
  const actions = [saveAction, saveAsAction, renameAction, deleteAction].filter((action) => action != null);
  const selectDisabled = disabled || views.length === 0 || typeof onChange !== 'function';

  return (
    <div
      className={['lk-saved-view-control', className].filter(Boolean).join(' ')}
      data-saved-view-control=""
      role={role}
      aria-label={ariaLabel || (!hasVisibleLabel ? '저장된 보기' : undefined)}
      aria-labelledby={!ariaLabel && hasVisibleLabel ? labelId : undefined}
      aria-busy={saving || undefined}
      style={{
        display: 'grid',
        gap: 8,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <style>{`
        .lk-saved-view-control__select:focus-visible {
          outline: none;
          border-color: var(--color-semantic-primary-normal);
          box-shadow: 0 0 0 4px var(--color-semantic-focus-ring);
        }
      `}</style>

      {hasVisibleLabel && (
        <label
          id={labelId}
          htmlFor={controlId}
          style={{
            color: 'var(--color-semantic-label-normal)',
            fontSize: 'var(--component-input-label-font-size)',
            lineHeight: 'var(--component-input-label-line-height)',
            fontWeight: 'var(--component-input-label-font-weight)',
            letterSpacing: 'var(--component-input-label-letter-spacing)',
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          width: '100%',
          minWidth: 0,
        }}
      >
        <span
          style={{
            position: 'relative',
            display: 'block',
            flex: '1 1 200px',
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
          <select
            id={controlId}
            className="lk-saved-view-control__select"
            name={name}
            value={value ?? ''}
            disabled={selectDisabled}
            aria-label={!hasVisibleLabel ? (ariaLabel || '저장된 보기') : undefined}
            /* Dirty/saving is otherwise only visible next to the control, so a
               screen-reader user focused on the select would not know the
               current view has unsaved changes. */
            aria-describedby={statusId}
            onChange={(event) => onChange && onChange(event.currentTarget.value, event)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              display: 'block',
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              height: HEIGHTS[normalizedSize],
              paddingBlock: 0,
              paddingInlineStart: 'var(--component-input-padding-x)',
              paddingInlineEnd: 36,
              overflow: 'hidden',
              border: '1px solid var(--color-semantic-line-solid-normal)',
              borderRadius: 'var(--radius-input)',
              background: selectDisabled
                ? 'var(--color-semantic-fill-normal)'
                : 'var(--color-semantic-background-elevated-normal)',
              color: selectDisabled
                ? 'var(--color-semantic-label-disable)'
                : 'var(--color-semantic-label-normal)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--component-input-font-size)',
              lineHeight: 'var(--component-input-line-height)',
              letterSpacing: 'var(--component-input-letter-spacing)',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: selectDisabled ? 'not-allowed' : 'pointer',
              transition: 'var(--component-button-transition)',
            }}
          >
            <option value="" disabled={views.length > 0}>
              {views.length > 0 ? placeholder : emptyLabel}
            </option>
            {views.map((view) => (
              <option key={view.id} value={view.id} disabled={view.disabled}>
                {view.label}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              insetInlineEnd: 12,
              top: '50%',
              display: 'inline-flex',
              color: selectDisabled
                ? 'var(--color-semantic-label-disable)'
                : 'var(--color-semantic-label-alternative)',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <Icon name="chevron-down" size={16} aria-hidden="true" />
          </span>
        </span>

        {/* The visible slot is presentation only: both of these mount and
            unmount with the state they describe, and the persistent announcer
            below owns the announcement so it is never a brand-new live region.
            Spinner's own status role is switched off here for the same reason
            (it would otherwise announce the saving state a second time). */}
        {saving ? (
          <Spinner
            size={14}
            thickness={2}
            label={savingLabel}
            role={undefined}
            aria-live={undefined}
            style={{
              flex: '0 0 auto',
              color: 'var(--color-semantic-label-neutral)',
              fontSize: 'var(--label2-size)',
              whiteSpace: 'nowrap',
            }}
          />
        ) : dirty ? (
          <StatusBadge tone="cautionary" style={{ flex: '0 0 auto' }}>
            {dirtyLabel}
          </StatusBadge>
        ) : null}

        {actions.length > 0 && (
          <span
            aria-label="저장된 보기 작업"
            role="group"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flex: '0 1 auto',
              flexWrap: 'wrap',
              gap: 'var(--space-1-5)',
              minWidth: 0,
              maxWidth: '100%',
            }}
          >
            {actions.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
          </span>
        )}
      </div>

      {/* Mounted for the whole life of the control; only its text changes. A
          live region inserted together with its first message is not reliably
          announced (same contract as ToastStack's persistent regions). */}
      <span
        id={statusId}
        data-saved-view-status=""
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={SR_ONLY_STYLE}
      >
        {statusText}
      </span>
    </div>
  );
}
