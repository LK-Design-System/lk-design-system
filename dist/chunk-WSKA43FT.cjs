"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/cards/ChecklistItem.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function ChecklistItem({
  children,
  cross = false,
  muted = false,
  dark = false,
  style,
  ...rest
}) {
  const ok = !cross;
  const color = ok ? dark ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-normal)" : "var(--color-semantic-status-negative)";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "flex-start", gap: "11px", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", flexShrink: 0, marginTop: 2, color }, children: ok ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "check", size: 18, "aria-hidden": "true" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "close", size: 16, "aria-hidden": "true" }) }),
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
//# sourceMappingURL=chunk-WSKA43FT.cjs.map