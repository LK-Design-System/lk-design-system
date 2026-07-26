"use client";
import {
  tdStyle,
  thStyle
} from "./chunk-22ESLNNA.js";

// components/data/Table.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function TableRow({ columns, row, pad, hover, rowHeaderKey }) {
  const [h, setH] = React.useState(false);
  return /* @__PURE__ */ jsx(
    "tr",
    {
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: { background: hover && h ? "var(--color-semantic-fill-alternative)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)" },
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
                pad,
                hover,
                rowHeaderKey
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
  Table
};
//# sourceMappingURL=chunk-HR623JO2.js.map