"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/buttons/ActionArea.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function ActionArea({
  children,
  summary,
  caption,
  sticky = false,
  safeArea = false,
  divider = true,
  compact = false,
  align = "start",
  style,
  ...rest
}) {
  const named = rest["aria-label"] != null || rest["aria-labelledby"] != null;
  const Root = named ? "section" : "div";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    Root,
    {
      className: "lk-action-area",
      style: {
        display: "grid",
        gap: "var(--component-action-area-gap)",
        padding: compact ? "var(--space-3) var(--component-action-area-padding-x)" : "var(--component-action-area-padding-y) var(--component-action-area-padding-x)",
        ...safeArea ? { paddingBottom: "var(--mobile-bottom-action-padding-bottom)" } : {},
        background: "var(--component-action-area-bg)",
        borderTop: divider ? "var(--component-action-area-border)" : "none",
        boxShadow: sticky ? "var(--component-action-area-shadow-sticky)" : "none",
        position: sticky ? "sticky" : void 0,
        bottom: sticky ? 0 : void 0,
        zIndex: sticky ? "var(--component-action-area-z-index)" : void 0,
        ...style
      },
      ...rest,
      children: [
        summary && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            style: {
              display: "grid",
              gap: "var(--space-1)",
              color: "var(--color-semantic-label-normal)"
            },
            children: summary
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            style: {
              display: "flex",
              gap: "var(--space-2)",
              alignItems: "center",
              justifyContent: {
                start: "flex-start",
                end: "flex-end",
                center: "center",
                between: "space-between"
              }[align] || "flex-start",
              flexWrap: "wrap",
              width: "100%"
            },
            children
          }
        ),
        caption && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "p",
          {
            style: {
              margin: 0,
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--label2-size)",
              lineHeight: "var(--label2-line)",
              letterSpacing: "var(--label2-spacing)"
            },
            children: caption
          }
        )
      ]
    }
  );
}



exports.ActionArea = ActionArea;
//# sourceMappingURL=chunk-LRACKP3D.cjs.map