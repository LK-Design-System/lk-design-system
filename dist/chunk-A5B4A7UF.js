"use client";
import {
  componentVars,
  partClassName,
  partStyle,
  useMergedRefs
} from "./chunk-A2U7YIGP.js";
import {
  appendAriaReference,
  findOverlayTrigger,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss
} from "./chunk-ZAPKTAQH.js";
import {
  OverlayPortal
} from "./chunk-7MEK4Y6F.js";

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
function arrowAxisPosition(normalizedAlign, target, axis, floatingShift = 0, bubble = null, radius = 0, arrowHalf = 0) {
  const size = target ? axis === "x" ? target.w : target.h : null;
  const bubbleSize = bubble ? axis === "x" ? bubble.w : bubble.h : null;
  const isStart = START_ALIGNS.has(normalizedAlign);
  const isEnd = END_ALIGNS.has(normalizedAlign);
  if (bubbleSize == null) return null;
  let fromStart;
  if (size == null || !isStart && !isEnd) fromStart = bubbleSize / 2 - floatingShift;
  else if (isStart) fromStart = size / 2 - floatingShift;
  else fromStart = bubbleSize - (size / 2 + floatingShift);
  const edgeMin = arrowHalf;
  const edgeMax = bubbleSize - arrowHalf;
  const cornerMin = radius + arrowHalf;
  const cornerMax = bubbleSize - radius - arrowHalf;
  const cornerBoundIsUsable = cornerMax - cornerMin >= arrowHalf;
  const min = cornerBoundIsUsable ? cornerMin : edgeMin;
  const max = cornerBoundIsUsable ? cornerMax : edgeMax;
  return min > max ? bubbleSize / 2 : Math.min(Math.max(fromStart, min), max);
}
function roundedBubblePath(placement, width, height, radius, arrowPosition, arrowHalf, arrowHeight) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const hasArrow = arrowPosition != null && arrowHalf > 0 && arrowHeight > 0;
  const topArrow = hasArrow && placement === "bottom";
  const rightArrow = hasArrow && placement === "left";
  const bottomArrow = hasArrow && placement === "top";
  const leftArrow = hasArrow && placement === "right";
  const c = arrowPosition ?? 0;
  const commands = [`M ${r} 0`];
  if (topArrow) {
    commands.push(`H ${c - arrowHalf}`, `L ${c} ${-arrowHeight}`, `L ${c + arrowHalf} 0`);
  }
  commands.push(`H ${width - r}`, `Q ${width} 0 ${width} ${r}`);
  if (rightArrow) {
    commands.push(
      `V ${c - arrowHalf}`,
      `L ${width + arrowHeight} ${c}`,
      `L ${width} ${c + arrowHalf}`
    );
  }
  commands.push(`V ${height - r}`, `Q ${width} ${height} ${width - r} ${height}`);
  if (bottomArrow) {
    commands.push(
      `H ${c + arrowHalf}`,
      `L ${c} ${height + arrowHeight}`,
      `L ${c - arrowHalf} ${height}`
    );
  }
  commands.push(`H ${r}`, `Q 0 ${height} 0 ${height - r}`);
  if (leftArrow) {
    commands.push(`V ${c + arrowHalf}`, `L ${-arrowHeight} ${c}`, `L 0 ${c - arrowHalf}`);
  }
  commands.push(`V ${r}`, `Q 0 0 ${r} 0`, "Z");
  return commands.join(" ");
}
var DEFAULT_DELAY = { open: 250, close: 0 };
function normalizeDelay(delay) {
  if (delay == null) return DEFAULT_DELAY;
  if (typeof delay === "number") return { open: delay, close: 0 };
  return {
    open: delay.open ?? DEFAULT_DELAY.open,
    close: delay.close ?? DEFAULT_DELAY.close
  };
}
var Tooltip = React.forwardRef(function Tooltip2({
  content,
  placement,
  position,
  size = "medium",
  align = "center",
  shortcut,
  arrow = true,
  delay,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  withinPortal = true,
  portalTarget,
  zIndex,
  className,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const requestedPlace = position || placement || "top";
  const wrapperRef = React.useRef(null);
  const mergedWrapperRef = useMergedRefs(wrapperRef, forwardedRef);
  const bubbleRef = React.useRef(null);
  const tooltipId = React.useId();
  const getTrigger = React.useCallback(() => findOverlayTrigger(wrapperRef.current), []);
  const floating = useFloatingPosition({
    open: visible,
    anchorRef: wrapperRef,
    panelRef: bubbleRef,
    placement: requestedPlace,
    strategy: withinPortal ? "fixed" : "absolute",
    align: normalizeAlign(align)
  });
  const place = floating.placement;
  const pos = POS[place] || POS.top;
  const compact = size === "small" || size === "sm";
  const arrowHalf = compact ? 5 : 6;
  const arrowHeight = compact ? 5 : 6;
  const normalizedAlign = normalizeAlign(align);
  const bubbleVerticalPadding = compact ? 10 : 16;
  const contentMaxHeight = floating.maxHeight != null ? Math.max(0, floating.maxHeight - bubbleVerticalPadding) : void 0;
  const bubbleRadius = compact ? 6 : 8;
  const [target, setTarget] = React.useState(null);
  const [bubbleBox, setBubbleBox] = React.useState(null);
  const edgeAligned = START_ALIGNS.has(normalizedAlign) || END_ALIGNS.has(normalizedAlign);
  React.useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const node = getTrigger() ?? wrapperRef.current;
    const sameBox = (prev, r) => prev && prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height };
    const measure = () => {
      if (arrow && edgeAligned) setTarget((prev) => sameBox(prev, node.getBoundingClientRect()));
      const bubbleNode = bubbleRef.current;
      if (bubbleNode) setBubbleBox((prev) => sameBox(prev, bubbleNode.getBoundingClientRect()));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (arrow && edgeAligned) ro.observe(node);
    if (bubbleRef.current) ro.observe(bubbleRef.current);
    return () => ro.disconnect();
  }, [arrow, content, edgeAligned, getTrigger, place, shortcut, size, visible]);
  const arrowPosition = arrow ? arrowAxisPosition(
    normalizedAlign,
    target,
    place === "top" || place === "bottom" ? "x" : "y",
    place === "top" || place === "bottom" ? floating.shiftX : floating.shiftY,
    bubbleBox,
    bubbleRadius,
    arrowHalf
  ) : null;
  const bubblePath = bubbleBox ? roundedBubblePath(
    place,
    bubbleBox.w,
    bubbleBox.h,
    bubbleRadius,
    arrowPosition,
    arrowHalf,
    arrowHeight
  ) : null;
  const delays = normalizeDelay(delay);
  const timerRef = React.useRef(null);
  const clearTimer = React.useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  React.useEffect(() => clearTimer, [clearTimer]);
  const schedule = React.useCallback(
    (next, ms) => {
      clearTimer();
      if (!ms) {
        setVisible(next);
        return;
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setVisible(next);
      }, ms);
    },
    [clearTimer, setVisible]
  );
  const layer = useLightDismiss({
    open: visible,
    rootRef: wrapperRef,
    getTrigger,
    onDismiss: () => {
      clearTimer();
      setVisible(false);
    },
    outsidePress: false,
    insideRefs: [bubbleRef],
    zIndex
  });
  const showTooltip = (event) => {
    onMouseEnter?.(event);
    schedule(true, delays.open);
  };
  const hideTooltip = (event) => {
    onMouseLeave?.(event);
    schedule(false, delays.close);
  };
  const showOnFocus = (event) => {
    onFocus?.(event);
    clearTimer();
    setVisible(true);
  };
  const hideOnBlur = (event) => {
    onBlur?.(event);
    if (!event.currentTarget.contains(event.relatedTarget)) {
      clearTimer();
      setVisible(false);
    }
  };
  const validTrigger = React.isValidElement(children) && children.type !== React.Fragment;
  const renderedChildren = validTrigger ? React.cloneElement(children, {
    "data-anchored-overlay-trigger": "",
    "aria-describedby": appendAriaReference(children.props["aria-describedby"], tooltipId)
  }) : children;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      ref: mergedWrapperRef,
      ...rest,
      "data-slot": "root",
      "data-open": visible ? "true" : void 0,
      className: partClassName(classNames, "root", className) || void 0,
      "data-anchored-overlay-trigger": validTrigger ? void 0 : "",
      "aria-describedby": validTrigger ? void 0 : tooltipId,
      tabIndex: rest.tabIndex,
      style: { ...componentVars(vars, "--lds-tooltip-"), position: "relative", display: "inline-flex", ...partStyle(styles, "root"), ...style },
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showOnFocus,
      onBlur: hideOnBlur,
      children: [
        renderedChildren,
        /* @__PURE__ */ jsx(OverlayPortal, { open: visible, withinPortal, portalTarget, anchorRef: wrapperRef, layer: "anchored", children: /* @__PURE__ */ jsxs(
          "span",
          {
            ref: bubbleRef,
            id: tooltipId,
            "data-slot": "bubble",
            className: partClassName(classNames, "bubble") || void 0,
            role: "tooltip",
            "aria-hidden": visible ? false : void 0,
            "data-placement": place,
            style: {
              ...componentVars(vars, "--lds-tooltip-"),
              position: withinPortal ? "fixed" : "absolute",
              ...withinPortal ? { top: floating.y ?? -9999, left: floating.x ?? -9999 } : pos,
              ...withinPortal ? {} : bubbleOffset(place, align),
              translate: withinPortal ? "none" : `${floating.shiftX}px ${floating.shiftY}px`,
              zIndex: layer.zIndex,
              pointerEvents: "none",
              display: "inline-flex",
              alignItems: "center",
              padding: `var(--lds-tooltip-padding, ${compact ? "5px 8px" : "8px 12px"})`,
              color: "var(--color-semantic-inverse-label)",
              fontFamily: "var(--font-sans)",
              fontSize: compact ? 11.5 : "var(--label1-size)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: 0,
              lineHeight: compact ? 1.35 : "var(--label1-line)",
              borderRadius: compact ? 6 : 8,
              boxSizing: "border-box",
              width: "max-content",
              maxWidth: "var(--lds-tooltip-max-width, min(20rem, calc(100vw - var(--space-8))))",
              overflow: "visible",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              isolation: "isolate",
              boxShadow: "var(--shadow-md)",
              visibility: visible && bubblePath ? "visible" : "hidden",
              opacity: visible ? 1 : 0,
              transition: "opacity var(--dur-fast) var(--ease-out)",
              ...partStyle(styles, "bubble")
            },
            children: [
              bubblePath && /* @__PURE__ */ jsx(
                "svg",
                {
                  "aria-hidden": "true",
                  focusable: "false",
                  "data-lds-tooltip-surface": "",
                  "data-slot": "surface",
                  className: partClassName(classNames, "surface") || void 0,
                  "data-arrow-axis": arrowPosition ?? void 0,
                  "data-arrow-height": arrow ? arrowHeight : void 0,
                  width: bubbleBox.w,
                  height: bubbleBox.h,
                  viewBox: `0 0 ${bubbleBox.w} ${bubbleBox.h}`,
                  preserveAspectRatio: "none",
                  style: {
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    overflow: "visible",
                    pointerEvents: "none",
                    ...partStyle(styles, "surface")
                  },
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: bubblePath,
                      style: {
                        fill: "var(--color-semantic-inverse-background)"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  "data-lds-tooltip-content": true,
                  "data-slot": "content",
                  className: partClassName(classNames, "content") || void 0,
                  style: {
                    position: "relative",
                    zIndex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: compact ? 6 : 8,
                    minWidth: 0,
                    maxHeight: contentMaxHeight,
                    overflowY: contentMaxHeight != null ? "auto" : void 0,
                    overflowX: contentMaxHeight != null ? "hidden" : void 0,
                    ...partStyle(styles, "content")
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { children: content }),
                    shortcut != null && /* @__PURE__ */ jsx(
                      "span",
                      {
                        "data-slot": "shortcut",
                        className: partClassName(classNames, "shortcut") || void 0,
                        style: {
                          color: "var(--color-semantic-inverse-label-alternative-soft)",
                          fontWeight: "var(--fw-bold)",
                          ...partStyle(styles, "shortcut")
                        },
                        children: shortcut
                      }
                    )
                  ]
                }
              )
            ]
          }
        ) })
      ]
    }
  );
});

export {
  Tooltip
};
//# sourceMappingURL=chunk-A5B4A7UF.js.map