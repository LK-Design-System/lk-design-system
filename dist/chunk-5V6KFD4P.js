"use client";
import {
  VisuallyHidden
} from "./chunk-LSN3BTKD.js";

// components/content/MissingValue.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function MissingValue({ label = "\uAC12 \uC5C6\uC74C", style, ...rest }) {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      style: { color: "var(--color-semantic-label-alternative)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u2014" }),
        /* @__PURE__ */ jsx(VisuallyHidden, { children: label })
      ]
    }
  );
}

export {
  MissingValue
};
//# sourceMappingURL=chunk-5V6KFD4P.js.map