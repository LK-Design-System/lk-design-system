import React from 'react';
import { useRovingToolbar } from '../internal/useRovingToolbar.js';

const DEFAULT_ITEM_SELECTOR = [
  'button',
  'a[href]',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="radio"]',
].join(',');

/**
 * LK ROBOTICS — Toolbar
 * A horizontal container for grouped controls (icon buttons, toggles) with a
 * hairline and soft elevation. Separate groups with a `Divider vertical`.
 */
export function Toolbar({
  children,
  orientation = 'horizontal',
  label = '도구 모음',
  role = 'toolbar',
  itemSelector = DEFAULT_ITEM_SELECTOR,
  preferredItemKey,
  includeAriaDisabledItems = false,
  stopNavigationPropagation = false,
  style,
  onKeyDown,
  onFocusCapture,
  'aria-label': ariaLabel,
  ...rest
}) {
  const { toolbarRef, handleFocusCapture, handleKeyDown } = useRovingToolbar({
    itemSelector,
    orientation,
    preferredKey: preferredItemKey,
    includeAriaDisabled: includeAriaDisabledItems,
    stopPropagation: stopNavigationPropagation,
    onKeyDown,
    onFocusCapture,
  });

  return (
    <div
      {...rest}
      ref={toolbarRef}
      role={role}
      aria-label={ariaLabel ?? label}
      aria-orientation={role === 'toolbar' ? orientation : undefined}
      onKeyDown={handleKeyDown}
      onFocusCapture={handleFocusCapture}
      style={{
        display: 'inline-flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        gap: 'var(--component-toolbar-gap, var(--space-1-5))',
        padding: 'var(--component-toolbar-padding, var(--space-1-5))',
        background: 'var(--color-semantic-background-elevated-normal)',
        border: '1px solid var(--color-semantic-line-solid-normal)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xs)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
