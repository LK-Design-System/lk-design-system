"use client";
import {
  anchoredPanelStyle
} from "./chunk-AUE7ZNXQ.js";
import {
  appendAriaReference,
  findOverlayTrigger,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss
} from "./chunk-ESGH2GMP.js";

// components/overlay/Popover.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Popover({
  trigger,
  children,
  align = "left",
  width = 260,
  open,
  defaultOpen = false,
  onOpenChange,
  ariaLabel = "\uD31D\uC624\uBC84",
  style,
  ...rest
}) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const rootRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const panelId = React.useId();
  const getTrigger = React.useCallback(() => findOverlayTrigger(rootRef.current), []);
  const position = useFloatingPosition({
    open: visible,
    anchorRef: rootRef,
    panelRef,
    placement: "bottom"
  });
  useLightDismiss({
    open: visible,
    rootRef,
    getTrigger,
    onDismiss: () => setVisible(false)
  });
  const toggle = (event) => {
    trigger?.props?.onClick?.(event);
    if (!event?.defaultPrevented) setVisible((current) => !current);
  };
  const triggerProps = {
    "data-anchored-overlay-trigger": "",
    "aria-haspopup": "dialog",
    "aria-expanded": visible,
    "aria-controls": visible ? appendAriaReference(trigger?.props?.["aria-controls"], panelId) : trigger?.props?.["aria-controls"],
    onClick: toggle
  };
  const renderedTrigger = React.isValidElement(trigger) && trigger.type !== React.Fragment ? React.cloneElement(trigger, triggerProps) : /* @__PURE__ */ jsx(
    "span",
    {
      ...triggerProps,
      role: "button",
      tabIndex: 0,
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle(event);
        }
      },
      children: trigger
    }
  );
  const verticalStyle = position.placement === "top" ? { top: "auto", bottom: "calc(100% + 8px)" } : { top: "calc(100% + 8px)", bottom: "auto" };
  const horizontalStyle = align === "right" ? { left: "auto", right: 0 } : { left: 0, right: "auto" };
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, style: { position: "relative", display: "inline-block", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: renderedTrigger }),
    visible && /* @__PURE__ */ jsx(
      "div",
      {
        ref: panelRef,
        className: "lk-scroll-surface",
        "data-scrollbar": "compact",
        "data-scroll-gutter": "stable",
        id: panelId,
        role: "dialog",
        "aria-label": ariaLabel,
        "data-placement": position.placement,
        style: {
          ...anchoredPanelStyle(width),
          ...verticalStyle,
          ...horizontalStyle,
          maxHeight: position.maxHeight ?? void 0,
          overflowY: "auto",
          scrollbarGutter: "stable",
          translate: `${position.shiftX}px ${position.shiftY}px`
        },
        children
      }
    )
  ] });
}

export {
  Popover
};
//# sourceMappingURL=chunk-4PDROYTK.js.map