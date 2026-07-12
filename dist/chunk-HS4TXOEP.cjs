"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/buttons/Link.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Link({ children, href, tone = "signal", underline = "hover", external = false, style, onMouseEnter, onMouseLeave, ...rest }) {
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
        gap: 3,
        color,
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        textDecoration: showUnderline ? "underline" : "none",
        textUnderlineOffset: "2px",
        cursor: "pointer",
        ...style
      },
      ...rest,
      children: [
        children,
        external && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "external-link", size: 13, "aria-hidden": "true" })
      ]
    }
  );
}



exports.Link = Link;
//# sourceMappingURL=chunk-HS4TXOEP.cjs.map