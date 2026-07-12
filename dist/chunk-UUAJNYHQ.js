"use client";
import {
  appendAriaReference,
  findOverlayTrigger,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss
} from "./chunk-FVVTUKMD.js";

// components/content/Tooltip.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var POS = {
  top: { bottom: "100%", left: "50%" },
  bottom: { top: "100%", left: "50%" },
  left: { right: "100%", top: "50%" },
  right: { left: "100%", top: "50%" }
};
function normalizeAlign(align) {
  return align === "left" ? "leading" : align === "right" ? "trailing" : align;
}
function bubbleOffset(placement, align) {
  const normalizedAlign = normalizeAlign(align);
  if (placement === "top" || placement === "bottom") {
    const y = placement === "top" ? "-8px" : "8px";
    if (normalizedAlign === "leading") {
      return { left: 0, transform: `translateX(0) translateY(${y})` };
    }
    if (normalizedAlign === "trailing") {
      return {
        left: "auto",
        right: 0,
        transform: `translateX(0) translateY(${y})`
      };
    }
    return { transform: `translateX(-50%) translateY(${y})` };
  }
  const x = placement === "left" ? "-8px" : "8px";
  if (normalizedAlign === "top" || normalizedAlign === "leading") {
    return { top: 0, transform: `translateY(0) translateX(${x})` };
  }
  if (normalizedAlign === "bottom" || normalizedAlign === "trailing") {
    return {
      top: "auto",
      bottom: 0,
      transform: `translateY(0) translateX(${x})`
    };
  }
  return { transform: `translateY(-50%) translateX(${x})` };
}
var START_ALIGNS = /* @__PURE__ */ new Set(["leading", "top"]);
var END_ALIGNS = /* @__PURE__ */ new Set(["trailing", "bottom"]);
function offsetValue(value, delta) {
  if (!delta) return value;
  if (typeof value === "number") return value + delta;
  const operator = delta < 0 ? "-" : "+";
  return `calc(${value} ${operator} ${Math.abs(delta)}px)`;
}
function arrowMainAxis(normalizedAlign, target, axis, floatingShift = 0) {
  const size = target ? axis === "x" ? target.w : target.h : null;
  const half = axis === "x" ? "translateX" : "translateY";
  const startEdge = axis === "x" ? "left" : "top";
  const endEdge = axis === "x" ? "right" : "bottom";
  const isStart = START_ALIGNS.has(normalizedAlign);
  const isEnd = END_ALIGNS.has(normalizedAlign);
  if (size == null || !isStart && !isEnd) {
    return {
      edge: startEdge,
      value: offsetValue("50%", -floatingShift),
      shift: `${half}(-50%)`
    };
  }
  if (isStart) {
    return {
      edge: startEdge,
      value: offsetValue(size / 2, -floatingShift),
      shift: `${half}(-50%)`
    };
  }
  return {
    edge: endEdge,
    value: offsetValue(size / 2, floatingShift),
    shift: `${half}(50%)`
  };
}
function arrowStyle(placement, arrowHalf, arrowHeight, normalizedAlign, target, floatingShift) {
  const bg = "var(--color-semantic-inverse-background)";
  if (placement === "top" || placement === "bottom") {
    const a2 = arrowMainAxis(normalizedAlign, target, "x", floatingShift);
    const base2 = {
      width: arrowHalf * 2,
      height: arrowHeight,
      background: bg,
      transform: a2.shift,
      [a2.edge]: a2.value
    };
    return placement === "bottom" ? { ...base2, bottom: "calc(100% - 1px)", clipPath: "polygon(0 100%, 50% 0, 100% 100%)" } : { ...base2, top: "calc(100% - 1px)", clipPath: "polygon(0 0, 50% 100%, 100% 0)" };
  }
  const a = arrowMainAxis(normalizedAlign, target, "y", floatingShift);
  const base = {
    width: arrowHeight,
    height: arrowHalf * 2,
    background: bg,
    transform: a.shift,
    [a.edge]: a.value
  };
  return placement === "left" ? { ...base, left: "calc(100% - 1px)", clipPath: "polygon(0 0, 100% 50%, 0 100%)" } : { ...base, right: "calc(100% - 1px)", clipPath: "polygon(100% 0, 0 50%, 100% 100%)" };
}
function Tooltip({
  content,
  placement,
  position,
  size = "medium",
  align = "center",
  shortcut,
  arrow = true,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const requestedPlace = position || placement || "top";
  const wrapperRef = React.useRef(null);
  const bubbleRef = React.useRef(null);
  const tooltipId = React.useId();
  const getTrigger = React.useCallback(() => findOverlayTrigger(wrapperRef.current), []);
  const floating = useFloatingPosition({
    open: visible,
    anchorRef: wrapperRef,
    panelRef: bubbleRef,
    placement: requestedPlace
  });
  const place = floating.placement;
  const pos = POS[place] || POS.top;
  const compact = size === "small" || size === "sm";
  const arrowHalf = compact ? 7 : 10;
  const arrowHeight = compact ? 6 : 8;
  const normalizedAlign = normalizeAlign(align);
  const [target, setTarget] = React.useState(null);
  const edgeAligned = START_ALIGNS.has(normalizedAlign) || END_ALIGNS.has(normalizedAlign);
  React.useLayoutEffect(() => {
    if (!arrow || !edgeAligned || !wrapperRef.current) return;
    const node = getTrigger() ?? wrapperRef.current;
    const measure = () => {
      const r = node.getBoundingClientRect();
      setTarget(
        (prev) => prev && prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height }
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [arrow, edgeAligned, getTrigger, place, size]);
  useLightDismiss({
    open: visible,
    rootRef: wrapperRef,
    getTrigger,
    onDismiss: () => setVisible(false),
    outsidePress: false
  });
  const showTooltip = (event) => {
    onMouseEnter?.(event);
    setVisible(true);
  };
  const hideTooltip = (event) => {
    onMouseLeave?.(event);
    setVisible(false);
  };
  const showOnFocus = (event) => {
    onFocus?.(event);
    setVisible(true);
  };
  const hideOnBlur = (event) => {
    onBlur?.(event);
    if (!event.currentTarget.contains(event.relatedTarget)) setVisible(false);
  };
  const validTrigger = React.isValidElement(children) && children.type !== React.Fragment;
  const renderedChildren = validTrigger ? React.cloneElement(children, {
    "data-anchored-overlay-trigger": "",
    "aria-describedby": appendAriaReference(children.props["aria-describedby"], tooltipId)
  }) : children;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      ref: wrapperRef,
      ...rest,
      "data-anchored-overlay-trigger": validTrigger ? void 0 : "",
      "aria-describedby": validTrigger ? void 0 : tooltipId,
      tabIndex: validTrigger ? rest.tabIndex : rest.tabIndex ?? 0,
      style: { position: "relative", display: "inline-flex", ...style },
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showOnFocus,
      onBlur: hideOnBlur,
      children: [
        renderedChildren,
        /* @__PURE__ */ jsxs(
          "span",
          {
            ref: bubbleRef,
            id: tooltipId,
            role: "tooltip",
            "aria-hidden": visible ? false : void 0,
            "data-placement": place,
            style: {
              position: "absolute",
              ...pos,
              ...bubbleOffset(place, align),
              translate: `${floating.shiftX}px ${floating.shiftY}px`,
              zIndex: 40,
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: compact ? 6 : 8,
              padding: compact ? "5px 8px" : "8px 12px",
              background: "var(--color-semantic-inverse-background)",
              color: "var(--color-semantic-inverse-label)",
              fontFamily: "var(--font-sans)",
              fontSize: compact ? 11.5 : "var(--label1-size)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: 0,
              lineHeight: compact ? 1.35 : "var(--label1-line)",
              borderRadius: compact ? 6 : 8,
              boxSizing: "border-box",
              width: "max-content",
              maxWidth: "min(20rem, calc(100vw - var(--space-8)))",
              maxHeight: floating.maxHeight ?? void 0,
              overflowY: "auto",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              boxShadow: "var(--shadow-md)",
              visibility: visible ? "visible" : "hidden",
              opacity: visible ? 1 : 0,
              transition: "opacity var(--dur-fast) var(--ease-out)"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: content }),
              shortcut != null && /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    color: "var(--color-semantic-inverse-label-alternative-soft)",
                    fontWeight: "var(--fw-bold)"
                  },
                  children: shortcut
                }
              ),
              arrow && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    position: "absolute",
                    display: "block",
                    pointerEvents: "none",
                    ...arrowStyle(
                      place,
                      arrowHalf,
                      arrowHeight,
                      normalizedAlign,
                      target,
                      place === "top" || place === "bottom" ? floating.shiftX : floating.shiftY
                    )
                  }
                }
              )
            ]
          }
        )
      ]
    }
  );
}

export {
  Tooltip
};
//# sourceMappingURL=chunk-UUAJNYHQ.js.map