"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/content/Divider.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Divider({
  vertical = false,
  label,
  inset = 0,
  variant = "normal",
  decorative = false,
  style,
  ...rest
}) {
  const thickness = variant === "thick" ? "var(--component-divider-thickness-thick)" : "var(--component-divider-thickness-normal)";
  const color = variant === "thick" ? "var(--component-divider-color-thick)" : "var(--component-divider-color-normal)";
  const decorativeProps = { role: "none", "aria-hidden": "true" };
  const semantics = decorative ? decorativeProps : null;
  const verticalSemantics = decorative ? decorativeProps : { role: "separator", "aria-orientation": "vertical" };
  if (vertical) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "span",
      {
        ...verticalSemantics,
        style: {
          display: "inline-block",
          width: thickness,
          alignSelf: "stretch",
          minHeight: 32,
          background: color,
          ...style
        },
        ...rest
      }
    );
  }
  if (label != null) {
    const rule = { flex: 1, height: thickness, background: color };
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "div",
      {
        ...decorative ? decorativeProps : {
          role: "separator",
          /* separator gets no name from its contents — expose the visible
             label explicitly so "또는" is announced, not just a boundary. */
          "aria-label": typeof label === "string" ? label : void 0
        },
        style: { display: "flex", alignItems: "center", gap: 14, ...style },
        ...rest,
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: rule }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "span",
            {
              style: {
                fontFamily: "var(--font-sans)",
                fontSize: "var(--label2-size)",
                fontWeight: "var(--fw-semibold)",
                letterSpacing: 0,
                color: "var(--color-semantic-label-alternative)",
                whiteSpace: "nowrap"
              },
              children: label
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: rule })
        ]
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "hr",
    {
      ...semantics,
      style: {
        border: "none",
        height: thickness,
        background: color,
        margin: `0 ${inset}px`,
        ...style
      },
      ...rest
    }
  );
}



exports.Divider = Divider;
//# sourceMappingURL=chunk-OW3QSDFC.cjs.map