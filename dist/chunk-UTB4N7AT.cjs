"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkU2H6LQXBcjs = require('./chunk-U2H6LQXB.cjs');


var _chunkEBCBZ7WPcjs = require('./chunk-EBCBZ7WP.cjs');


var _chunkSMSPAH2Mcjs = require('./chunk-SMSPAH2M.cjs');

// components/editor/EditorToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function EditorToolbar({
  items = [],
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
  label = "\uD3B8\uC9D1 \uB3C4\uAD6C",
  disabled = false,
  disabledReason,
  tooltipPosition,
  style,
  className,
  onKeyDown,
  onFocusCapture,
  ...rest
}) {
  const controlled = value !== void 0;
  const first = items[0] && (items[0].value != null ? items[0].value : items[0]);
  const [internal, setInternal] = _react2.default.useState(defaultValue != null ? defaultValue : first);
  const cur = controlled ? value : internal;
  const activeEnabledItem = items.find((item) => {
    const itemValue = item.value != null ? item.value : item;
    return itemValue === cur && !disabled && !item.disabled;
  });
  const firstEnabledItem = items.find((item) => !disabled && !item.disabled);
  const preferredFocusItem = _nullishCoalesce(_nullishCoalesce(activeEnabledItem, () => ( firstEnabledItem)), () => ( (!disabled ? items[0] : void 0)));
  const preferredFocusValue = preferredFocusItem != null ? preferredFocusItem.value != null ? preferredFocusItem.value : preferredFocusItem : void 0;
  const { toolbarRef, handleFocusCapture, handleKeyDown } = _chunkU2H6LQXBcjs.useRovingToolbar.call(void 0, {
    itemSelector: "[data-lk-editor-toolbar-item]",
    orientation,
    preferredKey: preferredFocusValue,
    includeAriaDisabled: true,
    onKeyDown,
    onFocusCapture
  });
  const pick = (v, itemDisabled) => {
    if (disabled || itemDisabled) return;
    if (!controlled) setInternal(v);
    onChange && onChange(v);
  };
  const resolvedTooltipPosition = _nullishCoalesce(tooltipPosition, () => ( (orientation === "vertical" ? "right" : "bottom")));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      ...rest,
      ref: toolbarRef,
      className: ["lk-editor-toolbar", className].filter(Boolean).join(" "),
      role: "toolbar",
      "aria-label": label,
      "aria-orientation": orientation,
      "aria-disabled": disabled || void 0,
      "aria-description": disabled && typeof disabledReason === "string" ? disabledReason : void 0,
      "data-orientation": orientation,
      onKeyDown: handleKeyDown,
      onFocusCapture: handleFocusCapture,
      style: { display: "inline-flex", width: "fit-content", maxWidth: "100%", boxSizing: "border-box", flexDirection: orientation === "vertical" ? "column" : "row", gap: "var(--space-1)", ...style },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `
        .lk-editor-toolbar__button {
          position: relative;
          z-index: 1;
        }
        /* ToggleIcon paints its own inline colours, so the pressed override
           needs !important; the surface and outline carry selection while the
           foreground stays readable in both theme scopes. */
        .lk-editor-toolbar__button[aria-pressed="true"]:not([aria-disabled="true"]) {
          background: var(--color-semantic-primary-surface-normal) !important;
          color: var(--color-semantic-label-normal) !important;
        }
      ` }),
        items.map((it) => {
          const v = it.value != null ? it.value : it;
          const on = v === cur;
          const itemDisabled = disabled || !!it.disabled;
          const itemLabel = it.label || String(v);
          const itemDisabledReason = _nullishCoalesce(it.disabledReason, () => ( disabledReason));
          return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            _chunkEBCBZ7WPcjs.Tooltip,
            {
              content: itemDisabled && itemDisabledReason != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: 2 }, children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: itemLabel }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-inverse-label-alternative-soft)", fontWeight: "var(--fw-medium)" }, children: itemDisabledReason })
              ] }) : itemLabel,
              shortcut: it.shortcut,
              position: resolvedTooltipPosition,
              size: "sm",
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunkSMSPAH2Mcjs.ToggleIcon,
                {
                  className: "lk-editor-toolbar__button",
                  label: itemLabel,
                  size: "sm",
                  variant: "plain",
                  pressed: on,
                  "aria-disabled": itemDisabled || void 0,
                  "aria-keyshortcuts": _nullishCoalesce(it.ariaKeyShortcuts, () => ( (typeof it.shortcut === "string" ? it.shortcut : void 0))),
                  "aria-description": itemDisabled && typeof itemDisabledReason === "string" ? itemDisabledReason : void 0,
                  "data-lk-editor-toolbar-item": "",
                  "data-lk-toolbar-key": String(v),
                  tabIndex: !disabled && v === preferredFocusValue ? 0 : -1,
                  disabled,
                  onChange: () => pick(v, itemDisabled),
                  style: {
                    flex: "0 0 auto",
                    padding: 0,
                    lineHeight: 0
                  },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 16, height: 16, display: "inline-grid", placeItems: "center", flex: "0 0 auto" }, children: it.icon || v })
                }
              )
            },
            v
          );
        })
      ]
    }
  );
}



exports.EditorToolbar = EditorToolbar;
//# sourceMappingURL=chunk-UTB4N7AT.cjs.map