"use client";
import {
  tdStyle,
  thStyle
} from "./chunk-QNMDUXYO.js";

// components/data/Table.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function getColumnSizingStyle({ width, truncate = false }) {
  return truncate ? { width: "100%", maxWidth: 0, overflow: "hidden", textOverflow: "ellipsis" } : { width };
}
function getTableHeaderCellStyle({ padding = "var(--lk-table-cell-pad-md, 14px 16px)", align = "left", width, truncate = false } = {}) {
  return { ...thStyle(padding), textAlign: align, ...getColumnSizingStyle({ width, truncate }) };
}
function getTableDataCellStyle({ padding = "var(--lk-table-cell-pad-md, 14px 16px)", align = "left", width, truncate = false } = {}) {
  return { ...tdStyle(padding), textAlign: align, ...getColumnSizingStyle({ width, truncate }) };
}
function TableCellContent({ truncate, children }) {
  if (!truncate) return children;
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "truncated-content",
      style: { display: "block", minWidth: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
      children
    }
  );
}
function TableRow({ columns, row, rowIndex, pad, hover, banded, rowHeaderKey, getRowProps }) {
  const [h, setH] = React.useState(false);
  const rowProps = getRowProps?.(row, rowIndex) ?? {};
  const {
    className,
    style,
    onMouseEnter,
    onMouseLeave,
    ...restRowProps
  } = rowProps;
  const restBackground = banded ? "var(--color-semantic-fill-alternative)" : "transparent";
  const hoverBackground = banded ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-fill-alternative)";
  return /* @__PURE__ */ jsx(
    "tr",
    {
      ...restRowProps,
      className,
      "data-banded": banded || void 0,
      onMouseEnter: (event) => {
        setH(true);
        onMouseEnter?.(event);
      },
      onMouseLeave: (event) => {
        setH(false);
        onMouseLeave?.(event);
      },
      style: { background: hover && h ? hoverBackground : restBackground, transition: "background var(--dur-fast) var(--ease-out)", ...style },
      children: columns.map((c) => {
        const content = typeof c.render === "function" ? c.render(row) : row[c.key];
        const cellStyle = getTableDataCellStyle({ padding: pad, align: c.align || "left", width: c.width, truncate: c.truncate });
        const cellContent = /* @__PURE__ */ jsx(TableCellContent, { truncate: c.truncate, children: content });
        if (rowHeaderKey != null && c.key === rowHeaderKey) {
          return /* @__PURE__ */ jsx("th", { scope: "row", style: { ...cellStyle, fontWeight: "inherit" }, children: cellContent }, c.key);
        }
        return /* @__PURE__ */ jsx("td", { style: cellStyle, children: cellContent }, c.key);
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
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...rest,
      className: ["lk-scroll-surface", className].filter(Boolean).join(" "),
      "data-scrollbar": "auto",
      "data-scroll-gutter": "auto",
      style: { overflowX: "auto", scrollbarGutter: "auto", ...style },
      children: /* @__PURE__ */ jsxs(
        "table",
        {
          "aria-label": nameFromAria ? tableLabel : void 0,
          "aria-labelledby": nameFromAria ? tableLabelledBy : void 0,
          style: { width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" },
          children: [
            caption != null && /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsx("th", { scope: "col", style: getTableHeaderCellStyle({ padding: pad, align: c.align || "left", width: c.width, truncate: c.truncate }), children: /* @__PURE__ */ jsx(TableCellContent, { truncate: c.truncate, children: c.label }) }, c.key)) }) }),
            /* @__PURE__ */ jsx("tbody", { children: rows.map((r, ri) => /* @__PURE__ */ jsx(
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
              getRowId ? getRowId(r, ri) : r?.id ?? ri
            )) })
          ]
        }
      )
    }
  );
}

export {
  getTableHeaderCellStyle,
  getTableDataCellStyle,
  Table
};
//# sourceMappingURL=chunk-ZUVCKRPF.js.map