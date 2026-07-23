"use client";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/content/Accordion.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Accordion({ items = [], multiple = false, defaultOpen = [], headingLevel = 3, style, ...rest }) {
  const noHeading = headingLevel === false || headingLevel == null;
  const HeadingTag = noHeading ? React.Fragment : `h${headingLevel}`;
  const headingProps = noHeading ? {} : { style: { margin: 0, font: "inherit" } };
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const rawId = React.useId();
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(i)) next.delete(i);
    else next.add(i);
    return next;
  });
  return /* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid var(--color-semantic-line-solid-normal)", ...style }, ...rest, children: items.map((it, i) => {
    const isOpen = open.has(i);
    const triggerId = `${rawId}-${i}-trigger`;
    const panelId = `${rawId}-${i}-panel`;
    return /* @__PURE__ */ jsxs("div", { style: { borderBottom: "1px solid var(--color-semantic-line-solid-normal)" }, children: [
      /* @__PURE__ */ jsx(HeadingTag, { ...headingProps, children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          id: triggerId,
          "aria-expanded": isOpen,
          "aria-controls": panelId,
          onClick: () => toggle(i),
          style: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "18px 4px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--headline2-size)",
            fontWeight: "var(--fw-bold)",
            letterSpacing: 0,
            color: isOpen ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-normal)",
            transition: "color var(--dur-fast) var(--ease-out)"
          },
          children: [
            /* @__PURE__ */ jsx("span", { style: { wordBreak: "keep-all" }, children: it.title }),
            /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: 20, "aria-hidden": "true", style: { flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" } })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { id: panelId, role: "region", "aria-labelledby": triggerId, inert: isOpen ? void 0 : true, style: { display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-out)" }, children: /* @__PURE__ */ jsx("div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ jsx("div", { style: { padding: "0 4px 20px", fontFamily: "var(--font-sans)", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children: it.content }) }) })
    ] }, i);
  }) });
}

export {
  Accordion
};
//# sourceMappingURL=chunk-JWE42WUG.js.map