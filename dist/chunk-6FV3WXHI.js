"use client";
import {
  tdStyle,
  thStyle
} from "./chunk-22ESLNNA.js";

// components/data/Table.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function TableRow({ columns, row, pad, hover }) {
  const [h, setH] = React.useState(false);
  return /* @__PURE__ */ jsx(
    "tr",
    {
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: { background: hover && h ? "var(--color-semantic-fill-alternative)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)" },
      children: columns.map((c) => /* @__PURE__ */ jsx("td", { style: { ...tdStyle(pad), textAlign: c.align || "left" }, children: typeof c.render === "function" ? c.render(row) : row[c.key] }, c.key))
    }
  );
}
function Table({ columns = [], rows = [], size = "md", hover = true, style, ...rest }) {
  const pad = size === "sm" ? "10px 12px" : "14px 16px";
  return /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", ...style }, ...rest, children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }, children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((c) => /* @__PURE__ */ jsx("th", { style: { ...thStyle(pad), textAlign: c.align || "left", width: c.width }, children: c.label }, c.key)) }) }),
    /* @__PURE__ */ jsx("tbody", { children: rows.map((r, ri) => /* @__PURE__ */ jsx(TableRow, { columns, row: r, pad, hover }, ri)) })
  ] }) });
}

export {
  Table
};
//# sourceMappingURL=chunk-6FV3WXHI.js.map