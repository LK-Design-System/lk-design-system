"use client";
import {
  useLightDismiss
} from "./chunk-SFKCQB3X.js";
import {
  Icon
} from "./chunk-ON44Y65B.js";

// components/buttons/SpeedDial.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function SpeedDial({ icon, actions = [], open, defaultOpen = false, onOpenChange, label = "\uC791\uC5C5", style, onKeyDown, ...rest }) {
  const controlled = open !== void 0;
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = controlled ? open : internal;
  const dialId = React.useId();
  const listId = `${dialId}-actions`;
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const setOpen = (v) => {
    if (!controlled) setInternal(v);
    onOpenChange && onOpenChange(v);
  };
  const close = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (!restoreFocus) return;
    const run = () => triggerRef.current && triggerRef.current.focus();
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else setTimeout(run, 0);
  };
  useLightDismiss({
    open: isOpen,
    rootRef,
    getTrigger: () => triggerRef.current,
    onDismiss: () => setOpen(false)
  });
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== "Escape" || !isOpen) return;
    event.stopPropagation();
    close({ restoreFocus: true });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: rootRef,
      onKeyDown: handleKeyDown,
      style: { display: "inline-flex", flexDirection: "column-reverse", alignItems: "flex-end", gap: 12, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            ref: triggerRef,
            type: "button",
            "aria-label": label,
            "aria-expanded": isOpen,
            "aria-controls": isOpen ? listId : void 0,
            onClick: () => isOpen ? close() : setOpen(true),
            style: {
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-lg)",
              background: "var(--color-semantic-primary-normal)",
              color: "var(--component-button-primary-fg)",
              transform: isOpen ? "rotate(45deg)" : "none",
              transition: "transform var(--dur-fast) var(--ease-out)"
            },
            children: icon || /* @__PURE__ */ jsx(Icon, { name: "plus", size: 24, "aria-hidden": "true" })
          }
        ),
        isOpen && /* @__PURE__ */ jsx("ul", { id: listId, style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-2-5)", justifyItems: "end" }, children: actions.map((a, i) => {
          const actionLabel = a.ariaLabel || (typeof a.label === "string" ? a.label : void 0);
          const actionId = `${dialId}-action-${i}`;
          return /* @__PURE__ */ jsxs("li", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2-5)" }, children: [
            /* @__PURE__ */ jsx("span", { id: actionId, style: { padding: "4px 9px", borderRadius: "var(--radius-sm)", background: "var(--color-semantic-inverse-background)", color: "var(--color-semantic-inverse-label)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-semibold)", boxShadow: "var(--shadow-sm)", whiteSpace: "nowrap" }, children: a.label }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": actionLabel,
                "aria-labelledby": actionLabel ? void 0 : actionId,
                onClick: () => {
                  a.onClick && a.onClick();
                  close({ restoreFocus: true });
                },
                style: {
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow-md)",
                  background: a.danger ? "var(--color-semantic-status-negative)" : "var(--color-semantic-background-elevated-normal)",
                  color: a.danger ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-normal)",
                  border: a.danger ? "none" : "1px solid var(--color-semantic-line-normal-normal)"
                },
                children: a.icon
              }
            )
          ] }, actionLabel ?? i);
        }) })
      ]
    }
  );
}

export {
  SpeedDial
};
//# sourceMappingURL=chunk-UDXPTEVS.js.map