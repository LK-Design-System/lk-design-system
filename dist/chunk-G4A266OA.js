"use client";

// components/layout/Split.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var toLen = (v) => typeof v === "number" ? v + "px" : v;
function Split({ children, template = "1fr 1fr", at = "md", gap, style, ...rest }) {
  const vars = { "--split-template": template };
  if (gap != null) vars["--split-gap"] = toLen(gap);
  return /* @__PURE__ */ jsx("div", { className: "lk-split", "data-at": at === "lg" ? "lg" : void 0, style: { ...vars, ...style }, ...rest, children });
}

export {
  Split
};
//# sourceMappingURL=chunk-G4A266OA.js.map