"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/navigation/Toolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// components/internal/useRovingToolbar.js

function itemKey(item) {
  return _nullishCoalesce(_optionalChain([item, 'optionalAccess', _ => _.getAttribute, 'optionalCall', _2 => _2("data-lk-toolbar-key")]), () => ( null));
}
var PRESENTATIONAL_ROLES = /* @__PURE__ */ new Set(["none", "presentation"]);
function isOwnedToolbarItem(toolbar, item) {
  if (!toolbar || !item || !toolbar.contains(item)) return false;
  let ancestor = item.parentElement;
  while (ancestor && ancestor !== toolbar) {
    const role = _optionalChain([ancestor, 'access', _3 => _3.getAttribute, 'call', _4 => _4("role"), 'optionalAccess', _5 => _5.trim, 'call', _6 => _6(), 'access', _7 => _7.toLowerCase, 'call', _8 => _8()]);
    if (role && !PRESENTATIONAL_ROLES.has(role)) return false;
    ancestor = ancestor.parentElement;
  }
  return ancestor === toolbar;
}
function shouldRestoreLostFocus(toolbar, focusWithin, lostFocusedItem) {
  if (!toolbar || !lostFocusedItem) return false;
  const ownerDocument = toolbar.ownerDocument;
  const activeElement = ownerDocument.activeElement;
  return focusWithin || activeElement === ownerDocument.body || activeElement === ownerDocument.documentElement;
}
function useRovingToolbar({
  itemSelector,
  orientation = "vertical",
  preferredKey,
  includeAriaDisabled = false,
  stopPropagation = false,
  onKeyDown,
  onFocusCapture
}) {
  const toolbarRef = _react2.default.useRef(null);
  const lastFocusedItemRef = _react2.default.useRef(null);
  const lastFocusedKeyRef = _react2.default.useRef(null);
  const lastFocusedIndexRef = _react2.default.useRef(-1);
  const focusWithinRef = _react2.default.useRef(false);
  const containerFallbackFocusedRef = _react2.default.useRef(false);
  const toolbarItems = (includeUnavailable = false) => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return [];
    return Array.from(toolbar.querySelectorAll(itemSelector)).filter((item) => {
      if (!isOwnedToolbarItem(toolbar, item)) return false;
      if (includeUnavailable) return true;
      if (item.disabled) return false;
      return includeAriaDisabled || item.getAttribute("aria-disabled") !== "true";
    });
  };
  const syncTabStops = (requestedItem, restoreLostFocus = false) => {
    const toolbar = toolbarRef.current;
    const allItems = toolbarItems(true);
    const focusableItems = toolbarItems();
    const ownerDocument = _optionalChain([toolbar, 'optionalAccess', _9 => _9.ownerDocument]);
    const activeElement = _optionalChain([ownerDocument, 'optionalAccess', _10 => _10.activeElement]);
    if (focusableItems.length === 0) {
      allItems.forEach((item) => {
        item.tabIndex = -1;
      });
      lastFocusedItemRef.current = null;
      lastFocusedKeyRef.current = null;
      lastFocusedIndexRef.current = -1;
      if (restoreLostFocus && _optionalChain([toolbar, 'optionalAccess', _11 => _11.tabIndex]) >= 0 && activeElement !== toolbar) {
        toolbar.focus({ preventScroll: true });
        containerFallbackFocusedRef.current = toolbar.ownerDocument.activeElement === toolbar;
      } else {
        containerFallbackFocusedRef.current = activeElement === toolbar;
      }
      return;
    }
    const containerHasFocus = activeElement === toolbar;
    const documentHasFocusFallback = activeElement === _optionalChain([ownerDocument, 'optionalAccess', _12 => _12.body]) || activeElement === _optionalChain([ownerDocument, 'optionalAccess', _13 => _13.documentElement]);
    const restoreContainerFallback = containerFallbackFocusedRef.current && (containerHasFocus || documentHasFocusFallback);
    const activeItem = focusableItems.includes(activeElement) ? activeElement : null;
    const unavailableActiveIndex = activeItem ? -1 : allItems.indexOf(activeElement);
    const availabilityFallback = unavailableActiveIndex < 0 ? null : _nullishCoalesce(allItems.slice(unavailableActiveIndex + 1).find((item) => focusableItems.includes(item)), () => ( allItems.slice(0, unavailableActiveIndex).reverse().find((item) => focusableItems.includes(item))));
    const lostFocusIndex = Math.min(lastFocusedIndexRef.current, allItems.length - 1);
    const lostFocusFallback = !restoreLostFocus || unavailableActiveIndex >= 0 || lostFocusIndex < 0 ? null : _nullishCoalesce(allItems.slice(lostFocusIndex).find((item) => focusableItems.includes(item)), () => ( allItems.slice(0, lostFocusIndex).reverse().find((item) => focusableItems.includes(item))));
    const rememberedItem = focusableItems.includes(lastFocusedItemRef.current) ? lastFocusedItemRef.current : focusableItems.find((item) => itemKey(item) === lastFocusedKeyRef.current);
    const preferredItem = preferredKey == null ? null : focusableItems.find((item) => itemKey(item) === String(preferredKey));
    const existingTabStop = focusableItems.find((item) => item.tabIndex === 0);
    const nextTabStop = focusableItems.includes(requestedItem) ? requestedItem : _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(activeItem, () => ( availabilityFallback)), () => ( lostFocusFallback)), () => ( rememberedItem)), () => ( preferredItem)), () => ( existingTabStop)), () => ( focusableItems[0]));
    allItems.forEach((item) => {
      item.tabIndex = item === nextTabStop ? 0 : -1;
    });
    lastFocusedItemRef.current = nextTabStop;
    lastFocusedKeyRef.current = itemKey(nextTabStop);
    lastFocusedIndexRef.current = allItems.indexOf(nextTabStop);
    if ((restoreContainerFallback || unavailableActiveIndex >= 0 || restoreLostFocus) && activeElement !== nextTabStop) {
      nextTabStop.focus({ preventScroll: true });
    }
    containerFallbackFocusedRef.current = false;
  };
  _react2.default.useLayoutEffect(() => {
    const lostFocusedItem = !!lastFocusedItemRef.current && !toolbarItems().includes(lastFocusedItemRef.current);
    syncTabStops(void 0, shouldRestoreLostFocus(toolbarRef.current, focusWithinRef.current, lostFocusedItem));
    const toolbar = toolbarRef.current;
    const Observer = _optionalChain([toolbar, 'optionalAccess', _14 => _14.ownerDocument, 'optionalAccess', _15 => _15.defaultView, 'optionalAccess', _16 => _16.MutationObserver]);
    if (!toolbar || !Observer) return void 0;
    const ownerDocument = toolbar.ownerDocument;
    const handleDocumentFocusIn = (event) => {
      const focusWithin = toolbar.contains(event.target);
      focusWithinRef.current = focusWithin;
      containerFallbackFocusedRef.current = focusWithin && event.target === toolbar;
    };
    const handleDocumentPointerDown = (event) => {
      if (!toolbar.contains(event.target)) {
        focusWithinRef.current = false;
        containerFallbackFocusedRef.current = false;
      }
    };
    ownerDocument.addEventListener("focusin", handleDocumentFocusIn, true);
    ownerDocument.addEventListener("pointerdown", handleDocumentPointerDown, true);
    const observer = new Observer((mutations) => {
      const lastFocusedItem = lastFocusedItemRef.current;
      const lostFocusedItem2 = !!lastFocusedItem && mutations.some((mutation) => {
        if (mutation.type === "attributes") {
          return mutation.target === lastFocusedItem && !toolbarItems().includes(lastFocusedItem);
        }
        return Array.from(mutation.removedNodes).some((node) => node === lastFocusedItem || _optionalChain([node, 'access', _17 => _17.contains, 'optionalCall', _18 => _18(lastFocusedItem)]));
      });
      syncTabStops(void 0, shouldRestoreLostFocus(toolbar, focusWithinRef.current, lostFocusedItem2));
    });
    observer.observe(toolbar, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled", "data-lk-toolbar-key"]
    });
    return () => {
      observer.disconnect();
      ownerDocument.removeEventListener("focusin", handleDocumentFocusIn, true);
      ownerDocument.removeEventListener("pointerdown", handleDocumentPointerDown, true);
    };
  });
  const handleFocusCapture = (event) => {
    _optionalChain([onFocusCapture, 'optionalCall', _19 => _19(event)]);
    if (event.defaultPrevented) return;
    if (event.target === toolbarRef.current) {
      focusWithinRef.current = true;
      containerFallbackFocusedRef.current = true;
      return;
    }
    const item = _optionalChain([event, 'access', _20 => _20.target, 'access', _21 => _21.closest, 'optionalCall', _22 => _22(itemSelector)]);
    if (!isOwnedToolbarItem(toolbarRef.current, item)) return;
    if (!toolbarItems().includes(item)) return;
    lastFocusedItemRef.current = item;
    lastFocusedKeyRef.current = itemKey(item);
    focusWithinRef.current = true;
    containerFallbackFocusedRef.current = false;
    syncTabStops(item);
  };
  const handleKeyDown = (event) => {
    _optionalChain([onKeyDown, 'optionalCall', _23 => _23(event)]);
    if (event.defaultPrevented) return;
    const toolbar = toolbarRef.current;
    const items = toolbarItems();
    const item = _optionalChain([event, 'access', _24 => _24.target, 'access', _25 => _25.closest, 'optionalCall', _26 => _26(itemSelector)]);
    const currentIndex = items.indexOf(item);
    if (currentIndex < 0 || !isOwnedToolbarItem(toolbar, item)) return;
    const previousKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    let nextIndex;
    if (event.key === previousKey) nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === nextKey) nextIndex = (currentIndex + 1) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === void 0) return;
    event.preventDefault();
    if (stopPropagation) event.stopPropagation();
    const nextItem = items[nextIndex];
    lastFocusedItemRef.current = nextItem;
    lastFocusedKeyRef.current = itemKey(nextItem);
    syncTabStops(nextItem);
    nextItem.focus();
  };
  return {
    toolbarRef,
    handleFocusCapture,
    handleKeyDown
  };
}

// components/navigation/Toolbar.jsx
var _jsxruntime = require('react/jsx-runtime');
var DEFAULT_ITEM_SELECTOR = [
  "button",
  "a[href]",
  'input:not([type="hidden"])',
  "select",
  "textarea",
  '[role="button"]',
  '[role="checkbox"]',
  '[role="radio"]'
].join(",");
function Toolbar({
  children,
  orientation = "horizontal",
  label = "\uB3C4\uAD6C \uBAA8\uC74C",
  role = "toolbar",
  itemSelector = DEFAULT_ITEM_SELECTOR,
  preferredItemKey,
  includeAriaDisabledItems = false,
  stopNavigationPropagation = false,
  style,
  onKeyDown,
  onFocusCapture,
  "aria-label": ariaLabel,
  ...rest
}) {
  const { toolbarRef, handleFocusCapture, handleKeyDown } = useRovingToolbar({
    itemSelector,
    orientation,
    preferredKey: preferredItemKey,
    includeAriaDisabled: includeAriaDisabledItems,
    stopPropagation: stopNavigationPropagation,
    onKeyDown,
    onFocusCapture
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      ...rest,
      ref: toolbarRef,
      role,
      "aria-label": _nullishCoalesce(ariaLabel, () => ( label)),
      "aria-orientation": role === "toolbar" ? orientation : void 0,
      onKeyDown: handleKeyDown,
      onFocusCapture: handleFocusCapture,
      style: {
        display: "inline-flex",
        flexDirection: orientation === "vertical" ? "column" : "row",
        alignItems: "center",
        gap: "var(--space-1-5)",
        padding: "var(--space-1-5)",
        background: "var(--color-semantic-background-elevated-normal)",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-xs)",
        ...style
      },
      children
    }
  );
}



exports.Toolbar = Toolbar;
//# sourceMappingURL=chunk-BQS4EIGJ.cjs.map