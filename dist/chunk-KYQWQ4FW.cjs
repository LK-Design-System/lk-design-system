"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/navigation/Breadcrumb.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Breadcrumb({ items = [], style, ...rest }) {
  const [hoveredIndex, setHoveredIndex] = _react2.default.useState(null);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "nav", { "aria-label": "\uD604\uC7AC \uC704\uCE58", style: { fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", ...style }, ...rest, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ol", { style: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, listStyle: "none", margin: 0, padding: 0 }, children: items.map((it, i) => {
    const last = i === items.length - 1;
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
      last || !it.href ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-current": last ? "page" : void 0, style: { color: last ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)", fontWeight: last ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0 }, children: it.label }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "a",
        {
          href: it.href,
          onMouseEnter: () => setHoveredIndex(i),
          onMouseLeave: () => setHoveredIndex(null),
          style: {
            color: hoveredIndex === i ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
            fontWeight: "var(--fw-medium)",
            letterSpacing: 0,
            textDecoration: "none",
            transition: "color var(--dur-fast) var(--ease-out)"
          },
          children: it.label
        }
      ),
      !last && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "chevron-right-small", size: 14, color: "var(--color-semantic-label-assistive)", "aria-hidden": "true" })
    ] }, i);
  }) }) });
}



exports.Breadcrumb = Breadcrumb;
//# sourceMappingURL=chunk-KYQWQ4FW.cjs.map