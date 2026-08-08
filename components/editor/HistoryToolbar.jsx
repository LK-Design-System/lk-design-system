import React from 'react';
import { IconButton } from '@lk-design-system/lds-core/components/buttons/IconButton';
import { Divider } from '@lk-design-system/lds-core/components/content/Divider';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { Toolbar } from '../navigation/Toolbar.jsx';

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
  onFocusCapture,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const undoEnabled = canUndo && typeof onUndo === 'function';
  const redoEnabled = canRedo && typeof onRedo === 'function';
  const resetVisible = typeof onReset === 'function';
  const actions = [
    { key: 'undo', label: '실행 취소', icon: <Icon name="flip-backward" size={16} aria-hidden="true" />, enabled: undoEnabled, onClick: onUndo, shortcuts: undoKeyShortcuts },
    { key: 'redo', label: '다시 실행', icon: <span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}><Icon name="flip-backward" size={16} aria-hidden="true" /></span>, enabled: redoEnabled, onClick: onRedo, shortcuts: redoKeyShortcuts },
    ...(resetVisible ? [{ key: 'reset', label: '변경사항 초기화', icon: <Icon name="reset" size={16} aria-hidden="true" />, enabled: true, onClick: onReset }] : []),
  ];
  const enabledActions = actions.filter((action) => action.enabled);
  const preferredKey = enabledActions[0]?.key;
  return (
    <Toolbar
      role={role}
      aria-label={ariaLabel}
      label={label}
      orientation="horizontal"
      itemSelector="[data-lk-history-toolbar-item]"
      preferredItemKey={preferredKey}
      aria-disabled={enabledActions.length === 0 || undefined}
      tabIndex={enabledActions.length === 0 ? (tabIndex ?? 0) : tabIndex}
      onKeyDown={onKeyDown}
      onFocusCapture={onFocusCapture}
      style={{
        gap: 'var(--space-1)',
        padding: 0,
        background: 'transparent',
        border: 0,
        borderRadius: 0,
        boxShadow: 'none',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {actions.map((action, index) => (
        <React.Fragment key={action.key}>
          {action.key === 'reset' && (
            <Divider vertical style={{ minHeight: size === 'md' ? 24 : 20, marginInline: 'var(--space-1)', alignSelf: 'center' }} />
          )}
          <IconButton
            data-history-index={index}
            data-lk-history-toolbar-item=""
            data-lk-toolbar-key={action.key}
            /* `plain`: the Toolbar above owns the surface (transparent
               background, no border of its own), which is the grouped-toolbar
               case `plain` exists for. A hairline box per button is for controls
               floating over content that must assert their own boundary — see
               `ViewerToolbar`, which sits on the same editor screen. */
            variant="plain"
            round={false}
            size={size}
            disabled={!action.enabled}
            onClick={action.enabled ? action.onClick : undefined}
            tabIndex={action.enabled && action.key === preferredKey ? 0 : -1}
            title={action.label}
            label={action.label}
            aria-keyshortcuts={action.shortcuts}
          >
            {action.icon}
          </IconButton>
        </React.Fragment>
      ))}
    </Toolbar>
  );
}
