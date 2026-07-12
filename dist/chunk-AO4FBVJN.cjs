"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/overlay/Dimmer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Dimmer({ open = false, children, onClick, blur = false, style, ...rest }) {
  if (!open) return null;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      onClick,
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--component-dialog-scrim)",
        color: "var(--color-semantic-inverse-label)",
        backdropFilter: blur ? "blur(var(--component-dialog-scrim-blur))" : "none",
        borderRadius: "inherit",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "span",
        {
          "data-dimmer-content": "",
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-semantic-inverse-background)",
            color: "var(--color-semantic-inverse-label)",
            boxShadow: "var(--shadow-sm)"
          },
          children
        }
      )
    }
  );
}



exports.Dimmer = Dimmer;
//# sourceMappingURL=chunk-AO4FBVJN.cjs.map