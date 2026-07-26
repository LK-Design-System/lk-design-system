"use client";

// components/overlay/Dimmer.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
function Dimmer({
  open = false,
  children,
  onClick,
  blur = false,
  blockInteraction = true,
  busy = true,
  style,
  ...rest
}) {
  const scrimRef = React.useRef(null);
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const scrim = scrimRef.current;
    const region = scrim?.parentElement;
    if (!region) return void 0;
    const inerted = [];
    if (blockInteraction) {
      Array.from(region.children).forEach((child) => {
        if (child === scrim || child.hasAttribute("inert")) return;
        child.setAttribute("inert", "");
        inerted.push(child);
      });
    }
    const hadBusy = region.hasAttribute("aria-busy");
    const previousBusy = region.getAttribute("aria-busy");
    if (busy) region.setAttribute("aria-busy", "true");
    return () => {
      inerted.forEach((child) => child.removeAttribute("inert"));
      if (!busy) return;
      if (hadBusy) region.setAttribute("aria-busy", previousBusy);
      else region.removeAttribute("aria-busy");
    };
  }, [open, blockInteraction, busy]);
  if (!open) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: scrimRef,
      onClick,
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--component-dialog-scrim)",
        color: "var(--color-semantic-inverse-label)",
        backdropFilter: blur ? "blur(var(--component-dialog-scrim-blur))" : "none",
        borderRadius: "inherit",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsx(
        "span",
        {
          "data-dimmer-content": "",
          role: busy ? "status" : void 0,
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-semantic-inverse-background)",
            color: "var(--color-semantic-inverse-label)",
            boxShadow: "var(--shadow-sm)"
          },
          children
        }
      )
    }
  );
}

export {
  Dimmer
};
//# sourceMappingURL=chunk-YWLV36JR.js.map