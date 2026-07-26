"use client";

// components/layout/Columns.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var toLen = (v) => typeof v === "number" ? v + "px" : v;
function Columns({ children, columns = 12, gap, columnGap, rowGap, style, ...rest }) {
  const vars = { "--cols": columns };
  if (gap != null) {
    vars["--col-gap"] = toLen(gap);
    vars["--row-gap"] = toLen(gap);
  }
  if (columnGap != null) vars["--col-gap"] = toLen(columnGap);
  if (rowGap != null) vars["--row-gap"] = toLen(rowGap);
  return /* @__PURE__ */ jsx("div", { className: "lk-grid", style: { ...vars, ...style }, ...rest, children });
}

export {
  Columns
};
//# sourceMappingURL=chunk-CYGVQXPH.js.map