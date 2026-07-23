"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/navigation/Breadcrumb.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Breadcrumb({ items = [], style, ...rest }) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "\uD604\uC7AC \uC704\uCE58", style: { fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", ...style }, ...rest, children: /* @__PURE__ */ jsx("ol", { style: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, listStyle: "none", margin: 0, padding: 0 }, children: items.map((it, i) => {
    const last = i === items.length - 1;
    return /* @__PURE__ */ jsxs("li", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
      last || !it.href ? /* @__PURE__ */ jsx("span", { "aria-current": last ? "page" : void 0, style: { color: last ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)", fontWeight: last ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0 }, children: it.label }) : /* @__PURE__ */ jsx("a", { href: it.href, style: { color: "var(--color-semantic-label-neutral)", fontWeight: "var(--fw-medium)", letterSpacing: 0, textDecoration: "none" }, children: it.label }),
      !last && /* @__PURE__ */ jsx(Icon, { name: "chevron-right-small", size: 14, color: "var(--color-semantic-label-assistive)", "aria-hidden": "true" })
    ] }, i);
  }) }) });
}

export {
  Breadcrumb
};
//# sourceMappingURL=chunk-G3MWCWP2.js.map