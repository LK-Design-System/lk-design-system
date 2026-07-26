"use client";

// components/layout/ScrollArea.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function ScrollArea({
  children,
  maxHeight = 280,
  label,
  labelledBy,
  focusable = "auto",
  scrollbar = "auto",
  gutter = "stable",
  className,
  style,
  ...rest
}) {
  const nodeRef = React.useRef(null);
  const [overflows, setOverflows] = React.useState(false);
  React.useEffect(() => {
    if (focusable !== "auto") return void 0;
    const node = nodeRef.current;
    if (!node) return void 0;
    const measure = () => {
      const next = node.scrollHeight - node.clientHeight > 1 || node.scrollWidth - node.clientWidth > 1;
      setOverflows((prev) => prev === next ? prev : next);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return void 0;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    for (const child of Array.from(node.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [focusable, children, maxHeight]);
  const isFocusable = focusable === "auto" ? overflows : !!focusable;
  const named = label != null || labelledBy != null || rest["aria-label"] != null || rest["aria-labelledby"] != null;
  React.useEffect(() => {
    if (!isFocusable || named || rest.role != null) return;
    const env = typeof globalThis.process !== "undefined" ? globalThis.process.env : void 0;
    if (env && env.NODE_ENV === "production") return;
    console.warn(
      "ScrollArea: a scrollable region is keyboard focusable and needs an accessible name \u2014 pass `label` (or `labelledBy`)."
    );
  }, [isFocusable, named, rest.role]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...rest,
      ref: nodeRef,
      className: ["lk-scroll-surface", "lk-scrollarea", className].filter(Boolean).join(" "),
      "data-scrollbar": scrollbar,
      "data-scroll-gutter": gutter,
      role: rest.role ?? (isFocusable && named ? "region" : void 0),
      "aria-label": rest["aria-label"] ?? label,
      "aria-labelledby": rest["aria-labelledby"] ?? labelledBy,
      tabIndex: rest.tabIndex ?? (isFocusable ? 0 : void 0),
      style: {
        maxHeight,
        overflow: "auto",
        scrollbarGutter: gutter === "stable" ? "stable" : "auto",
        ...style
      },
      children
    }
  );
}

export {
  ScrollArea
};
//# sourceMappingURL=chunk-IWXB4YKK.js.map