import React from 'react';
import { useOverlayLayer } from './overlay-platform.js';

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'summary:not([tabindex="-1"])',
  'iframe:not([tabindex="-1"])',
  'audio[controls]:not([tabindex="-1"])',
  'video[controls]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const overlayStack = [];
const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

// Body scroll lock is shared by every modal surface built on this engine, so
// nesting has to be counted: only the first lock captures the previous inline
// styles and only the last unlock restores them. Removing the page scrollbar
// would otherwise reflow the layout by its width, so the same width is added
// back as body padding while the lock is held.
let scrollLockDepth = 0;
let releaseScrollLock = null;

function lockBodyScroll(ownerDocument) {
  scrollLockDepth += 1;
  if (scrollLockDepth > 1) return;
  const view = ownerDocument.defaultView ?? window;
  const body = ownerDocument.body;
  if (!body || !view) return;
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;
  const scrollbarWidth = view.innerWidth - ownerDocument.documentElement.clientWidth;
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    const currentPadding = Number.parseFloat(view.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
  releaseScrollLock = () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  };
}

function unlockBodyScroll() {
  if (scrollLockDepth === 0) return;
  scrollLockDepth -= 1;
  if (scrollLockDepth > 0) return;
  releaseScrollLock?.();
  releaseScrollLock = null;
}

function isAvailable(element) {
  if (!element?.isConnected || typeof element.focus !== 'function') return false;
  if (element.matches?.(':disabled')) return false;
  if (element.closest?.('[hidden], [inert], [aria-hidden="true"]')) return false;
  const view = element.ownerDocument?.defaultView;
  const style = view?.getComputedStyle?.(element);
  return style?.display !== 'none' && style?.visibility !== 'hidden';
}

function getFocusableElements(dialog) {
  return Array.from(dialog?.querySelectorAll(FOCUSABLE_SELECTOR) ?? [])
    .filter((element) => element.tabIndex >= 0 && isAvailable(element));
}

function focusDialogStart(dialog, initialFocusRef) {
  if (!dialog) return;
  const requested = initialFocusRef?.current;
  const target = requested && dialog.contains(requested) && isAvailable(requested)
    ? requested
    : getFocusableElements(dialog)[0] ?? dialog;
  target.focus({ preventScroll: true });
}

function isTopOverlay(entry) {
  return overlayStack.at(-1) === entry;
}

function inertBackground(portalNode) {
  const container = portalNode?.parentElement;
  if (!container) return () => {};
  const siblings = Array.from(container.children).filter((element) => element !== portalNode);
  const snapshots = siblings.map((element) => ({
    element,
    inert: element.hasAttribute('inert'),
  }));
  siblings.forEach((element) => element.setAttribute('inert', ''));
  return () => snapshots.forEach(({ element, inert }) => {
    if (!element.isConnected) return;
    if (inert) element.setAttribute('inert', '');
    else element.removeAttribute('inert');
  });
}

/**
 * Shared modal-dialog focus controller.
 *
 * Only the latest open overlay owns focus containment and Escape. When that
 * overlay closes, focus returns to its invoker (or `returnFocusRef`) while any
 * lower overlay remains registered and becomes active again.
 *
 * The engine also owns the body scroll lock, so every dialog surface built on
 * it (Modal, Alert, ConfirmDialog, …) blocks background page scrolling for as
 * long as at least one of them is open. Pass `lockScroll: false` for surfaces
 * that intentionally leave the page scrollable.
 */
export function useDialogFocus({
  open,
  onDismiss,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  lockScroll = true,
  inert = true,
  portalRef,
  zIndex,
}) {
  const dialogRef = React.useRef(null);
  const { zIndex: resolvedZIndex, isTopmost } = useOverlayLayer({ open, zIndex });
  const optionsRef = React.useRef(null);
  optionsRef.current = {
    onDismiss,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    lockScroll,
    inert,
    portalRef,
  };

  useSafeLayoutEffect(() => {
    if (!open) return undefined;

    const dialog = dialogRef.current;
    const ownerDocument = dialog?.ownerDocument ?? document;
    const view = ownerDocument.defaultView ?? window;
    const previouslyFocused = ownerDocument.activeElement;
    const entry = { dialogRef };
    overlayStack.push(entry);
    const scrollLocked = optionsRef.current.lockScroll;
    if (scrollLocked) lockBodyScroll(ownerDocument);
    const restoreBackground = optionsRef.current.inert
      ? inertBackground(optionsRef.current.portalRef?.current)
      : () => {};

    const focusFrame = view.requestAnimationFrame(() => {
      if (isTopmost()) {
        focusDialogStart(dialogRef.current, optionsRef.current.initialFocusRef);
      }
    });

    const onKeyDown = (event) => {
      if (!isTopmost() || event.defaultPrevented) return;

      if (event.key === 'Escape') {
        if (optionsRef.current.onDismiss) {
          event.preventDefault();
          optionsRef.current.onDismiss();
        }
        return;
      }

      if (event.key !== 'Tab') return;
      const currentDialog = dialogRef.current;
      const focusables = getFocusableElements(currentDialog);
      if (focusables.length === 0) {
        event.preventDefault();
        currentDialog?.focus({ preventScroll: true });
        return;
      }

      const first = focusables[0];
      const last = focusables.at(-1);
      const activeElement = ownerDocument.activeElement;
      const activeIndex = focusables.indexOf(activeElement);

      if (event.shiftKey && (activeElement === first || activeIndex === -1)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (activeElement === last || activeIndex === -1)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    const onFocusIn = (event) => {
      const currentDialog = dialogRef.current;
      if (isTopmost() && currentDialog && !currentDialog.contains(event.target)) {
        focusDialogStart(currentDialog, optionsRef.current.initialFocusRef);
      }
    };

    ownerDocument.addEventListener('keydown', onKeyDown);
    ownerDocument.addEventListener('focusin', onFocusIn);

    return () => {
      view.cancelAnimationFrame(focusFrame);
      ownerDocument.removeEventListener('keydown', onKeyDown);
      ownerDocument.removeEventListener('focusin', onFocusIn);
      if (scrollLocked) unlockBodyScroll();
      restoreBackground();

      const wasTopOverlay = isTopOverlay(entry);
      const entryIndex = overlayStack.indexOf(entry);
      if (entryIndex >= 0) overlayStack.splice(entryIndex, 1);

      if (!wasTopOverlay) return;
      const nextOverlay = overlayStack.at(-1);
      const requestedReturn = optionsRef.current.returnFocusRef?.current;
      const returnTarget = isAvailable(requestedReturn) ? requestedReturn : previouslyFocused;

      if (nextOverlay && isAvailable(returnTarget) && nextOverlay.dialogRef.current?.contains(returnTarget)) {
        returnTarget.focus({ preventScroll: true });
      } else if (nextOverlay) {
        focusDialogStart(nextOverlay.dialogRef.current, null);
      } else if (optionsRef.current.restoreFocus && isAvailable(returnTarget)) {
        returnTarget.focus({ preventScroll: true });
      }
    };
  }, [open]);

  return { dialogRef, zIndex: resolvedZIndex };
}
