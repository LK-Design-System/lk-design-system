"use client";

// components/content/Blockquote.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Blockquote({ children, attribution, cite, citeUrl, style, ...rest }) {
  const source = attribution ?? cite;
  const quoteStyle = { fontSize: "var(--headline2-size)", lineHeight: 1.7, letterSpacing: 0, color: "var(--color-semantic-label-normal)", wordBreak: "keep-all" };
  const frameStyle = { margin: 0, padding: "6px 0 6px 20px", borderLeft: "3px solid var(--color-semantic-primary-normal)", fontFamily: "var(--font-sans)", ...style };
  if (source == null) {
    return /* @__PURE__ */ jsx("blockquote", { cite: citeUrl, style: frameStyle, ...rest, children: /* @__PURE__ */ jsx("div", { style: quoteStyle, children }) });
  }
  return /* @__PURE__ */ jsxs("figure", { style: frameStyle, ...rest, children: [
    /* @__PURE__ */ jsx("blockquote", { cite: citeUrl, style: { margin: 0 }, children: /* @__PURE__ */ jsx("div", { style: quoteStyle, children }) }),
    /* @__PURE__ */ jsxs("figcaption", { style: { marginTop: 8, fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-alternative)" }, children: [
      "\u2014 ",
      source
    ] })
  ] });
}

export {
  Blockquote
};
//# sourceMappingURL=chunk-PLTZYEVI.js.map