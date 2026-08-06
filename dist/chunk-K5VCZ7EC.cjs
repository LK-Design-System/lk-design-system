"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/layout/ScrollArea.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
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
  const nodeRef = _react2.default.useRef(null);
  const [overflows, setOverflows] = _react2.default.useState(false);
  _react2.default.useEffect(() => {
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
  _react2.default.useEffect(() => {
    if (!isFocusable || named || rest.role != null) return;
    const env = typeof globalThis.process !== "undefined" ? globalThis.process.env : void 0;
    if (env && env.NODE_ENV === "production") return;
    console.warn(
      "ScrollArea: a scrollable region is keyboard focusable and needs an accessible name \u2014 pass `label` (or `labelledBy`)."
    );
  }, [isFocusable, named, rest.role]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      ...rest,
      ref: nodeRef,
      className: ["lk-scroll-surface", "lk-scrollarea", className].filter(Boolean).join(" "),
      "data-scrollbar": scrollbar,
      "data-scroll-gutter": gutter,
      role: _nullishCoalesce(rest.role, () => ( (isFocusable && named ? "region" : void 0))),
      "aria-label": _nullishCoalesce(rest["aria-label"], () => ( label)),
      "aria-labelledby": _nullishCoalesce(rest["aria-labelledby"], () => ( labelledBy)),
      tabIndex: _nullishCoalesce(rest.tabIndex, () => ( (isFocusable ? 0 : void 0))),
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



exports.ScrollArea = ScrollArea;
//# sourceMappingURL=chunk-K5VCZ7EC.cjs.map