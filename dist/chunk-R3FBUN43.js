"use client";

// components/navigation/Anchor.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Anchor({ items = [], active, onChange, style, ...rest }) {
  const isControlled = active !== void 0;
  const [internal, setInternal] = React.useState(items[0] && items[0].href);
  const [hovered, setHovered] = React.useState(null);
  const cur = isControlled ? active : internal;
  return /* @__PURE__ */ jsx("nav", { style: { display: "flex", flexDirection: "column", gap: 2, fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it) => {
    const on = it.href === cur;
    const hov = hovered === it.href;
    return /* @__PURE__ */ jsx(
      "a",
      {
        href: it.href,
        "aria-current": on ? "location" : void 0,
        onClick: () => {
          if (!isControlled) setInternal(it.href);
          onChange && onChange(it.href);
        },
        onMouseEnter: () => setHovered(it.href),
        onMouseLeave: () => setHovered(null),
        style: { display: "block", padding: "7px 12px", paddingLeft: 12 + (it.level || 0) * 16, borderLeft: `2px solid ${on ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`, color: on ? "var(--color-semantic-label-normal)" : hov ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)", fontSize: (it.level || 0) > 0 ? "var(--label2-size)" : "var(--label1-size)", fontWeight: on ? "var(--fw-bold)" : "var(--fw-medium)", textDecoration: "none", transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)" },
        children: it.label
      },
      it.href
    );
  }) });
}

export {
  Anchor
};
//# sourceMappingURL=chunk-R3FBUN43.js.map