import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { useDialogFocus } from './dialog-focus.js';
import { useControllableOpen } from './anchored-overlay.js';
import { OverlayPortal } from './overlay-platform.js';
import { componentVars, partClassName, partStyle, useMergedRefs } from '../internal/surface.js';
import { OVERLAY_MOTION_STYLES, useOverlayPresence } from './overlay-presence.js';

const INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : 'true';
const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function availableReturnTarget(element) {
  if (!element?.isConnected || typeof element.focus !== 'function' || element.matches?.(':disabled')) return false;
  if (element.closest?.('[hidden], [inert], [aria-hidden="true"]')) return false;
  const computed = element.ownerDocument?.defaultView?.getComputedStyle(element);
  return computed?.display !== 'none' && computed?.visibility !== 'hidden';
}

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
  const wasOpenRef = React.useRef(false);
  if (visible && (!wasOpenRef.current || !portalAnchorRef.current) && typeof document !== 'undefined') {
    portalAnchorRef.current = returnFocusRef?.current ?? document.activeElement;
  }
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
  useSafeLayoutEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = visible;
    if (visible || !wasOpen || !restoreFocus) return;
    // Match Drawer: a shell may remove its own inert attribute after the focus
    // engine's cleanup. Finish that handoff after the DOM mutation, without
    // waiting for the retained visual exit or overriding an explicit move.
    const ownerDocument = dialogRef.current?.ownerDocument;
    const active = ownerDocument?.activeElement;
    const moved = active && active !== ownerDocument.body && !dialogRef.current?.contains(active);
    const target = returnFocusRef?.current ?? portalAnchorRef.current;
    if (!moved && availableReturnTarget(target)) target.focus({ preventScroll: true });
  }, [visible, restoreFocus, returnFocusRef]);
  const { mounted, shown, onTransitionEnd } = useOverlayPresence(visible, dialogRef);
  React.useEffect(() => {
    if (!mounted) portalAnchorRef.current = null;
  }, [mounted]);
  if (!mounted) return null;
  return (
    <OverlayPortal open={mounted} withinPortal={withinPortal} portalTarget={portalTarget} anchorRef={portalAnchorRef} portalRef={portalRef} layer="modal">
    <style>{OVERLAY_MOTION_STYLES}</style>
    <div
      data-slot="backdrop"
      data-lds-overlay-motion=""
      className={partClassName(classNames, 'backdrop') || undefined}
      role="presentation"
      onClick={visible && closeOnScrim ? (e) => { if (e.target === e.currentTarget) requestClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: resolvedZIndex, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)', ...partStyle(styles, 'backdrop'), ...(visible ? {} : { pointerEvents: 'none' }) }}
    >
      <div
        ref={mergedDialogRef}
        data-slot="root"
        data-open={visible ? 'true' : undefined}
        data-lds-overlay-motion=""
        className={partClassName(classNames, 'root', className) || undefined}
        role="dialog"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? ariaLabel : undefined}
        aria-describedby={children != null ? descriptionId : undefined}
        tabIndex={-1}
        style={{ ...componentVars(vars, '--lds-modal-'), width: '100%', maxWidth: `var(--lds-modal-width, ${typeof width === 'number' ? `${width}px` : width})`, maxHeight: 'var(--lds-modal-max-height, 86vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-semantic-background-elevated-normal)', borderRadius: 'var(--lds-modal-radius, var(--component-dialog-radius))', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', overflow: 'hidden', transform: shown ? 'none' : 'translateY(var(--space-2))', transition: 'transform var(--dur-base) var(--ease-out)', ...partStyle(styles, 'root'), ...style }}
        {...rest}
        aria-modal={visible ? 'true' : undefined}
        aria-hidden={visible ? undefined : true}
        inert={visible ? undefined : INERT_VALUE}
        onTransitionEnd={(event) => { rest.onTransitionEnd?.(event); onTransitionEnd(event); }}
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
