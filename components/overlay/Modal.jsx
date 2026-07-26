import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { useDialogFocus } from './dialog-focus.js';

/**
 * LDS Core — Modal
 * A general content dialog over a navy scrim — header (title + close), a
 * scrollable body, and an optional footer slot. Larger and more flexible than
 * Alert. Controlled via `open`; Esc / scrim-click call `onClose`.
 */
export function Modal({
  open = false,
  title,
  children,
  footer,
  onClose,
  width = 520,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = '모달',
  style,
  ...rest
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
  });
  if (!open) return null;
  return (
    <div
      role="presentation"
      onClick={closeOnScrim ? (e) => { if (e.target === e.currentTarget && onClose) onClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? ariaLabel : undefined}
        aria-describedby={children != null ? descriptionId : undefined}
        tabIndex={-1}
        style={{ width: '100%', maxWidth: width, maxHeight: '86vh', display: 'flex', flexDirection: 'column', background: 'var(--color-semantic-background-elevated-normal)', borderRadius: 'var(--component-dialog-radius)', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', overflow: 'hidden', ...style }}
        {...rest}
      >
        {(title != null || onClose) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
            <div id={titleId} style={{ fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{title}</div>
            {onClose && (
              <IconButton size="sm" variant="plain" label="닫기" onClick={onClose}>
                <Icon name="close" size={20} aria-hidden="true" />
              </IconButton>
            )}
          </div>
        )}
        <div id={descriptionId} className="lk-scroll-surface" data-scrollbar="auto" data-scroll-gutter="stable" style={{ padding: 'var(--space-5) var(--space-6)', overflow: 'auto', scrollbarGutter: 'stable', fontSize: 'var(--body2-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        {footer != null && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-semantic-line-solid-normal)' }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
