import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { Divider } from '../content/Divider.jsx';
import { Icon } from '../icon/Icon.jsx';
import { HistoryToolbar } from './HistoryToolbar.jsx';

function actionKey(action, index) {
  return action.key ?? action.value ?? action.label ?? index;
}

function actionIcon(icon) {
  if (typeof icon === 'string') return <Icon name={icon} size={16} aria-hidden="true" />;
  return icon;
}

function CommandButton({ action, size, index, tabStopIndex, onFocus }) {
  const disabled = !!action.disabled || typeof action.onClick !== 'function';
  const active = !!action.active;

  return (
    <IconButton
      data-command-index={index}
      variant={active ? 'signal' : 'ghost'}
      round={false}
      size={size}
      label={action.label}
      title={action.label}
      aria-pressed={action.active === undefined ? undefined : active}
      aria-keyshortcuts={action.ariaKeyShortcuts}
      disabled={disabled}
      tabIndex={!disabled && index === tabStopIndex ? 0 : -1}
      onFocus={onFocus}
      onClick={disabled ? undefined : action.onClick}
    >
      {actionIcon(action.icon)}
    </IconButton>
  );
}

function ActionToolbar({ actions, label, size }) {
  const toolbarRef = React.useRef(null);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const enabledIndices = actions.reduce((indices, action, index) => {
    if (!action.disabled && typeof action.onClick === 'function') indices.push(index);
    return indices;
  }, []);
  const tabStopIndex = enabledIndices.includes(focusIndex) ? focusIndex : enabledIndices[0];

  const moveFocus = (event) => {
    if (!enabledIndices.length) return;
    const currentIndex = enabledIndices.indexOf(focusIndex);
    let nextIndex;

    if (event.key === 'Home') nextIndex = enabledIndices[0];
    else if (event.key === 'End') nextIndex = enabledIndices[enabledIndices.length - 1];
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = enabledIndices[(Math.max(0, currentIndex) + 1) % enabledIndices.length];
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = enabledIndices[(currentIndex <= 0 ? enabledIndices.length : currentIndex) - 1];
    } else return;

    event.preventDefault();
    setFocusIndex(nextIndex);
    toolbarRef.current?.querySelector(`[data-command-index="${nextIndex}"]`)?.focus();
  };

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label={label}
      aria-orientation="horizontal"
      aria-disabled={enabledIndices.length === 0 || undefined}
      tabIndex={enabledIndices.length === 0 ? 0 : undefined}
      onKeyDown={moveFocus}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}
    >
      {actions.map((action, index) => (
        <CommandButton
          key={actionKey(action, index)}
          action={action}
          size={size}
          index={index}
          tabStopIndex={tabStopIndex}
          onFocus={() => setFocusIndex(index)}
        />
      ))}
    </div>
  );
}

function visibleActions(actions) {
  return actions.filter(
    (action) => action && !action.hidden && (typeof action.onClick === 'function' || action.disabled),
  );
}

/**
 * LK ROBOTICS - CanvasEditorCommandBar
 * Stable document-level commands for CanvasEditorShell: history first, then
 * document actions such as save/export. Viewport zoom, fit, and camera controls
 * belong beside the viewport; `viewActions` remains a deprecated compatibility
 * group so existing consumers can migrate without a breaking release.
 */
export function CanvasEditorCommandBar({
  label = '문서 편집 명령',
  documentLabel = '문서 명령',
  documentActions = [],
  viewLabel = '호환 뷰 명령',
  viewActions = [],
  size = 'sm',
  showHistory = true,
  historyLabel = '편집 이력',
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onReset,
  undoKeyShortcuts,
  redoKeyShortcuts,
  children,
  extraLabel = '문서 작업',
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const actions = visibleActions(documentActions);
  const legacyViewActions = visibleActions(viewActions);
  const groups = [];

  if (showHistory) {
    groups.push({
      key: 'history',
      node: (
        <HistoryToolbar
          label={historyLabel}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          onReset={onReset}
          undoKeyShortcuts={undoKeyShortcuts}
          redoKeyShortcuts={redoKeyShortcuts}
          size={size}
        />
      ),
    });
  }

  if (actions.length > 0) {
    groups.push({ key: 'document', node: <ActionToolbar actions={actions} label={documentLabel} size={size} /> });
  }

  if (legacyViewActions.length > 0) {
    groups.push({ key: 'legacy-view', node: <ActionToolbar actions={legacyViewActions} label={viewLabel} size={size} /> });
  }

  if (children != null) {
    groups.push({
      key: 'extra',
      node: (
        <div role="group" aria-label={extraLabel} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {children}
        </div>
      ),
    });
  }

  return (
    <div
      {...rest}
      role="group"
      aria-label={ariaLabel ?? label}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0, ...style }}
    >
      {groups.map((group, index) => (
        <React.Fragment key={group.key}>
          {index > 0 && (
            <Divider
              vertical
              style={{ minHeight: size === 'md' ? 24 : 20, marginInline: 'var(--space-1)', alignSelf: 'center' }}
            />
          )}
          {group.node}
        </React.Fragment>
      ))}
    </div>
  );
}
