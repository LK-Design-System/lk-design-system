"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/navigation/Breadcrumb.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Breadcrumb({ items = [], style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "nav", { "aria-label": "breadcrumb", style: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", ...style }, ...rest, children: items.map((it, i) => {
    const last = i === items.length - 1;
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
      last || !it.href ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-current": last ? "page" : void 0, style: { color: last ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)", fontWeight: last ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0 }, children: it.label }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href: it.href, style: { color: "var(--color-semantic-label-neutral)", fontWeight: "var(--fw-medium)", letterSpacing: 0, textDecoration: "none" }, children: it.label }),
      !last && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-right-small", size: 14, color: "var(--color-semantic-label-assistive)", "aria-hidden": "true" })
    ] }, i);
  }) });
}



exports.Breadcrumb = Breadcrumb;
//# sourceMappingURL=chunk-WWBGKXW5.cjs.map