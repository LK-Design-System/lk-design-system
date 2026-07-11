import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { Divider } from '../content/Divider.jsx';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — HistoryToolbar
 * Undo / redo / reset controls for editors. Availability is derived from both
 * history state and a real handler so a visually enabled command is always
 * operable. Arrow keys, Home, and End move within the toolbar.
 */
export function HistoryToolbar({
  label = '편집 이력',
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onReset,
  undoKeyShortcuts,
  redoKeyShortcuts,
  size = 'sm',
  role = 'toolbar',
  tabIndex,
  onKeyDown,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const toolbarRef = React.useRef(null);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const undoEnabled = canUndo && typeof onUndo === 'function';
  const redoEnabled = canRedo && typeof onRedo === 'function';
  const resetVisible = typeof onReset === 'function';
  const actions = [
    { key: 'undo', label: '실행 취소', icon: <Icon name="flip-backward" size={16} aria-hidden="true" />, enabled: undoEnabled, onClick: onUndo, shortcuts: undoKeyShortcuts },
    { key: 'redo', label: '다시 실행', icon: <span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}><Icon name="flip-backward" size={16} aria-hidden="true" /></span>, enabled: redoEnabled, onClick: onRedo, shortcuts: redoKeyShortcuts },
    ...(resetVisible ? [{ key: 'reset', label: '변경사항 초기화', icon: <Icon name="reset" size={16} aria-hidden="true" />, enabled: true, onClick: onReset }] : []),
  ];
  const enabledIndices = actions.reduce((indices, action, index) => {
    if (action.enabled) indices.push(index);
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
    toolbarRef.current?.querySelector(`[data-history-index="${nextIndex}"]`)?.focus();
  };

  return (
    <div
      ref={toolbarRef}
      role={role}
      aria-label={ariaLabel ?? label}
      aria-orientation={role === 'toolbar' ? 'horizontal' : undefined}
      aria-disabled={enabledIndices.length === 0 || undefined}
      tabIndex={enabledIndices.length === 0 ? (tabIndex ?? 0) : tabIndex}
      onKeyDown={(event) => {
        moveFocus(event);
        onKeyDown?.(event);
      }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {actions.map((action, index) => (
        <React.Fragment key={action.key}>
          {action.key === 'reset' && (
            <Divider vertical style={{ minHeight: size === 'md' ? 24 : 20, marginInline: 'var(--space-1)', alignSelf: 'center' }} />
          )}
          <IconButton
            data-history-index={index}
            variant="ghost"
            round={false}
            size={size}
            disabled={!action.enabled}
            onClick={action.enabled ? action.onClick : undefined}
            onFocus={() => setFocusIndex(index)}
            tabIndex={action.enabled && index === tabStopIndex ? 0 : -1}
            title={action.label}
            label={action.label}
            aria-keyshortcuts={action.shortcuts}
          >
            {action.icon}
          </IconButton>
        </React.Fragment>
      ))}
    </div>
  );
}
