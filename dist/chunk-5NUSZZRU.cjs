"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";





var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');


var _chunkVHQHPPYQcjs = require('./chunk-VHQHPPYQ.cjs');

// components/navigation/Tabs.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SIZE = {
  small: { height: 40, fontSize: "var(--body2-size)", countSize: 13 },
  sm: { height: 40, fontSize: "var(--body2-size)", countSize: 13 },
  medium: { height: 48, fontSize: "var(--headline2-size)", countSize: 15 },
  md: { height: 48, fontSize: "var(--headline2-size)", countSize: 15 },
  large: { height: 56, fontSize: "var(--headline2-size)", countSize: 15 },
  lg: { height: 56, fontSize: "var(--headline2-size)", countSize: 15 }
};
var Tabs = _react2.default.forwardRef(function Tabs2({
  items = [],
  value,
  defaultValue,
  onChange,
  full = false,
  resize,
  size = "medium",
  padding = false,
  trailingIconButton = false,
  scroll = "auto",
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const listRef = _react2.default.useRef(null);
  const mergedListRef = _chunkGWMGPLNWcjs.useMergedRefs.call(void 0, listRef, forwardedRef);
  const idBase = _react2.default.useId();
  const norm = items.map(
    (o) => typeof o === "string" ? { value: o, label: o } : o
  );
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(() => {
    if (defaultValue != null) return defaultValue;
    const initialItem = norm.find((item) => item.active && !item.disabled);
    return _optionalChain([(_nullishCoalesce(initialItem, () => ( norm.find((item) => !item.disabled)))), 'optionalAccess', _ => _.value]);
  });
  const selected = isControlled ? value : internal;
  const s = SIZE[size] || SIZE.medium;
  const normalizedSize = size === "small" || size === "sm" ? "sm" : size === "large" || size === "lg" ? "lg" : "md";
  const fill = resize === "fill" || full;
  const scrollable = scroll === "auto" || scroll === true;
  const inlinePadding = padding === true ? 8 : padding === false || padding == null ? 0 : padding;
  const resolvedInlinePadding = typeof inlinePadding === "number" ? `${inlinePadding}px` : inlinePadding;
  const selectedItem = norm.find((item) => item.value === selected);
  const tabStopValue = selectedItem && !selectedItem.disabled ? selectedItem.value : _optionalChain([norm, 'access', _2 => _2.find, 'call', _3 => _3((item) => !item.disabled), 'optionalAccess', _4 => _4.value]);
  const pick = (item) => {
    if (item.disabled) return;
    if (!isControlled) setInternal(item.value);
    _optionalChain([onChange, 'optionalCall', _5 => _5(item.value, item)]);
  };
  const move = (event, item) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const enabledItems = norm.filter((candidate) => !candidate.disabled);
    const currentIndex = enabledItems.findIndex((candidate) => candidate.value === item.value);
    if (currentIndex < 0 || enabledItems.length === 0) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % enabledItems.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = enabledItems.length - 1;
    const nextItem = enabledItems[nextIndex];
    pick(nextItem);
    _optionalChain([Array, 'access', _6 => _6.from, 'call', _7 => _7(_nullishCoalesce(_optionalChain([listRef, 'access', _8 => _8.current, 'optionalAccess', _9 => _9.querySelectorAll, 'call', _10 => _10('[role="tab"]')]), () => ( []))), 'access', _11 => _11.find, 'call', _12 => _12((tab) => tab.dataset.tabValue === String(nextItem.value)), 'optionalAccess', _13 => _13.focus, 'call', _14 => _14()]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ...rest,
      ref: mergedListRef,
      "data-slot": "root",
      "data-size": normalizedSize,
      "data-fill": fill ? "true" : void 0,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", "lk-scroll-surface", className) || void 0,
      "data-scrollbar": "compact",
      "data-scroll-gutter": "auto",
      role: "tablist",
      "aria-orientation": "horizontal",
      style: {
        ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-tabs-"),
        display: "flex",
        alignItems: "stretch",
        gap: fill ? 0 : "var(--lds-tabs-gap, 24px)",
        maxWidth: "100%",
        overflowX: scrollable ? "auto" : "visible",
        // The indicator is now fully inside the tab box. Suppress the CSS
        // cross-axis auto overflow that an x-scroll container would otherwise
        // derive, without clipping any part of the 2px indicator.
        overflowY: scrollable ? "hidden" : "visible",
        paddingInline: `var(--lds-tabs-padding-inline, ${resolvedInlinePadding || "0px"})`,
        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
        ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"),
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `
        .lk-tabs__tab:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px var(--color-semantic-focus-indicator);
          border-radius: var(--radius-sm);
          z-index: 1;
        }
      ` }),
        norm.map((item) => {
          const active = item.value === selected;
          const trailing = _nullishCoalesce(_nullishCoalesce(item.trailingIconButton, () => ( item.trailing)), () => ( trailingIconButton));
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            "button",
            {
              "data-slot": "tab",
              "data-state": active ? "active" : "inactive",
              "data-disabled": item.disabled ? "true" : void 0,
              className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "tab", "lk-tabs__tab", item.className) || void 0,
              type: "button",
              role: "tab",
              id: _nullishCoalesce(item.tabId, () => ( `${idBase}-tab-${item.value}`)),
              "aria-selected": active,
              "aria-controls": _nullishCoalesce(item.panelId, () => ( void 0)),
              tabIndex: item.value === tabStopValue ? 0 : -1,
              "data-tab-value": item.value,
              disabled: item.disabled,
              onClick: () => pick(item),
              onKeyDown: (event) => move(event, item),
              style: {
                flex: fill ? 1 : "0 0 auto",
                minWidth: 0,
                position: "relative",
                height: `var(--lds-tabs-height, ${s.height}px)`,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: item.disabled ? "not-allowed" : "pointer",
                opacity: item.disabled ? 0.45 : 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-2)",
                fontFamily: "var(--font-sans)",
                fontSize: s.fontSize,
                fontWeight: "var(--fw-semibold)",
                letterSpacing: 0,
                color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
                whiteSpace: "nowrap",
                transition: "color var(--dur-fast) var(--ease-out)",
                outline: "none",
                ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "tab"),
                ...item.style
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "label", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "label") || void 0, style: { overflow: "hidden", textOverflow: "ellipsis", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "label") }, children: item.label }),
                item.count != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "span",
                  {
                    "data-slot": "count",
                    className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "count") || void 0,
                    style: {
                      fontSize: s.countSize,
                      fontWeight: "var(--fw-semibold)",
                      color: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-neutral)",
                      ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "count")
                    },
                    children: item.count
                  }
                ),
                trailing && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "span",
                  {
                    "data-slot": "trailing",
                    className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "trailing") || void 0,
                    "aria-hidden": "true",
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
                      ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "trailing")
                    },
                    children: trailing === true ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVHQHPPYQcjs.Icon, { name: "chevron-right-small", size: 15, "aria-hidden": "true" }) : trailing
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "span",
                  {
                    "data-slot": "indicator",
                    className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "indicator", "lk-tabs__indicator"),
                    "aria-hidden": "true",
                    style: {
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "var(--lds-tabs-indicator-height, 2px)",
                      borderRadius: 0,
                      background: active ? "var(--color-semantic-label-normal)" : "transparent",
                      transition: "background var(--dur-fast) var(--ease-out)",
                      ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "indicator")
                    }
                  }
                )
              ]
            },
            item.value
          );
        })
      ]
    }
  );
});



exports.Tabs = Tabs;
//# sourceMappingURL=chunk-5NUSZZRU.cjs.map