"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/Grid.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Grid({ children, columns, minItemWidth, gap = 20, style, ...rest }) {
  const template = minItemWidth ? `repeat(auto-fill, minmax(${typeof minItemWidth === "number" ? minItemWidth + "px" : minItemWidth}, 1fr))` : columns ? `repeat(${columns}, minmax(0, 1fr))` : void 0;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "grid", gridTemplateColumns: template, gap, ...style }, ...rest, children });
}



exports.Grid = Grid;
//# sourceMappingURL=chunk-UNLYFQMZ.cjs.map