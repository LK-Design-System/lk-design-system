"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Section.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var toLen = (v) => typeof v === "number" ? v + "px" : v;
var SURFACES = {
  subtle: "var(--color-semantic-background-normal-alternative)",
  band: "var(--color-semantic-background-normal-alternative)",
  raised: "var(--color-semantic-background-elevated-normal)",
  inverse: "var(--color-semantic-inverse-background)"
};
function Section({ children, surface, py, container = true, innerStyle, style, ...rest }) {
  const outer = {
    background: surface ? SURFACES[surface] : void 0,
    color: surface === "inverse" ? "var(--color-semantic-inverse-label)" : void 0,
    ...py != null ? { "--section-py": toLen(py) } : {},
    ...style
  };
  const inner = container ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-container-fluid", style: innerStyle, children }) : children;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "section", { className: "lk-section", style: outer, ...rest, children: inner });
}



exports.Section = Section;
//# sourceMappingURL=chunk-2RW7NKW2.cjs.map