"use client";
import {
  Icon
} from "./chunk-IKUN5X7H.js";

// components/layout/DockPanel.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : "true";
var inertWhen = (isInert) => isInert ? INERT_VALUE : void 0;
var DEFAULT_WIDTH = 300;
var DEFAULT_MIN_WIDTH = 240;
var DEFAULT_MAX_WIDTH = 520;
var DEFAULT_RESIZE_STEP = 16;
function toCssSize(value) {
  return typeof value === "number" ? `${value}px` : value;
}
function toNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function nextOpenValue(value) {
  return !value;
}
function getHandleIcon(side, open) {
  if (side === "left") return open ? "chevron-left" : "chevron-right";
  return open ? "chevron-right" : "chevron-left";
}
function getResizeDelta(key, side, step) {
  if (key === "ArrowLeft") return side === "left" ? -step : step;
  if (key === "ArrowRight") return side === "left" ? step : -step;
  return 0;
}
function DockPanel({
  side = "right",
  open,
  defaultOpen = true,
  onOpenChange,
  title,
  width = DEFAULT_WIDTH,
  minWidth = DEFAULT_MIN_WIDTH,
  maxWidth = DEFAULT_MAX_WIDTH,
  resizeStep = DEFAULT_RESIZE_STEP,
  resizable = false,
  onWidthChange,
  closeOnEscape = true,
  bodyPadding = "var(--space-4)",
  footer,
  children,
  style,
  bodyStyle,
  "aria-label": ariaLabel,
  ...rest
}) {
  const controlled = open !== void 0;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [resizeFocused, setResizeFocused] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const isOpen = controlled ? open : internalOpen;
  const isLeft = side === "left";
  const panelId = React.useId();
  const titleId = `${panelId}-title`;
  const handleRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const numericWidth = toNumber(width);
  const minPanelWidth = toNumber(minWidth) ?? DEFAULT_MIN_WIDTH;
  const maxPanelWidth = Math.max(minPanelWidth, toNumber(maxWidth) ?? DEFAULT_MAX_WIDTH);
  const canResize = Boolean(resizable && numericWidth !== void 0);
  const boundedInitialWidth = clamp(numericWidth ?? DEFAULT_WIDTH, minPanelWidth, maxPanelWidth);
  const [resizedWidth, setResizedWidth] = React.useState(boundedInitialWidth);
  const activeNumericWidth = canResize ? resizedWidth : numericWidth;
  const panelWidth = activeNumericWidth !== void 0 ? `${activeNumericWidth}px` : toCssSize(width);
  const titleText = typeof title === "string" ? title : void 0;
  React.useEffect(() => {
    if (numericWidth === void 0) return;
    setResizedWidth(clamp(numericWidth, minPanelWidth, maxPanelWidth));
  }, [numericWidth, minPanelWidth, maxPanelWidth]);
  const setOpen = (value) => {
    if (!controlled) setInternalOpen(value);
    onOpenChange && onOpenChange(value);
  };
  const focusHandle = () => {
    const run = () => handleRef.current && handleRef.current.focus();
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else setTimeout(run, 0);
  };
  const setPanelWidth = (value) => {
    const nextWidth = clamp(value, minPanelWidth, maxPanelWidth);
    setResizedWidth(nextWidth);
    onWidthChange && onWidthChange(nextWidth);
  };
  const handleResizePointerDown = (event) => {
    if (!canResize || !isOpen || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture && event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: activeNumericWidth
    };
    setIsResizing(true);
  };
  const handleResizePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || activeNumericWidth === void 0) return;
    const delta = event.clientX - drag.startX;
    setPanelWidth(drag.startWidth + (isLeft ? delta : -delta));
  };
  const handleResizePointerEnd = (event) => {
    if (!dragRef.current) return;
    event.currentTarget.releasePointerCapture && event.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    dragRef.current = null;
    setIsResizing(false);
  };
  const collapseOnEscape = (event) => {
    if (event.defaultPrevented || !closeOnEscape || event.key !== "Escape") return false;
    event.stopPropagation();
    setOpen(false);
    focusHandle();
    return true;
  };
  const handleResizeKeyDown = (event) => {
    if (collapseOnEscape(event)) return;
    if (!canResize || activeNumericWidth === void 0) return;
    const step = (event.shiftKey ? resizeStep * 4 : resizeStep) || DEFAULT_RESIZE_STEP;
    if (event.key === "Home") {
      event.preventDefault();
      setPanelWidth(minPanelWidth);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setPanelWidth(maxPanelWidth);
      return;
    }
    const delta = getResizeDelta(event.key, side, step);
    if (delta === 0) return;
    event.preventDefault();
    setPanelWidth(activeNumericWidth + delta);
  };
  const handlePanelKeyDown = (event) => {
    collapseOnEscape(event);
  };
  const panelName = titleText || ariaLabel || "\uB3C4\uD0B9 \uD328\uB110";
  const handleLabel = isOpen ? `${panelName} \uC811\uAE30` : `${panelName} \uD3BC\uCE58\uAE30`;
  const resizeLabel = `${panelName} \uB108\uBE44 \uC870\uC808`;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-side": side,
      "data-state": isOpen ? "open" : "closed",
      "data-resizing": isResizing ? "true" : void 0,
      style: {
        position: "relative",
        height: "100%",
        display: "flex",
        justifyContent: isLeft ? "flex-start" : "flex-end",
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            position: "relative",
            width: isOpen ? panelWidth : 0,
            height: "100%",
            minWidth: 0,
            overflow: "visible",
            transition: isResizing ? "none" : "width var(--dur-normal, 220ms) var(--ease-out)"
          },
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                ref: handleRef,
                type: "button",
                "aria-label": handleLabel,
                title: handleLabel,
                "aria-controls": panelId,
                "aria-expanded": isOpen,
                onClick: () => setOpen(nextOpenValue(isOpen)),
                style: {
                  position: "absolute",
                  top: "var(--space-4)",
                  [isLeft ? "right" : "left"]: -24,
                  width: 24,
                  height: 48,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  border: "1px solid var(--color-semantic-line-normal-normal)",
                  [isLeft ? "borderLeft" : "borderRight"]: "none",
                  borderRadius: isLeft ? "0 var(--radius-sm) var(--radius-sm) 0" : "var(--radius-sm) 0 0 var(--radius-sm)",
                  background: "var(--color-semantic-background-elevated-normal)",
                  color: "var(--color-semantic-label-neutral)",
                  boxSizing: "border-box",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  zIndex: 3,
                  lineHeight: 0
                },
                children: /* @__PURE__ */ jsx(Icon, { name: getHandleIcon(side, isOpen), size: 14, "aria-hidden": "true" })
              }
            ),
            canResize && isOpen && activeNumericWidth !== void 0 && /* @__PURE__ */ jsx(
              "div",
              {
                role: "separator",
                tabIndex: 0,
                "aria-label": resizeLabel,
                "aria-controls": panelId,
                "aria-orientation": "vertical",
                "aria-valuemin": minPanelWidth,
                "aria-valuemax": maxPanelWidth,
                "aria-valuenow": Math.round(activeNumericWidth),
                onPointerDown: handleResizePointerDown,
                onPointerMove: handleResizePointerMove,
                onPointerUp: handleResizePointerEnd,
                onPointerCancel: handleResizePointerEnd,
                onKeyDown: handleResizeKeyDown,
                onFocus: () => setResizeFocused(true),
                onBlur: () => setResizeFocused(false),
                style: {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  [isLeft ? "right" : "left"]: -4,
                  width: 8,
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",
                  touchAction: "none",
                  cursor: "col-resize",
                  zIndex: 2,
                  outline: "none"
                },
                children: /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    style: {
                      width: 1,
                      background: isResizing || resizeFocused ? "var(--color-semantic-primary-normal)" : "transparent",
                      transition: "background var(--dur-fast) var(--ease-out)"
                    }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs(
              "aside",
              {
                id: panelId,
                role: "region",
                hidden: !isOpen,
                inert: inertWhen(!isOpen),
                "aria-hidden": isOpen ? void 0 : true,
                "aria-label": title == null ? ariaLabel || "\uB3C4\uD0B9 \uD328\uB110" : void 0,
                "aria-labelledby": title == null ? void 0 : titleId,
                onKeyDown: handlePanelKeyDown,
                style: {
                  width: panelWidth,
                  height: "100%",
                  minWidth: 0,
                  display: isOpen ? "grid" : "none",
                  gridTemplateRows: [
                    title == null ? null : "auto",
                    "minmax(0, 1fr)",
                    footer == null ? null : "auto"
                  ].filter(Boolean).join(" "),
                  boxSizing: "border-box",
                  overflow: "hidden",
                  background: "var(--color-semantic-background-elevated-normal)",
                  borderLeft: isLeft ? "none" : "1px solid var(--color-semantic-line-normal-normal)",
                  borderRight: isLeft ? "1px solid var(--color-semantic-line-normal-normal)" : "none",
                  boxShadow: "var(--shadow-md)"
                },
                children: [
                  title != null && /* @__PURE__ */ jsx(
                    "header",
                    {
                      style: {
                        minHeight: 48,
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        padding: "0 var(--space-4)",
                        borderBottom: "1px solid var(--color-semantic-line-normal-normal)",
                        boxSizing: "border-box"
                      },
                      children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          id: titleId,
                          style: {
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "var(--label1-size)",
                            lineHeight: "var(--label1-line)",
                            fontWeight: "var(--fw-bold)",
                            color: "var(--color-semantic-label-strong)"
                          },
                          children: title
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        minHeight: 0,
                        overflow: "auto",
                        padding: bodyPadding,
                        boxSizing: "border-box",
                        ...bodyStyle
                      },
                      children
                    }
                  ),
                  footer != null && /* @__PURE__ */ jsx(
                    "footer",
                    {
                      style: {
                        padding: "var(--space-3) var(--space-4)",
                        borderTop: "1px solid var(--color-semantic-line-normal-normal)",
                        boxSizing: "border-box"
                      },
                      children: footer
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}

export {
  DockPanel
};
//# sourceMappingURL=chunk-RHHP4EHP.js.map