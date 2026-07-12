"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/buttons/SpeedDial.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function SpeedDial({ icon, actions = [], open, defaultOpen = false, onOpenChange, label = "\uC791\uC5C5", style, ...rest }) {
  const controlled = open !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultOpen);
  const isOpen = controlled ? open : internal;
  const setOpen = (v) => {
    if (!controlled) setInternal(v);
    onOpenChange && onOpenChange(v);
  };
  const dialId = _react2.default.useId();
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { onKeyDown: (e) => {
    if (e.key === "Escape") setOpen(false);
  }, style: { display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: 12, fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    isOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10, justifyItems: "end" }, children: actions.map((a, i) => {
      const actionLabel = a.ariaLabel || (typeof a.label === "string" ? a.label : void 0);
      const actionId = `${dialId}-action-${i}`;
      return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { display: "inline-flex", alignItems: "center", gap: 10 }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: actionId, style: { padding: "4px 9px", borderRadius: "var(--radius-sm)", background: "var(--color-semantic-inverse-background)", color: "var(--color-semantic-inverse-label)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-semibold)", boxShadow: "var(--shadow-sm)", whiteSpace: "nowrap" }, children: a.label }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "button",
          {
            type: "button",
            "aria-label": actionLabel,
            "aria-labelledby": actionLabel ? void 0 : actionId,
            onClick: () => {
              a.onClick && a.onClick();
              setOpen(false);
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
    }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "button",
      {
        type: "button",
        "aria-label": label,
        "aria-expanded": isOpen,
        onClick: () => setOpen(!isOpen),
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
        children: icon || /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "plus", size: 24, "aria-hidden": "true" })
      }
    )
  ] });
}



exports.SpeedDial = SpeedDial;
//# sourceMappingURL=chunk-3TGED6W2.cjs.map