import React from 'react';
import { IconButton } from '@lk-design-system/lds-core/components/buttons/IconButton';
import { ToggleIcon } from '@lk-design-system/lds-core/components/buttons/ToggleIcon';
import { Toolbar } from '../navigation/Toolbar.jsx';
import { VIEWER_OVERLAY_SURFACE } from './_viewerOverlaySurface.js';

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
  // The overlay-surface family module owns this recipe (strong level: the
  // toolbar is chrome the operator reads and clicks, so legibility outranks
  // seeing through it). The old inline copy carried a raw #101b26 fallback the
  // family has since replaced with the static-black token.
  'on-dark': {
    gap: 2,
    padding: 2,
    background: VIEWER_OVERLAY_SURFACE.strong.surface,
    border: VIEWER_OVERLAY_SURFACE.strong.border,
    borderRadius: 'var(--radius-md)',
    boxShadow: VIEWER_OVERLAY_SURFACE.strong.shadow,
    backdropFilter: VIEWER_OVERLAY_SURFACE.strong.blur,
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
