import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { useDialogFocus } from './dialog-focus.js';
import { useControllableOpen } from './anchored-overlay.js';
import { OverlayPortal } from './overlay-platform.js';
import { componentVars, partClassName, partStyle, useMergedRefs } from '../internal/surface.js';

/**
 * LDS Core — Modal
 * A general content dialog over a navy scrim — header (title + close), a
 * scrollable body, and an optional footer slot. Larger and more flexible than
 * Alert. Controlled via `open`; Esc / scrim-click call `onClose`.
 */
export const Modal = React.forwardRef(function Modal({
  open,
  defaultOpen = false,
  onOpenChange,
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
  withinPortal = true,
  portalTarget,
  zIndex,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const titleId = React.useId();
  const descriptionId = React.useId();
  const portalRef = React.useRef(null);
  const portalAnchorRef = React.useRef(null);
  if (visible && !portalAnchorRef.current && typeof document !== 'undefined') {
    portalAnchorRef.current = returnFocusRef?.current ?? document.activeElement;
  }
  if (!visible) portalAnchorRef.current = null;
  const requestClose = React.useCallback(() => {
    onClose?.();
    setVisible(false);
  }, [onClose, setVisible]);
  const { dialogRef, zIndex: resolvedZIndex } = useDialogFocus({
    open: visible,
    onDismiss: requestClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex,
  });
  const mergedDialogRef = useMergedRefs(dialogRef, forwardedRef);
  if (!visible) return null;
  return (
    <OverlayPortal open={visible} withinPortal={withinPortal} portalTarget={portalTarget} anchorRef={portalAnchorRef} portalRef={portalRef} layer="modal">
    <div
      data-slot="backdrop"
      className={partClassName(classNames, 'backdrop') || undefined}
      role="presentation"
      onClick={closeOnScrim ? (e) => { if (e.target === e.currentTarget) requestClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: resolvedZIndex, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))', ...partStyle(styles, 'backdrop') }}
    >
      <div
        ref={mergedDialogRef}
        data-slot="root"
        data-open="true"
        className={partClassName(classNames, 'root', className) || undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? ariaLabel : undefined}
        aria-describedby={children != null ? descriptionId : undefined}
        tabIndex={-1}
        style={{ ...componentVars(vars, '--lds-modal-'), width: '100%', maxWidth: `var(--lds-modal-width, ${typeof width === 'number' ? `${width}px` : width})`, maxHeight: 'var(--lds-modal-max-height, 86vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-semantic-background-elevated-normal)', borderRadius: 'var(--lds-modal-radius, var(--component-dialog-radius))', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', overflow: 'hidden', ...partStyle(styles, 'root'), ...style }}
        {...rest}
      >
        {(title != null || onClose || onOpenChange || open === undefined) && (
          <div data-slot="header" className={partClassName(classNames, 'header') || undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--color-semantic-line-solid-normal)', ...partStyle(styles, 'header') }}>
            <div data-slot="title" className={partClassName(classNames, 'title') || undefined} id={titleId} style={{ fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', ...partStyle(styles, 'title') }}>{title}</div>
            {(onClose || onOpenChange || open === undefined) && (
              <span data-slot="close" className={partClassName(classNames, 'close') || undefined} style={partStyle(styles, 'close')}>
              <IconButton size="sm" variant="plain" label="닫기" onClick={requestClose}>
                <Icon name="close" size={20} aria-hidden="true" />
              </IconButton>
              </span>
            )}
          </div>
        )}
        <div data-slot="body" id={descriptionId} className={partClassName(classNames, 'body', 'lk-scroll-surface') || undefined} data-scrollbar="auto" data-scroll-gutter="stable" style={{ padding: 'var(--space-5) var(--space-6)', overflow: 'auto', scrollbarGutter: 'stable', fontSize: 'var(--body2-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all', ...partStyle(styles, 'body') }}>{children}</div>
        {footer != null && (
          <div data-slot="footer" className={partClassName(classNames, 'footer') || undefined} style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-semantic-line-solid-normal)', ...partStyle(styles, 'footer') }}>{footer}</div>
        )}
      </div>
    </div>
    </OverlayPortal>
  );
});
