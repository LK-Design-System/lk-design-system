"use client";
import {
  anchoredPanelStyle
} from "./chunk-AUE7ZNXQ.js";
import {
  componentVars,
  partClassName,
  partStyle,
  useMergedRefs
} from "./chunk-A2U7YIGP.js";
import {
  appendAriaReference,
  findOverlayTrigger,
  inlineFloatingStyle,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss
} from "./chunk-SFKCQB3X.js";
import {
  OverlayPortal
} from "./chunk-7MEK4Y6F.js";

// components/overlay/Popover.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Popover = React.forwardRef(function Popover2({
  trigger,
  children,
  align = "left",
  position: requestedPosition = "bottom",
  offset = 8,
  width = 260,
  open,
  defaultOpen = false,
  onOpenChange,
  ariaLabel = "\uD31D\uC624\uBC84",
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
  const rootRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const panelId = React.useId();
  const mergedRootRef = useMergedRefs(rootRef, forwardedRef);
  const getTrigger = React.useCallback(() => findOverlayTrigger(rootRef.current), []);
  const position = useFloatingPosition({
    open: visible,
    anchorRef: rootRef,
    panelRef,
    placement: requestedPosition,
    offset,
    strategy: withinPortal ? "fixed" : "absolute",
    align
  });
  const layer = useLightDismiss({
    open: visible,
    rootRef,
    getTrigger,
    onDismiss: () => setVisible(false),
    insideRefs: [panelRef],
    zIndex
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: mergedRootRef,
      "data-slot": "root",
      "data-open": visible ? "true" : void 0,
      className: partClassName(classNames, "root", className) || void 0,
      style: { ...componentVars(vars, "--lds-popover-"), position: "relative", display: "inline-block", ...partStyle(styles, "root"), ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { "data-slot": "trigger", className: partClassName(classNames, "trigger") || void 0, style: { display: "inline-flex", ...partStyle(styles, "trigger") }, children: renderedTrigger }),
        /* @__PURE__ */ jsx(OverlayPortal, { open: visible, withinPortal, portalTarget, anchorRef: rootRef, layer: "anchored", children: /* @__PURE__ */ jsx(
          "div",
          {
            ref: panelRef,
            "data-slot": "panel",
            "data-popover-portal": withinPortal ? "true" : void 0,
            className: partClassName(classNames, "panel", "lk-scroll-surface") || void 0,
            "data-scrollbar": "compact",
            "data-scroll-gutter": "stable",
            id: panelId,
            role: "dialog",
            "aria-label": ariaLabel,
            "data-placement": position.placement,
            style: {
              ...componentVars(vars, "--lds-popover-"),
              ...anchoredPanelStyle(width),
              width: `var(--lds-popover-width, ${typeof width === "number" ? `${width}px` : width})`,
              ...withinPortal ? { position: "fixed", top: position.y ?? -9999, left: position.x ?? -9999, right: "auto", bottom: "auto", translate: "none" } : inlineFloatingStyle({ placement: position.placement, align, offset, shiftX: position.shiftX, shiftY: position.shiftY }),
              zIndex: layer.zIndex,
              maxHeight: `var(--lds-popover-max-height, ${position.maxHeight == null ? "none" : `${position.maxHeight}px`})`,
              overflowY: "auto",
              scrollbarGutter: "stable",
              ...partStyle(styles, "panel")
            },
            children
          }
        ) })
      ]
    }
  );
});

export {
  Popover
};
//# sourceMappingURL=chunk-V5ZUYQA4.js.map