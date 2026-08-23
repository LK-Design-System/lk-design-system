"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/cards/ChecklistItem.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function ChecklistItem({
  children,
  cross = false,
  muted = false,
  dark = false,
  as = "li",
  stateLabel,
  style,
  ...rest
}) {
  const ok = !cross;
  const Row = as;
  const color = ok ? dark ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-normal)" : "var(--color-semantic-status-negative)";
  const resolvedStateLabel = stateLabel === void 0 ? ok ? "\uD3EC\uD568" : "\uC81C\uC678" : stateLabel;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, Row, { style: { display: "flex", alignItems: "flex-start", gap: "11px", listStyle: "none", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", flexShrink: 0, marginTop: "var(--space-0-5)", color }, children: [
      ok ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "check", size: 18, "aria-hidden": "true" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: "close", size: 16, "aria-hidden": "true" }),
      resolvedStateLabel != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { children: resolvedStateLabel })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: {
      fontSize: "var(--body1-size)",
      fontWeight: "var(--fw-semibold)",
      lineHeight: 1.5,
      letterSpacing: 0,
      color: dark ? "var(--color-semantic-static-white)" : muted ? "var(--color-semantic-label-alternative)" : "var(--color-semantic-label-neutral)",
      opacity: dark && muted ? 0.7 : 1,
      textDecoration: cross ? "line-through" : "none",
      wordBreak: "keep-all"
    }, children })
  ] });
}



exports.ChecklistItem = ChecklistItem;
//# sourceMappingURL=chunk-QJP3BFL4.cjs.map