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
} from "./chunk-SFKCQB3X.js";

// components/overlay/HoverCard.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function HoverCard({
  trigger,
  children,
  align = "left",
  width = 280,
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 120,
  closeDelay = 120,
  style,
  panelStyle,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const timerRef = React.useRef(null);
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
    onDismiss: () => setVisible(false),
    outsidePress: false
  });
  React.useEffect(() => () => clearTimeout(timerRef.current), []);
  const schedule = (next, delay) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(next), delay);
  };
  const show = (event) => {
    onMouseEnter?.(event);
    schedule(true, openDelay);
  };
  const hide = (event) => {
    onMouseLeave?.(event);
    schedule(false, closeDelay);
  };
  const showOnFocus = (event) => {
    onFocus?.(event);
    clearTimeout(timerRef.current);
    setVisible(true);
  };
  const hideOnBlur = (event) => {
    onBlur?.(event);
    if (!event.currentTarget.contains(event.relatedTarget)) schedule(false, closeDelay);
  };
  const renderedTrigger = React.isValidElement(trigger) && trigger.type !== React.Fragment ? React.cloneElement(trigger, {
    "data-anchored-overlay-trigger": "",
    "aria-describedby": appendAriaReference(trigger.props["aria-describedby"], panelId)
  }) : /* @__PURE__ */ jsx(
    "span",
    {
      "data-anchored-overlay-trigger": "",
      "aria-describedby": panelId,
      tabIndex: 0,
      children: trigger
    }
  );
  const verticalStyle = position.placement === "top" ? { top: "auto", bottom: "calc(100% + 8px)" } : { top: "calc(100% + 8px)", bottom: "auto" };
  const horizontalStyle = align === "right" ? { left: "auto", right: 0 } : { left: 0, right: "auto" };
  return /* @__PURE__ */ jsxs(
    "span",
    {
      ref: rootRef,
      style: { position: "relative", display: "inline-flex", ...style },
      ...rest,
      onMouseEnter: show,
      onMouseLeave: hide,
      onFocus: showOnFocus,
      onBlur: hideOnBlur,
      children: [
        renderedTrigger,
        visible && /* @__PURE__ */ jsx(
          "div",
          {
            ref: panelRef,
            className: "lk-scroll-surface",
            "data-scrollbar": "compact",
            "data-scroll-gutter": "stable",
            id: panelId,
            role: "tooltip",
            "data-placement": position.placement,
            style: {
              ...anchoredPanelStyle(width),
              ...verticalStyle,
              ...horizontalStyle,
              maxHeight: position.maxHeight ?? void 0,
              overflowY: "auto",
              scrollbarGutter: "stable",
              translate: `${position.shiftX}px ${position.shiftY}px`,
              ...panelStyle
            },
            children
          }
        )
      ]
    }
  );
}

export {
  HoverCard
};
//# sourceMappingURL=chunk-FFS2ANVG.js.map