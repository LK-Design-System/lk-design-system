"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";



var _chunkM7I6XONVcjs = require('./chunk-M7I6XONV.cjs');

// components/data/Table.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function TableRow({ columns, row, pad, hover }) {
  const [h, setH] = _react2.default.useState(false);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "tr",
    {
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: { background: hover && h ? "var(--color-semantic-fill-alternative)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)" },
      children: columns.map((c) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "td", { style: { ..._chunkM7I6XONVcjs.tdStyle.call(void 0, pad), textAlign: c.align || "left" }, children: typeof c.render === "function" ? c.render(row) : row[c.key] }, c.key))
    }
  );
}
function Table({ columns = [], rows = [], size = "md", hover = true, style, ...rest }) {
  const pad = size === "sm" ? "10px 12px" : "14px 16px";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { overflowX: "auto", ...style }, ...rest, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "table", { style: { width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "thead", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "tr", { children: columns.map((c) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "th", { style: { ..._chunkM7I6XONVcjs.thStyle.call(void 0, pad), textAlign: c.align || "left", width: c.width }, children: c.label }, c.key)) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "tbody", { children: rows.map((r, ri) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TableRow, { columns, row: r, pad, hover }, ri)) })
  ] }) });
}



exports.Table = Table;
//# sourceMappingURL=chunk-EU76OH6S.cjs.map