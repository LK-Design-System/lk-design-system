"use client";
import {
  useDialogFocus
} from "./chunk-5ZE7DMKD.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/overlay/Modal.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Modal({
  open = false,
  title,
  children,
  footer,
  onClose,
  width = 520,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uBAA8\uB2EC",
  style,
  ...rest
}) {
  const titleId = React.useId();
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus
  });
  if (!open) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))" },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: dialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title != null ? titleId : void 0,
          "aria-label": title == null ? ariaLabel : void 0,
          tabIndex: -1,
          style: { width: "100%", maxWidth: width, maxHeight: "86vh", display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", borderRadius: "var(--component-dialog-radius)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", overflow: "hidden", ...style },
          ...rest,
          children: [
            (title != null || onClose) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--color-semantic-line-solid-normal)" }, children: [
              /* @__PURE__ */ jsx("div", { id: titleId, style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: title }),
              onClose && /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "\uB2EB\uAE30", onClick: onClose, style: { display: "inline-flex", padding: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-semantic-label-assistive)" }, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 20, "aria-hidden": "true" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { style: { padding: "var(--space-5) var(--space-6)", overflow: "auto", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children }),
            footer != null && /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--color-semantic-line-solid-normal)" }, children: footer })
          ]
        }
      )
    }
  );
}

export {
  Modal
};
//# sourceMappingURL=chunk-RQJFAL3C.js.map