import React from 'react';
import { useDialogFocus } from './dialog-focus.js';
import { OverlayPortal } from './overlay-platform.js';

const INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : 'true';
const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
const SHEET_MOTION_STYLES = `
@media(prefers-reduced-motion:reduce){
  [data-lds-sheet-motion]{transition-duration:0s!important;transition-delay:0s!important}
}`;

function sheetTransitionDuration(element) {
  const computed = element?.ownerDocument?.defaultView?.getComputedStyle(element);
  if (!computed) return 0;
  const milliseconds = (value) => Number.parseFloat(value) * (value.trim().endsWith('ms') ? 1 : 1000) || 0;
  const properties = computed.transitionProperty.split(',').map((value) => value.trim());
  const durations = computed.transitionDuration.split(',').map(milliseconds);
  const delays = computed.transitionDelay.split(',').map(milliseconds);
  return properties.reduce((longest, property, index) => (
    property === 'none' ? longest : Math.max(longest, durations[index % durations.length] + delays[index % delays.length])
  ), 0);
}

function availableReturnTarget(element) {
  if (!element?.isConnected || typeof element.focus !== 'function' || element.matches?.(':disabled')) return false;
  if (element.closest?.('[hidden], [inert], [aria-hidden="true"]')) return false;
  const computed = element.ownerDocument?.defaultView?.getComputedStyle(element);
  return computed?.display !== 'none' && computed?.visibility !== 'hidden';
}

/**
 * LDS Product Extension — Sheet
 * A bottom sheet that slides up over a navy scrim (mobile actions, pickers). A
 * grab handle, optional title, scrollable body, optional footer. Controlled via
 * `open`; Esc / scrim-click close.
 */
export function Sheet({
  open = false,
  title,
  children,
  footer,
  onClose,
  closeOnScrim = true,
  height,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = '하단 시트',
  withinPortal = true,
  portalTarget,
  zIndex,
  style,
  ...rest
}) {
  const [present, setPresent] = React.useState(open);
  const mounted = open || present;
  const [shown, setShown] = React.useState(false);
  const openRef = React.useRef(open);
  openRef.current = open;
  const titleId = React.useId();
  const portalRef = React.useRef(null);
  const portalAnchorRef = React.useRef(null);
  const wasOpenRef = React.useRef(false);
  if (open && (!wasOpenRef.current || !portalAnchorRef.current) && typeof document !== 'undefined') {
    portalAnchorRef.current = returnFocusRef?.current ?? document.activeElement;
  }
  const { dialogRef, zIndex: resolvedZIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex,
  });
  useSafeLayoutEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;
    if (open || !wasOpen || !restoreFocus) return;
    // Same post-mutation handoff as Drawer when a shell owns background inert.
    const ownerDocument = dialogRef.current?.ownerDocument;
    const active = ownerDocument?.activeElement;
    const moved = active && active !== ownerDocument.body && !dialogRef.current?.contains(active);
    const target = returnFocusRef?.current ?? portalAnchorRef.current;
    if (!moved && availableReturnTarget(target)) target.focus({ preventScroll: true });
  }, [open, restoreFocus, returnFocusRef]);
  useSafeLayoutEffect(() => {
    const surface = dialogRef.current;
    const view = surface?.ownerDocument?.defaultView;
    if (!view) return undefined;
    const preference = view.matchMedia?.('(prefers-reduced-motion: reduce)');
    let frame;
    let timer;
    const cancel = () => {
      if (frame != null) view.cancelAnimationFrame(frame);
      if (timer != null) view.clearTimeout(timer);
    };
    const settleReducedMotion = () => {
      if (!preference?.matches) return;
      cancel();
      setShown(openRef.current);
      if (!openRef.current) setPresent(false);
    };
    if (open) {
      setPresent(true);
      if (preference?.matches) setShown(true);
      else {
        surface.getBoundingClientRect();
        frame = view.requestAnimationFrame(() => setShown(true));
      }
    } else {
      setShown(false);
      const duration = preference?.matches ? 0 : sheetTransitionDuration(surface);
      if (duration <= 0) setPresent(false);
      else timer = view.setTimeout(() => {
        if (!openRef.current) setPresent(false);
      }, Math.ceil(duration) + 50);
    }
    preference?.addEventListener?.('change', settleReducedMotion);
    return () => {
      cancel();
      preference?.removeEventListener?.('change', settleReducedMotion);
    };
  }, [open, present]);
  React.useEffect(() => {
    if (!mounted) portalAnchorRef.current = null;
  }, [mounted]);
  if (!mounted) return null;
  return (
    <OverlayPortal open={mounted} withinPortal={withinPortal} portalTarget={portalTarget} anchorRef={portalAnchorRef} portalRef={portalRef} layer="modal">
    <style>{SHEET_MOTION_STYLES}</style>
    <div
      role="presentation"
      data-lds-sheet-motion=""
      onClick={open && closeOnScrim ? (e) => { if (e.target === e.currentTarget && onClose) onClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: resolvedZIndex, background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)', pointerEvents: open ? undefined : 'none' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? ariaLabel : undefined}
        tabIndex={-1}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '88vh', height, display: 'flex', flexDirection: 'column', background: 'var(--color-semantic-background-elevated-normal)', borderTopLeftRadius: 'var(--radius-3xl)', borderTopRightRadius: 'var(--radius-3xl)', boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', transform: shown ? 'none' : 'translateY(100%)', transition: 'transform var(--dur-slow) var(--ease-out)', ...style }}
        {...rest}
        data-lds-sheet-motion=""
        aria-modal={open ? 'true' : undefined}
        aria-hidden={open ? undefined : true}
        inert={open ? undefined : INERT_VALUE}
        onTransitionEnd={(event) => {
          rest.onTransitionEnd?.(event);
          if (!openRef.current && event.target === event.currentTarget && event.propertyName === 'transform') setPresent(false);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-2-5)' }}>
          <span style={{ width: 40, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-interaction-inactive)' }} />
        </div>
        {title != null && <div id={titleId} style={{ padding: '14px 22px 4px', fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{title}</div>}
        <div className="lk-scroll-surface" data-scrollbar="auto" data-scroll-gutter="stable" style={{ flex: 1, padding: '14px 22px', overflow: 'auto', scrollbarGutter: 'stable', fontSize: 'var(--body2-size)', lineHeight: 1.7, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>
        {footer != null && <div style={{ padding: '14px 22px 22px', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>{footer}</div>}
      </div>
    </div>
    </OverlayPortal>
  );
}
