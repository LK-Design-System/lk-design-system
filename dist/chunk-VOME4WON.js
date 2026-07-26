"use client";

// components/internal/useMenuKeyboard.js
import React from "react";
var MENU_ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]'
].join(",");
var menuKeyboardStack = [];
var TYPEAHEAD_TIMEOUT = 500;
var MENU_BACK_ATTRIBUTE = "data-menu-back";
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
function itemText(item) {
  return (item?.textContent || "").trim().toLocaleLowerCase();
}
function availableItems(menu) {
  return Array.from(menu?.querySelectorAll(MENU_ITEM_SELECTOR) ?? []).filter((item) => {
    if (item.closest('[role="menu"]') !== menu) return false;
    return !item.disabled && item.getAttribute("aria-disabled") !== "true";
  });
}
function useMenuKeyboard({ open, onClose, getTrigger, menuKey = 0 }) {
  const menuRef = React.useRef(null);
  const pendingFocusRef = React.useRef("first");
  const entryFrameRef = React.useRef(null);
  const typeaheadRef = React.useRef({ query: "", timer: null });
  const optionsRef = React.useRef(null);
  optionsRef.current = { onClose, getTrigger };
  const resetTypeahead = React.useCallback(() => {
    const typeahead = typeaheadRef.current;
    if (typeahead.timer != null) clearTimeout(typeahead.timer);
    typeahead.timer = null;
    typeahead.query = "";
  }, []);
  React.useEffect(() => {
    if (!open) resetTypeahead();
  }, [open, menuKey, resetTypeahead]);
  React.useEffect(() => resetTypeahead, [resetTypeahead]);
  const pushTypeaheadKey = React.useCallback((key) => {
    const typeahead = typeaheadRef.current;
    if (typeahead.timer != null) clearTimeout(typeahead.timer);
    typeahead.query += key.toLocaleLowerCase();
    typeahead.timer = setTimeout(() => {
      typeahead.query = "";
      typeahead.timer = null;
    }, TYPEAHEAD_TIMEOUT);
    return typeahead.query;
  }, []);
  const requestItemFocus = React.useCallback((position = "first") => {
    pendingFocusRef.current = position;
  }, []);
  const cancelEntryFocus = React.useCallback(() => {
    const frame = entryFrameRef.current;
    if (frame == null) return;
    const view = menuRef.current?.ownerDocument?.defaultView ?? window;
    view.cancelAnimationFrame(frame);
    entryFrameRef.current = null;
  }, []);
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const menu = menuRef.current;
    const view = menu?.ownerDocument?.defaultView ?? window;
    const frame = view.requestAnimationFrame(() => {
      entryFrameRef.current = null;
      const items = availableItems(menuRef.current);
      items.forEach((item) => {
        item.tabIndex = -1;
      });
      const target = pendingFocusRef.current === "last" ? items.at(-1) : items.find((item) => !item.hasAttribute(MENU_BACK_ATTRIBUTE)) ?? items[0];
      target?.focus({ preventScroll: true });
      pendingFocusRef.current = "first";
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
    if (!open) return void 0;
    const trigger = optionsRef.current.getTrigger?.();
    const ownerDocument = trigger?.ownerDocument ?? menuRef.current?.ownerDocument ?? document;
    const entry = {};
    menuKeyboardStack.push(entry);
    const handleDocumentKeyDown = (event) => {
      if (menuKeyboardStack.at(-1) !== entry || event.defaultPrevented || event.key !== "Escape") return;
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    };
    ownerDocument.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      ownerDocument.removeEventListener("keydown", handleDocumentKeyDown);
      const index = menuKeyboardStack.indexOf(entry);
      if (index >= 0) menuKeyboardStack.splice(index, 1);
    };
  }, [closeMenu, open]);
  const handleMenuKeyDown = React.useCallback((event) => {
    if (event.defaultPrevented) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    if (event.key === "Tab") {
      closeMenu();
      return;
    }
    const items = availableItems(menuRef.current);
    if (items.length === 0) return;
    const current = event.target.closest?.(MENU_ITEM_SELECTOR);
    const currentIndex = Math.max(0, items.indexOf(current));
    let nextIndex;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    const printable = event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
    const typeaheadKey = printable && (event.key !== " " || typeaheadRef.current.query !== "");
    if (nextIndex === void 0 && typeaheadKey) {
      const query = pushTypeaheadKey(event.key);
      const startOffset = query.length === 1 ? 1 : 0;
      for (let offset = startOffset; offset < items.length + startOffset; offset += 1) {
        const candidateIndex = (currentIndex + offset) % items.length;
        if (itemText(items[candidateIndex]).startsWith(query)) {
          nextIndex = candidateIndex;
          break;
        }
      }
    } else if (nextIndex !== void 0) {
      resetTypeahead();
    }
    if (nextIndex === void 0) return;
    event.preventDefault();
    cancelEntryFocus();
    items[nextIndex].focus({ preventScroll: true });
  }, [cancelEntryFocus, closeMenu]);
  return { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown };
}

export {
  useMenuKeyboard
};
//# sourceMappingURL=chunk-VOME4WON.js.map