"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/layout/ScrollArea.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function useScrollStyles() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-scrollarea-css")) return;
    const el = document.createElement("style");
    el.id = "lk-scrollarea-css";
    el.textContent = ".lk-scrollarea{scrollbar-width:thin;scrollbar-color:var(--color-semantic-interaction-inactive) transparent;}.lk-scrollarea::-webkit-scrollbar{width:7px;height:7px;}.lk-scrollarea::-webkit-scrollbar-thumb{background:var(--color-semantic-interaction-inactive);border-radius:99px;}.lk-scrollarea::-webkit-scrollbar-thumb:hover{background:var(--color-semantic-label-alternative);}.lk-scrollarea::-webkit-scrollbar-track{background:transparent;}.lk-scrollarea:focus-visible{outline:2px solid var(--color-semantic-focus-indicator);outline-offset:2px;}";
    document.head.appendChild(el);
  }, []);
}
function ScrollArea({
  children,
  maxHeight = 280,
  label,
  labelledBy,
  focusable = "auto",
  style,
  ...rest
}) {
  useScrollStyles();
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
      ref: nodeRef,
      className: "lk-scrollarea",
      role: _nullishCoalesce(rest.role, () => ( (isFocusable && named ? "region" : void 0))),
      "aria-label": _nullishCoalesce(rest["aria-label"], () => ( label)),
      "aria-labelledby": _nullishCoalesce(rest["aria-labelledby"], () => ( labelledBy)),
      tabIndex: _nullishCoalesce(rest.tabIndex, () => ( (isFocusable ? 0 : void 0))),
      style: { maxHeight, overflow: "auto", ...style },
      ...rest,
      children
    }
  );
}



exports.ScrollArea = ScrollArea;
//# sourceMappingURL=chunk-4JC6OVVK.cjs.map