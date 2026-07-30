"use client";
import {
  useDialogFocus
} from "./chunk-POBGVGTA.js";
import {
  Button
} from "./chunk-XM5HF3OA.js";
import {
  ActionArea
} from "./chunk-SI75QPEA.js";

// components/overlay/ConfirmDialog.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function ConfirmDialog({
  open = false,
  title,
  children,
  tone = "default",
  headingLevel = 2,
  confirmLabel = "\uD655\uC778",
  cancelLabel = "\uCDE8\uC18C",
  confirmDisabled = false,
  confirmLoading = false,
  confirmLoadingLabel = "\uCC98\uB9AC \uC911",
  onConfirm,
  onCancel,
  onClose,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uD655\uC778 \uB2E4\uC774\uC5BC\uB85C\uADF8",
  style,
  ...rest
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const cancelFocusRef = React.useRef(null);
  const dismiss = onCancel || onClose;
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: dismiss,
    initialFocusRef: initialFocusRef ?? cancelFocusRef,
    returnFocusRef,
    restoreFocus
  });
  const setDialogRef = React.useCallback((node) => {
    dialogRef.current = node;
    cancelFocusRef.current = node?.querySelector("[data-confirm-dialog-cancel]") ?? null;
  }, [dialogRef]);
  if (!open) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (event) => {
        if (event.target === event.currentTarget && dismiss) dismiss();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))" },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: setDialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": title != null ? titleId : void 0,
          "aria-label": title == null ? ariaLabel : void 0,
          "aria-describedby": children != null ? descriptionId : void 0,
          "data-tone": tone,
          tabIndex: -1,
          style: { width: "100%", maxWidth: "var(--component-confirm-dialog-max-width)", display: "grid", gap: "var(--space-4)", background: "var(--color-semantic-background-elevated-normal)", borderRadius: "var(--component-dialog-radius)", boxShadow: "var(--shadow-xl)", padding: "var(--space-6)", fontFamily: "var(--font-sans)", ...style },
          ...rest,
          children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "var(--space-2)" }, children: [
              title != null && /* @__PURE__ */ jsx(Heading, { id: titleId, style: { margin: 0, color: "var(--color-semantic-label-normal)", fontSize: "var(--heading3-size)", lineHeight: "var(--heading3-line)", fontWeight: "var(--fw-extra)" }, children: title }),
              children != null && /* @__PURE__ */ jsx("div", { id: descriptionId, style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", wordBreak: "keep-all" }, children })
            ] }),
            /* @__PURE__ */ jsxs(ActionArea, { compact: true, divider: false, align: "end", style: { padding: 0, background: "transparent" }, children: [
              /* @__PURE__ */ jsx(Button, { "data-confirm-dialog-cancel": true, variant: "outlined", color: "assistive", onClick: () => dismiss?.(), children: cancelLabel }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: tone === "danger" ? "danger" : "primary",
                  onClick: onConfirm,
                  disabled: confirmDisabled,
                  loading: confirmLoading,
                  loadingLabel: confirmLoadingLabel,
                  children: confirmLabel
                }
              )
            ] })
          ]
        }
      )
    }
  );
}

export {
  ConfirmDialog
};
//# sourceMappingURL=chunk-3E4IVK3I.js.map