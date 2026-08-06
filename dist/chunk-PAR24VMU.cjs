"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/ExpandableText.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function ExpandableText({
  children,
  lines = 3,
  moreLabel = "\uB354 \uBCF4\uAE30",
  lessLabel = "\uC811\uAE30",
  expanded: controlledExpanded,
  defaultExpanded = false,
  onToggle,
  as: Tag = "div",
  style,
  textStyle,
  ...rest
}) {
  const isControlled = controlledExpanded !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultExpanded);
  const expanded = isControlled ? controlledExpanded : internal;
  const textRef = _react2.default.useRef(null);
  const [overflowing, setOverflowing] = _react2.default.useState(false);
  const reactId = _react2.default.useId();
  const regionId = `lk-expandable-${reactId}`;
  useSafeLayoutEffect(() => {
    const el = textRef.current;
    if (!el || typeof window === "undefined") return void 0;
    const measure = () => {
      const cs = window.getComputedStyle(el);
      let lineHeight = parseFloat(cs.lineHeight);
      if (!Number.isFinite(lineHeight)) lineHeight = (parseFloat(cs.fontSize) || 16) * 1.5;
      setOverflowing(el.scrollHeight - lineHeight * lines > 1);
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, lines]);
  const toggle = () => {
    const next = !expanded;
    if (!isControlled) setInternal(next);
    onToggle && onToggle(next);
  };
  const clampStyle = expanded ? null : { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: lines, overflow: "hidden" };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      Tag,
      {
        ref: textRef,
        id: regionId,
        style: {
          margin: 0,
          color: "var(--color-semantic-label-normal)",
          fontSize: "var(--body1-size)",
          lineHeight: "var(--body1-line)",
          whiteSpace: "pre-wrap",
          wordBreak: "keep-all",
          overflowWrap: "anywhere",
          ...clampStyle,
          ...textStyle
        },
        children
      }
    ),
    overflowing && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "button",
      {
        type: "button",
        onClick: toggle,
        "aria-expanded": expanded,
        "aria-controls": regionId,
        style: {
          display: "inline-flex",
          alignItems: "center",
          // Meet the 24px minimum target size (WCAG 2.5.8); the negative left
          // margin keeps the label visually flush with the body text.
          minHeight: 24,
          marginTop: "var(--space-1)",
          marginLeft: "calc(-1 * var(--space-2))",
          padding: "var(--space-1) var(--space-2)",
          border: 0,
          background: "none",
          font: "inherit",
          fontSize: "var(--caption1-size)",
          fontWeight: "var(--fw-bold)",
          color: "var(--color-semantic-label-alternative)",
          cursor: "pointer",
          borderRadius: "var(--radius-sm)"
        },
        children: expanded ? lessLabel : moreLabel
      }
    )
  ] });
}



exports.ExpandableText = ExpandableText;
//# sourceMappingURL=chunk-PAR24VMU.cjs.map