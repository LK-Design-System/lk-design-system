"use client";

// components/layout/Col.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Col({ children, span, sm, md, lg, style, ...rest }) {
  const vars = {};
  if (span != null) vars["--col-span"] = span;
  if (sm != null) vars["--col-span-sm"] = sm;
  if (md != null) vars["--col-span-md"] = md;
  if (lg != null) vars["--col-span-lg"] = lg;
  return /* @__PURE__ */ jsx("div", { className: "lk-col", style: { ...vars, ...style }, ...rest, children });
}

export {
  Col
};
//# sourceMappingURL=chunk-T73ZGFHM.js.map