"use client";

// components/content/Blockquote.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Blockquote({ children, cite, style, ...rest }) {
  return /* @__PURE__ */ jsxs("blockquote", { style: { margin: 0, padding: "6px 0 6px 20px", borderLeft: "3px solid var(--color-semantic-primary-normal)", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--headline2-size)", lineHeight: 1.7, letterSpacing: 0, color: "var(--color-semantic-label-normal)", wordBreak: "keep-all" }, children }),
    cite != null && /* @__PURE__ */ jsxs("div", { style: { marginTop: 8, fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-alternative)" }, children: [
      "\u2014 ",
      cite
    ] })
  ] });
}

export {
  Blockquote
};
//# sourceMappingURL=chunk-VMFRKWUX.js.map