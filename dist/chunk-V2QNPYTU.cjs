"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Kbd.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Kbd({ children, style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "kbd",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 22,
        height: 22,
        padding: "0 6px",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-bold)",
        color: "var(--color-semantic-label-neutral)",
        background: "var(--color-semantic-background-elevated-normal)",
        borderColor: "var(--color-semantic-line-normal-normal)",
        borderStyle: "solid",
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRadius: "var(--radius-sm)",
        lineHeight: 1,
        ...style
      },
      ...rest,
      children
    }
  );
}



exports.Kbd = Kbd;
//# sourceMappingURL=chunk-V2QNPYTU.cjs.map