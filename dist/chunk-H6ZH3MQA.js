"use client";
import {
  tdStyle,
  thStyle
} from "./chunk-IGVXI6D7.js";

// components/data/Table.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function getTableHeaderCellStyle({ padding = "14px 16px", align = "left", width } = {}) {
  return { ...thStyle(padding), textAlign: align, width };
}
function getTableDataCellStyle({ padding = "14px 16px", align = "left", width } = {}) {
  return { ...tdStyle(padding), textAlign: align, width };
}
function TableRow({ columns, row, rowIndex, pad, hover, rowHeaderKey, getRowProps }) {
  const [h, setH] = React.useState(false);
  const rowProps = getRowProps?.(row, rowIndex) ?? {};
  const {
    className,
    style,
    onMouseEnter,
    onMouseLeave,
    ...restRowProps
  } = rowProps;
  return /* @__PURE__ */ jsx(
    "tr",
    {
      ...restRowProps,
      className,
      onMouseEnter: (event) => {
        setH(true);
        onMouseEnter?.(event);
      },
      onMouseLeave: (event) => {
        setH(false);
        onMouseLeave?.(event);
      },
      style: { background: hover && h ? "var(--color-semantic-fill-alternative)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)", ...style },
      children: columns.map((c) => {
        const content = typeof c.render === "function" ? c.render(row) : row[c.key];
        const cellStyle = { ...tdStyle(pad), textAlign: c.align || "left" };
        if (rowHeaderKey != null && c.key === rowHeaderKey) {
          return /* @__PURE__ */ jsx("th", { scope: "row", style: { ...cellStyle, fontWeight: "inherit" }, children: content }, c.key);
        }
        return /* @__PURE__ */ jsx("td", { style: cellStyle, children: content }, c.key);
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
  getRowProps,
  className,
  style,
  ...rest
}) {
  const pad = size === "sm" ? "10px 12px" : "14px 16px";
  const nameFromAria = caption == null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...rest,
      className: ["lk-scroll-surface", className].filter(Boolean).join(" "),
      "data-scrollbar": "auto",
      "data-scroll-gutter": "stable",
      style: { overflowX: "auto", scrollbarGutter: "stable", ...style },
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
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsx("th", { scope: "col", style: { ...thStyle(pad), textAlign: c.align || "left", width: c.width }, children: c.label }, c.key)) }) }),
            /* @__PURE__ */ jsx("tbody", { children: rows.map((r, ri) => /* @__PURE__ */ jsx(
              TableRow,
              {
                columns,
                row: r,
                rowIndex: ri,
                pad,
                hover,
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
//# sourceMappingURL=chunk-H6ZH3MQA.js.map