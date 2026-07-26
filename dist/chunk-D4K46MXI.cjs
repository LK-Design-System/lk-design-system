"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";



var _chunkM7I6XONVcjs = require('./chunk-M7I6XONV.cjs');

// components/data/Table.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function TableRow({ columns, row, pad, hover, rowHeaderKey }) {
  const [h, setH] = _react2.default.useState(false);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "tr",
    {
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: { background: hover && h ? "var(--color-semantic-fill-alternative)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)" },
      children: columns.map((c) => {
        const content = typeof c.render === "function" ? c.render(row) : row[c.key];
        const cellStyle = { ..._chunkM7I6XONVcjs.tdStyle.call(void 0, pad), textAlign: c.align || "left" };
        if (rowHeaderKey != null && c.key === rowHeaderKey) {
          return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "th", { scope: "row", style: { ...cellStyle, fontWeight: "inherit" }, children: content }, c.key);
        }
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "td", { style: cellStyle, children: content }, c.key);
      })
    }
  );
}
function Table({
  columns = [],
  rows = [],
  size = "md",
  hover = true,
  caption,
  tableLabel,
  tableLabelledBy,
  rowHeaderKey,
  getRowId,
  className,
  style,
  ...rest
}) {
  const pad = size === "sm" ? "10px 12px" : "14px 16px";
  const nameFromAria = caption == null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      ...rest,
      className: ["lk-scroll-surface", className].filter(Boolean).join(" "),
      "data-scrollbar": "auto",
      "data-scroll-gutter": "stable",
      style: { overflowX: "auto", scrollbarGutter: "stable", ...style },
      children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "table",
        {
          "aria-label": nameFromAria ? tableLabel : void 0,
          "aria-labelledby": nameFromAria ? tableLabelledBy : void 0,
          style: { width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" },
          children: [
            caption != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "caption",
              {
                style: {
                  captionSide: "top",
                  paddingBottom: "var(--space-2)",
                  color: "var(--color-semantic-label-strong)",
                  fontSize: "var(--label1-size)",
                  lineHeight: "var(--label1-line)",
                  fontWeight: "var(--fw-semibold)",
                  textAlign: "left"
                },
                children: caption
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "thead", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "tr", { children: columns.map((c) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "th", { scope: "col", style: { ..._chunkM7I6XONVcjs.thStyle.call(void 0, pad), textAlign: c.align || "left", width: c.width }, children: c.label }, c.key)) }) }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "tbody", { children: rows.map((r, ri) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              TableRow,
              {
                columns,
                row: r,
                pad,
                hover,
                rowHeaderKey
              },
              getRowId ? getRowId(r, ri) : _nullishCoalesce(_optionalChain([r, 'optionalAccess', _ => _.id]), () => ( ri))
            )) })
          ]
        }
      )
    }
  );
}



exports.Table = Table;
//# sourceMappingURL=chunk-D4K46MXI.cjs.map