"use client";
import {
  FieldLabel,
  FieldMessage
} from "./chunk-P6R245TY.js";

// components/forms/FormField.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function FormField({ label, required = false, helper, error, htmlFor, children, style, ...rest }) {
  const message = error ?? helper;
  return /* @__PURE__ */ jsxs("div", { ...rest, style: { display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", minWidth: 0, fontFamily: "var(--font-sans)", ...style }, children: [
    /* @__PURE__ */ jsx(FieldLabel, { htmlFor, label, required }),
    children,
    /* @__PURE__ */ jsx(FieldMessage, { message, error })
  ] });
}

export {
  FormField
};
//# sourceMappingURL=chunk-64AT7YRV.js.map