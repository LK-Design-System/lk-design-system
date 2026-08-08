"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkENN7YVH5cjs = require('./chunk-ENN7YVH5.cjs');


var _chunkOZR3K6TYcjs = require('./chunk-OZR3K6TY.cjs');

// components/buttons/SpeedDial.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function SpeedDial({ icon, actions = [], open, defaultOpen = false, onOpenChange, label = "\uC791\uC5C5", style, onKeyDown, ...rest }) {
  const controlled = open !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultOpen);
  const isOpen = controlled ? open : internal;
  const dialId = _react2.default.useId();
  const listId = `${dialId}-actions`;
  const rootRef = _react2.default.useRef(null);
  const triggerRef = _react2.default.useRef(null);
  const setOpen = (v) => {
    if (!controlled) setInternal(v);
    onOpenChange && onOpenChange(v);
  };
  const close = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (!restoreFocus) return;
    const run = () => triggerRef.current && triggerRef.current.focus();
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else setTimeout(run, 0);
  };
  _chunkENN7YVH5cjs.useLightDismiss.call(void 0, {
    open: isOpen,
    rootRef,
    getTrigger: () => triggerRef.current,
    onDismiss: () => setOpen(false)
  });
  const handleKeyDown = (event) => {
    _optionalChain([onKeyDown, 'optionalCall', _ => _(event)]);
    if (event.defaultPrevented || event.key !== "Escape" || !isOpen) return;
    event.stopPropagation();
    close({ restoreFocus: true });
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: rootRef,
      onKeyDown: handleKeyDown,
      style: { display: "inline-flex", flexDirection: "column-reverse", alignItems: "flex-end", gap: 12, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "button",
          {
            ref: triggerRef,
            type: "button",
            "aria-label": label,
            "aria-expanded": isOpen,
            "aria-controls": isOpen ? listId : void 0,
            onClick: () => isOpen ? close() : setOpen(true),
            style: {
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-lg)",
              background: "var(--color-semantic-primary-normal)",
              color: "var(--component-button-primary-fg)",
              transform: isOpen ? "rotate(45deg)" : "none",
              transition: "transform var(--dur-fast) var(--ease-out)"
            },
            children: icon || /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkOZR3K6TYcjs.Icon, { name: "plus", size: 24, "aria-hidden": "true" })
          }
        ),
        isOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { id: listId, style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-2-5)", justifyItems: "end" }, children: actions.map((a, i) => {
          const actionLabel = a.ariaLabel || (typeof a.label === "string" ? a.label : void 0);
          const actionId = `${dialId}-action-${i}`;
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2-5)" }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: actionId, style: { padding: "4px 9px", borderRadius: "var(--radius-sm)", background: "var(--color-semantic-inverse-background)", color: "var(--color-semantic-inverse-label)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-semibold)", boxShadow: "var(--shadow-sm)", whiteSpace: "nowrap" }, children: a.label }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "button",
              {
                type: "button",
                "aria-label": actionLabel,
                "aria-labelledby": actionLabel ? void 0 : actionId,
                onClick: () => {
                  a.onClick && a.onClick();
                  close({ restoreFocus: true });
                },
                style: {
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow-md)",
                  background: a.danger ? "var(--color-semantic-status-negative)" : "var(--color-semantic-background-elevated-normal)",
                  color: a.danger ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-normal)",
                  border: a.danger ? "none" : "1px solid var(--color-semantic-line-normal-normal)"
                },
                children: a.icon
              }
            )
          ] }, _nullishCoalesce(actionLabel, () => ( i)));
        }) })
      ]
    }
  );
}



exports.SpeedDial = SpeedDial;
//# sourceMappingURL=chunk-QU7DHK3H.cjs.map