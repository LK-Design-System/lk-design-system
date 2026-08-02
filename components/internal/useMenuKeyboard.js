import React from 'react';
import { useOverlayLayer } from '../overlay/overlay-platform.js';

const MENU_ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]',
].join(',');

// APG typeahead: characters typed in quick succession build one search string;
// the buffer is dropped after a short idle so the next burst starts a new query.
const TYPEAHEAD_TIMEOUT = 500;

// A back / drill-up control is a real menuitem (it must be reachable with the
// arrow keys), but it is never the item a level should open on.
const MENU_BACK_ATTRIBUTE = 'data-menu-back';

const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function itemText(item) {
  return (item?.textContent || '').trim().toLocaleLowerCase();
}

function availableItems(menu) {
  return Array.from(menu?.querySelectorAll(MENU_ITEM_SELECTOR) ?? []).filter((item) => {
    if (item.closest('[role="menu"]') !== menu) return false;
    return !item.disabled && item.getAttribute('aria-disabled') !== 'true';
  });
}

/** Private roving-focus engine shared by LDS menu surfaces. */
export function useMenuKeyboard({ open, onClose, getTrigger, menuKey = 0, zIndex }) {
  const { zIndex: resolvedZIndex, isTopmost } = useOverlayLayer({ open, zIndex });
  const menuRef = React.useRef(null);
  const pendingFocusRef = React.useRef('first');
  const entryFrameRef = React.useRef(null);
  const typeaheadRef = React.useRef({ query: '', timer: null });
  const optionsRef = React.useRef(null);
  optionsRef.current = { onClose, getTrigger };

  const resetTypeahead = React.useCallback(() => {
    const typeahead = typeaheadRef.current;
    if (typeahead.timer != null) clearTimeout(typeahead.timer);
    typeahead.timer = null;
    typeahead.query = '';
  }, []);

  // Closing (or swapping levels) must not leave a stale search string behind.
  React.useEffect(() => {
    if (!open) resetTypeahead();
  }, [open, menuKey, resetTypeahead]);
  React.useEffect(() => resetTypeahead, [resetTypeahead]);

  const pushTypeaheadKey = React.useCallback((key) => {
    const typeahead = typeaheadRef.current;
    if (typeahead.timer != null) clearTimeout(typeahead.timer);
    typeahead.query += key.toLocaleLowerCase();
    typeahead.timer = setTimeout(() => {
      typeahead.query = '';
      typeahead.timer = null;
    }, TYPEAHEAD_TIMEOUT);
    return typeahead.query;
  }, []);

  const requestItemFocus = React.useCallback((position = 'first') => {
    pendingFocusRef.current = position;
  }, []);

  // The entry focus is queued a frame after the menu (or a drill level) renders.
  // Keyboard navigation that lands first must win, otherwise the queued frame
  // silently drags focus back to the edge item under the user's next keystroke.
  const cancelEntryFocus = React.useCallback(() => {
    const frame = entryFrameRef.current;
    if (frame == null) return;
    const view = menuRef.current?.ownerDocument?.defaultView ?? window;
    view.cancelAnimationFrame(frame);
    entryFrameRef.current = null;
  }, []);

  useSafeLayoutEffect(() => {
    if (!open) return undefined;
    const menu = menuRef.current;
    const view = menu?.ownerDocument?.defaultView ?? window;
    const frame = view.requestAnimationFrame(() => {
      entryFrameRef.current = null;
      const items = availableItems(menuRef.current);
      items.forEach((item) => { item.tabIndex = -1; });
      const target = pendingFocusRef.current === 'last'
        ? items.at(-1)
        // Entry focus lands on the first *command*: a drill-up control is part
        // of the roving collection but must not swallow the level's entry.
        : items.find((item) => !item.hasAttribute(MENU_BACK_ATTRIBUTE)) ?? items[0];
      target?.focus({ preventScroll: true });
      pendingFocusRef.current = 'first';
    });
    entryFrameRef.current = frame;
    return () => {
      view.cancelAnimationFrame(frame);
      if (entryFrameRef.current === frame) entryFrameRef.current = null;
    };
  }, [open, menuKey]);

  const closeMenu = React.useCallback(({ restoreFocus = false } = {}) => {
    const trigger = optionsRef.current.getTrigger?.();
    const view = trigger?.ownerDocument?.defaultView ?? window;
    optionsRef.current.onClose?.();
    if (restoreFocus && trigger?.focus) {
      view.requestAnimationFrame(() => {
        if (trigger.isConnected) trigger.focus({ preventScroll: true });
      });
    }
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const trigger = optionsRef.current.getTrigger?.();
    const ownerDocument = trigger?.ownerDocument ?? menuRef.current?.ownerDocument ?? document;
    const handleDocumentKeyDown = (event) => {
      if (
        !isTopmost()
        || event.defaultPrevented
        || event.key !== 'Escape'
      ) return;
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    };

    ownerDocument.addEventListener('keydown', handleDocumentKeyDown);
    return () => {
      ownerDocument.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [closeMenu, isTopmost, open]);

  const handleMenuKeyDown = React.useCallback((event) => {
    if (event.defaultPrevented) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    if (event.key === 'Tab') {
      closeMenu();
      return;
    }

    const items = availableItems(menuRef.current);
    if (items.length === 0) return;
    const current = event.target.closest?.(MENU_ITEM_SELECTOR);
    const currentIndex = Math.max(0, items.indexOf(current));
    let nextIndex;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = items.length - 1;

    const printable = event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
    // Space only joins an in-flight search string; on its own it still activates
    // the focused item.
    const typeaheadKey = printable && (event.key !== ' ' || typeaheadRef.current.query !== '');
    if (nextIndex === undefined && typeaheadKey) {
      const query = pushTypeaheadKey(event.key);
      // A single character advances past the current item so repeats cycle
      // through same-initial items; a longer buffer keeps refining the match
      // starting at the current item (APG typeahead).
      const startOffset = query.length === 1 ? 1 : 0;
      for (let offset = startOffset; offset < items.length + startOffset; offset += 1) {
        const candidateIndex = (currentIndex + offset) % items.length;
        if (itemText(items[candidateIndex]).startsWith(query)) {
          nextIndex = candidateIndex;
          break;
        }
      }
    } else if (nextIndex !== undefined) {
      resetTypeahead();
    }

    if (nextIndex === undefined) return;
    event.preventDefault();
    cancelEntryFocus();
    items[nextIndex].focus({ preventScroll: true });
  }, [cancelEntryFocus, closeMenu]);

  return { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown, zIndex: resolvedZIndex, isTopmost };
}
