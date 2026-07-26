"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/StatList.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function StatList({ items = [], size = "md", style, ...rest }) {
  const rows = Array.isArray(items) ? items.filter(Boolean) : [];
  if (rows.length === 0) return null;
  const fontSize = size === "sm" ? "var(--caption1-size)" : "var(--body2-size)";
  const pair = (item) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-label-alternative)" }, children: item.label }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", fontVariantNumeric: "tabular-nums" }, children: item.value })
  ] });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "ul",
    {
      role: "list",
      style: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--space-3)",
        listStyle: "none",
        margin: 0,
        padding: 0,
        fontSize,
        ...style
      },
      ...rest,
      children: rows.map((item, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0 }, children: item.href ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "a",
        {
          href: item.href,
          "aria-label": `${item.label} ${item.value}`,
          style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", color: "inherit", textDecoration: "none" },
          children: pair(item)
        }
      ) : pair(item) }, index))
    }
  );
}



exports.StatList = StatList;
//# sourceMappingURL=chunk-DVJEDGBH.cjs.map