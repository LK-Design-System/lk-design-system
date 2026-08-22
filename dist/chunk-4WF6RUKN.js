"use client";
import {
  anchoredPanelStyle
} from "./chunk-AUE7ZNXQ.js";
import {
  appendAriaReference,
  findOverlayTrigger,
  inlineFloatingStyle,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss
} from "./chunk-W2RAOTBU.js";
import {
  componentVars,
  partClassName,
  partStyle,
  useMergedRefs
} from "./chunk-A2U7YIGP.js";
import {
  OverlayPortal
} from "./chunk-Z5XUQZMO.js";

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
  collisionBoundary,
  collisionPadding = 16,
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
    viewportPadding: collisionPadding,
    collisionBoundary,
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
  const boundaryMaxWidth = collisionBoundary != null && position.maxWidth != null ? `${position.maxWidth}px` : null;
  const boundaryMaxHeight = collisionBoundary != null && position.maxHeight != null ? `${position.maxHeight}px` : null;
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
              ...partStyle(styles, "panel"),
              ...boundaryMaxWidth == null ? null : { minWidth: 0, maxWidth: boundaryMaxWidth },
              ...boundaryMaxHeight == null ? null : { minHeight: 0, maxHeight: boundaryMaxHeight, overflow: "auto" }
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
//# sourceMappingURL=chunk-4WF6RUKN.js.map