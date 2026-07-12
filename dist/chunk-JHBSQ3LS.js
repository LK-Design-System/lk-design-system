"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/content/Collapsible.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Collapsible({ title, children, defaultOpen = false, style, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /* @__PURE__ */ jsxs("div", { style: { ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        "aria-expanded": open,
        onClick: () => setOpen((o) => !o),
        style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 4px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" },
        children: [
          /* @__PURE__ */ jsx("span", { children: title }),
          /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)", flexShrink: 0 } })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-out)" }, children: /* @__PURE__ */ jsx("div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ jsx("div", { style: { padding: "0 4px 14px", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children }) }) })
  ] });
}

export {
  Collapsible
};
//# sourceMappingURL=chunk-JHBSQ3LS.js.map