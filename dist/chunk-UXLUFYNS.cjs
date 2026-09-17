"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');

// components/content/MissingValue.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function MissingValue({ label = "\uAC12 \uC5C6\uC74C", style, ...rest }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      style: { color: "var(--color-semantic-label-alternative)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", children: "\u2014" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { children: label })
      ]
    }
  );
}



exports.MissingValue = MissingValue;
//# sourceMappingURL=chunk-UXLUFYNS.cjs.map