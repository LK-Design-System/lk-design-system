"use client";
import {
  useDialogFocus
} from "./chunk-43HQYUXE.js";
import {
  OverlayPortal
} from "./chunk-Z5XUQZMO.js";

// components/overlay/Sheet.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Sheet({
  open = false,
  title,
  children,
  footer,
  onClose,
  closeOnScrim = true,
  height,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uD558\uB2E8 \uC2DC\uD2B8",
  withinPortal = true,
  portalTarget,
  zIndex,
  style,
  ...rest
}) {
  const [shown, setShown] = React.useState(false);
  const titleId = React.useId();
  const portalRef = React.useRef(null);
  const portalAnchorRef = React.useRef(null);
  if (open && !portalAnchorRef.current && typeof document !== "undefined") {
    portalAnchorRef.current = returnFocusRef?.current ?? document.activeElement;
  }
  if (!open) portalAnchorRef.current = null;
  const { dialogRef, zIndex: resolvedZIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex
  });
  React.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    return void 0;
  }, [open]);
  if (!open) return null;
  return /* @__PURE__ */ jsx(OverlayPortal, { open, withinPortal, portalTarget, anchorRef: portalAnchorRef, portalRef, layer: "modal", children: /* @__PURE__ */ jsx(
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex: resolvedZIndex, background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", opacity: shown ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)" },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: dialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title != null ? titleId : void 0,
          "aria-label": title == null ? ariaLabel : void 0,
          tabIndex: -1,
          style: { position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "88vh", height, display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", borderTopLeftRadius: "var(--radius-3xl)", borderTopRightRadius: "var(--radius-3xl)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : "translateY(100%)", transition: "transform var(--dur-slow) var(--ease-out)", ...style },
          ...rest,
          children: [
            /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", paddingTop: "var(--space-2-5)" }, children: /* @__PURE__ */ jsx("span", { style: { width: 40, height: 4, borderRadius: "var(--radius-pill)", background: "var(--color-semantic-interaction-inactive)" } }) }),
            title != null && /* @__PURE__ */ jsx("div", { id: titleId, style: { padding: "14px 22px 4px", fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: title }),
            /* @__PURE__ */ jsx("div", { className: "lk-scroll-surface", "data-scrollbar": "auto", "data-scroll-gutter": "stable", style: { flex: 1, padding: "14px 22px", overflow: "auto", scrollbarGutter: "stable", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children }),
            footer != null && /* @__PURE__ */ jsx("div", { style: { padding: "14px 22px 22px", display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: footer })
          ]
        }
      )
    }
  ) });
}

export {
  Sheet
};
//# sourceMappingURL=chunk-AT5ADMBF.js.map