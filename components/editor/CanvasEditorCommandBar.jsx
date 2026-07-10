import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { HistoryToolbar } from './HistoryToolbar.jsx';

function actionKey(action, index) {
  return action.key ?? action.value ?? action.label ?? index;
}

function actionIcon(icon) {
  if (typeof icon === 'string') return <Icon name={icon} size={16} aria-hidden="true" />;
  return icon;
}

function CommandButton({ action }) {
  const disabled = !!action.disabled;
  const active = !!action.active;
  return (
    <button
      type="button"
      aria-label={action.label}
      title={action.label}
      aria-pressed={action.active === undefined ? undefined : active}
      disabled={disabled}
      onClick={action.onClick}
      style={{
        width: 34,
        height: 34,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--lk-accent-tint)' : 'var(--color-semantic-background-elevated-normal)',
        color: active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-neutral)',
        lineHeight: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      }}
    >
      {actionIcon(action.icon)}
    </button>
  );
}

/**
 * LK ROBOTICS - CanvasEditorCommandBar
 * Shared top command bar for CanvasEditorShell. It keeps history actions in one
 * stable place and only renders viewer actions when the product wires real
 * handlers, preventing decorative or fake icon buttons in editor shells.
 */
export function CanvasEditorCommandBar({
  label = '캔버스 편집 명령',
  viewLabel = '뷰어 명령',
  viewActions = [],
  showHistory = true,
  historyLabel = '편집 이력',
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onReset,
  children,
  extraLabel = '추가 명령',
  style,
  ...rest
}) {
  const actions = viewActions.filter((action) => action && !action.hidden && (action.onClick || action.disabled));
  const undoEnabled = canUndo && typeof onUndo === 'function';
  const redoEnabled = canRedo && typeof onRedo === 'function';
  return (
    <div
      role="group"
      aria-label={label}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, ...style }}
      {...rest}
    >
      {actions.length > 0 && (
        <div role="toolbar" aria-label={viewLabel} aria-orientation="horizontal" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {actions.map((action, index) => (
            <CommandButton
              key={actionKey(action, index)}
              action={action}
            />
          ))}
        </div>
      )}
      {showHistory && (
        <HistoryToolbar
          role="toolbar"
          aria-label={historyLabel}
          canUndo={undoEnabled}
          canRedo={redoEnabled}
          onUndo={onUndo}
          onRedo={onRedo}
          onReset={onReset}
        />
      )}
      {children != null && (
        <div role="group" aria-label={extraLabel} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {children}
        </div>
      )}
    </div>
  );
}
