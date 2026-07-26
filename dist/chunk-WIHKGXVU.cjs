"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/buttons/Link.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SR_ONLY_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0
};
function Link({ children, href, tone = "signal", underline = "hover", external = false, externalLabel = "\uC0C8 \uCC3D\uC5D0\uC11C \uC5F4\uB9BC", style, onMouseEnter, onMouseLeave, ...rest }) {
  const [hover, setHover] = _react2.default.useState(false);
  const color = tone === "neutral" ? "var(--color-semantic-label-neutral)" : tone === "inherit" ? "inherit" : "var(--color-semantic-primary-normal)";
  const showUnderline = underline === "always" || underline === "hover" && hover;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "a",
    {
      href,
      target: external ? "_blank" : void 0,
      rel: external ? "noopener noreferrer" : void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        color,
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        textDecoration: showUnderline ? "underline" : "none",
        textUnderlineOffset: "2px",
        cursor: href == null ? "default" : "pointer",
        ...style
      },
      ...rest,
      children: [
        children,
        external && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: SR_ONLY_STYLE, children: ` ${externalLabel}` }),
        external && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "external-link", size: 13, "aria-hidden": "true" })
      ]
    }
  );
}



exports.Link = Link;
//# sourceMappingURL=chunk-WIHKGXVU.cjs.map