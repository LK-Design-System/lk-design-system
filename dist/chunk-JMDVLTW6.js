"use client";
import {
  useDialogFocus
} from "./chunk-S7AF4K3X.js";
import {
  componentVars,
  partClassName,
  partStyle,
  useMergedRefs
} from "./chunk-A2U7YIGP.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  useControllableOpen
} from "./chunk-SFKCQB3X.js";
import {
  OverlayPortal
} from "./chunk-7MEK4Y6F.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/overlay/Modal.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Modal = React.forwardRef(function Modal2({
  open,
  defaultOpen = false,
  onOpenChange,
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
  withinPortal = true,
  portalTarget,
  zIndex,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const titleId = React.useId();
  const descriptionId = React.useId();
  const portalRef = React.useRef(null);
  const portalAnchorRef = React.useRef(null);
  if (visible && !portalAnchorRef.current && typeof document !== "undefined") {
    portalAnchorRef.current = returnFocusRef?.current ?? document.activeElement;
  }
  if (!visible) portalAnchorRef.current = null;
  const requestClose = React.useCallback(() => {
    onClose?.();
    setVisible(false);
  }, [onClose, setVisible]);
  const { dialogRef, zIndex: resolvedZIndex } = useDialogFocus({
    open: visible,
    onDismiss: requestClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex
  });
  const mergedDialogRef = useMergedRefs(dialogRef, forwardedRef);
  if (!visible) return null;
  return /* @__PURE__ */ jsx(OverlayPortal, { open: visible, withinPortal, portalTarget, anchorRef: portalAnchorRef, portalRef, layer: "modal", children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "backdrop",
      className: partClassName(classNames, "backdrop") || void 0,
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget) requestClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex: resolvedZIndex, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", ...partStyle(styles, "backdrop") },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: mergedDialogRef,
          "data-slot": "root",
          "data-open": "true",
          className: partClassName(classNames, "root", className) || void 0,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title != null ? titleId : void 0,
          "aria-label": title == null ? ariaLabel : void 0,
          "aria-describedby": children != null ? descriptionId : void 0,
          tabIndex: -1,
          style: { ...componentVars(vars, "--lds-modal-"), width: "100%", maxWidth: `var(--lds-modal-width, ${typeof width === "number" ? `${width}px` : width})`, maxHeight: "var(--lds-modal-max-height, 86vh)", display: "flex", flexDirection: "column", background: "var(--color-semantic-background-elevated-normal)", borderRadius: "var(--lds-modal-radius, var(--component-dialog-radius))", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", overflow: "hidden", ...partStyle(styles, "root"), ...style },
          ...rest,
          children: [
            (title != null || onClose || onOpenChange || open === void 0) && /* @__PURE__ */ jsxs("div", { "data-slot": "header", className: partClassName(classNames, "header") || void 0, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--color-semantic-line-solid-normal)", ...partStyle(styles, "header") }, children: [
              /* @__PURE__ */ jsx("div", { "data-slot": "title", className: partClassName(classNames, "title") || void 0, id: titleId, style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", ...partStyle(styles, "title") }, children: title }),
              (onClose || onOpenChange || open === void 0) && /* @__PURE__ */ jsx("span", { "data-slot": "close", className: partClassName(classNames, "close") || void 0, style: partStyle(styles, "close"), children: /* @__PURE__ */ jsx(IconButton, { size: "sm", variant: "plain", label: "\uB2EB\uAE30", onClick: requestClose, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 20, "aria-hidden": "true" }) }) })
            ] }),
            /* @__PURE__ */ jsx("div", { "data-slot": "body", id: descriptionId, className: partClassName(classNames, "body", "lk-scroll-surface") || void 0, "data-scrollbar": "auto", "data-scroll-gutter": "stable", style: { padding: "var(--space-5) var(--space-6)", overflow: "auto", scrollbarGutter: "stable", fontSize: "var(--body2-size)", lineHeight: 1.7, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all", ...partStyle(styles, "body") }, children }),
            footer != null && /* @__PURE__ */ jsx("div", { "data-slot": "footer", className: partClassName(classNames, "footer") || void 0, style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", padding: "var(--space-4) var(--space-6)", borderTop: "1px solid var(--color-semantic-line-solid-normal)", ...partStyle(styles, "footer") }, children: footer })
          ]
        }
      )
    }
  ) });
});

export {
  Modal
};
//# sourceMappingURL=chunk-JMDVLTW6.js.map