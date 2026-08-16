"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";



var _chunkNU3MH6RFcjs = require('./chunk-NU3MH6RF.cjs');

// components/data/Table.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function getColumnSizingStyle({ width, truncate = false }) {
  return truncate ? { width: "100%", maxWidth: 0, overflow: "hidden", textOverflow: "ellipsis" } : { width };
}
function getTableHeaderCellStyle({ padding = "var(--lk-table-cell-pad-md, 14px 16px)", align = "left", width, truncate = false } = {}) {
  return { ..._chunkNU3MH6RFcjs.thStyle.call(void 0, padding), textAlign: align, ...getColumnSizingStyle({ width, truncate }) };
}
function getTableDataCellStyle({ padding = "var(--lk-table-cell-pad-md, 14px 16px)", align = "left", width, truncate = false } = {}) {
  return { ..._chunkNU3MH6RFcjs.tdStyle.call(void 0, padding), textAlign: align, ...getColumnSizingStyle({ width, truncate }) };
}
function TableCellContent({ truncate, children }) {
  if (!truncate) return children;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      "data-slot": "truncated-content",
      style: { display: "block", minWidth: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
      children
    }
  );
}
function TableRow({ columns, row, rowIndex, pad, hover, banded, rowHeaderKey, getRowProps }) {
  const [h, setH] = _react2.default.useState(false);
  const rowProps = _nullishCoalesce(_optionalChain([getRowProps, 'optionalCall', _ => _(row, rowIndex)]), () => ( {}));
  const {
    className,
    style,
    onMouseEnter,
    onMouseLeave,
    ...restRowProps
  } = rowProps;
  const restBackground = banded ? "var(--color-semantic-fill-alternative)" : "transparent";
  const hoverBackground = banded ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-fill-alternative)";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "tr",
    {
      ...restRowProps,
      className,
      "data-banded": banded || void 0,
      onMouseEnter: (event) => {
        setH(true);
        _optionalChain([onMouseEnter, 'optionalCall', _2 => _2(event)]);
      },
      onMouseLeave: (event) => {
        setH(false);
        _optionalChain([onMouseLeave, 'optionalCall', _3 => _3(event)]);
      },
      style: { background: hover && h ? hoverBackground : restBackground, transition: "background var(--dur-fast) var(--ease-out)", ...style },
      children: columns.map((c) => {
        const content = typeof c.render === "function" ? c.render(row) : row[c.key];
        const cellStyle = getTableDataCellStyle({ padding: pad, align: c.align || "left", width: c.width, truncate: c.truncate });
        const cellContent = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TableCellContent, { truncate: c.truncate, children: content });
        if (rowHeaderKey != null && c.key === rowHeaderKey) {
          return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "th", { scope: "row", style: { ...cellStyle, fontWeight: "inherit" }, children: cellContent }, c.key);
        }
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "td", { style: cellStyle, children: cellContent }, c.key);
      })
    }
  );
}
function Table({
  columns = [],
  rows = [],
  size = "md",
  hover = true,
  banded = false,
  caption,
  tableLabel,
  tableLabelledBy,
  rowHeaderKey,
  getRowId,
  getRowProps,
  className,
  style,
  ...rest
}) {
  const pad = size === "sm" ? "var(--lk-table-cell-pad-sm, 10px 12px)" : "var(--lk-table-cell-pad-md, 14px 16px)";
  const nameFromAria = caption == null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      ...rest,
      className: ["lk-scroll-surface", className].filter(Boolean).join(" "),
      "data-scrollbar": "auto",
      "data-scroll-gutter": "auto",
      style: { overflowX: "auto", scrollbarGutter: "auto", ...style },
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
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "thead", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "tr", { children: columns.map((c) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "th", { scope: "col", style: getTableHeaderCellStyle({ padding: pad, align: c.align || "left", width: c.width, truncate: c.truncate }), children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TableCellContent, { truncate: c.truncate, children: c.label }) }, c.key)) }) }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "tbody", { children: rows.map((r, ri) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              TableRow,
              {
                columns,
                row: r,
                rowIndex: ri,
                pad,
                hover,
                banded,
                rowHeaderKey,
                getRowProps
              },
              getRowId ? getRowId(r, ri) : _nullishCoalesce(_optionalChain([r, 'optionalAccess', _4 => _4.id]), () => ( ri))
            )) })
          ]
        }
      )
    }
  );
}





exports.getTableHeaderCellStyle = getTableHeaderCellStyle; exports.getTableDataCellStyle = getTableDataCellStyle; exports.Table = Table;
//# sourceMappingURL=chunk-SGW3CUMZ.cjs.map