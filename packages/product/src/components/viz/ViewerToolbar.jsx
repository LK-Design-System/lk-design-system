import React from 'react';
import { IconButton } from '@lk-robotics/lds-core/components/buttons/IconButton';
import { ToggleIcon } from '@lk-robotics/lds-core/components/buttons/ToggleIcon';
import { Toolbar } from '../navigation/Toolbar.jsx';

const ViewerToolbarAppearanceContext = React.createContext('minimal');

const TOOLBAR_APPEARANCES = {
  surface: {
    gap: 2,
    padding: 2,
    background: 'var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))',
    border: '1px solid var(--viewer-border, var(--color-semantic-line-normal-normal))',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  minimal: {
    gap: 2,
    padding: 0,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
  },
  'on-dark': {
    gap: 2,
    padding: 2,
    background: 'color-mix(in srgb, var(--viewer-surface-elevated, #101b26) 94%, transparent)',
    border: '1px solid color-mix(in srgb, var(--color-semantic-static-white) 20%, transparent)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 2px 8px color-mix(in srgb, var(--color-semantic-static-black) 24%, transparent)',
    backdropFilter: 'blur(8px)',
  },
};

/**
 * LDS Product — ViewerToolbar
 * Viewport-local command/toggle group with one roving Tab stop.
 */
export function ViewerToolbar({
  children,
  orientation = 'vertical',
  appearance = 'minimal',
  label = '뷰어 컨트롤',
  style,
  onKeyDown,
  onFocusCapture,
  ...rootProps
}) {
  const resolvedAppearance = TOOLBAR_APPEARANCES[appearance] ? appearance : 'minimal';
  return (
    <ViewerToolbarAppearanceContext.Provider value={resolvedAppearance}>
      <Toolbar
        {...rootProps}
        label={label}
        orientation={orientation}
        itemSelector="[data-lk-viewer-toolbar-item]"
        data-viewer-toolbar-appearance={resolvedAppearance}
        stopNavigationPropagation
        onKeyDown={onKeyDown}
        onFocusCapture={onFocusCapture}
        style={{
          width: 'fit-content',
          maxWidth: '100%',
          boxSizing: 'border-box',
          ...TOOLBAR_APPEARANCES[resolvedAppearance],
          ...(resolvedAppearance === 'on-dark'
            ? { '--viewer-foreground': 'var(--color-semantic-static-white)' }
            : null),
          ...style,
        }}
      >
        {children}
      </Toolbar>
    </ViewerToolbarAppearanceContext.Provider>
  );
}

/** A command or persistent toggle inside ViewerToolbar. */
export function ViewerToolbarButton({
  children,
  kind,
  pressed,
  defaultPressed = false,
  onPressedChange,
  active,
  label,
  style,
  disabled = false,
  type = 'button',
  tabIndex,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...buttonProps
}) {
  const inferredToggle = pressed !== undefined || active !== undefined;
  const resolvedKind = kind ?? (inferredToggle ? 'toggle' : 'command');
  const commonProps = {
    ...buttonProps,
    type,
    disabled,
    label,
    title: label,
    size: 28,
    tabIndex: tabIndex ?? 0,
    'data-lk-viewer-toolbar-item': '',
    'data-lk-toolbar-key': buttonProps['data-lk-toolbar-key'] ?? label,
    className: ['lk-viewer-toolbar__button', className].filter(Boolean).join(' '),
    onClick,
    onMouseEnter,
    onMouseLeave,
    style: { flex: '0 0 auto', width: 28, height: 28, padding: 0, ...style },
  };
  const icon = (
    <span aria-hidden="true" style={{ width: 16, height: 16, display: 'inline-grid', placeItems: 'center', flex: '0 0 auto' }}>
      {children}
    </span>
  );

  if (resolvedKind === 'toggle') {
    const controlledPressed = pressed ?? active;
    return (
      <ToggleIcon
        {...commonProps}
        variant="plain"
        pressed={controlledPressed}
        defaultPressed={defaultPressed}
        onChange={onPressedChange}
      >
        {icon}
      </ToggleIcon>
    );
  }

  return (
    <IconButton
      {...commonProps}
      round={false}
      variant="plain"
    >
      {icon}
    </IconButton>
  );
}
