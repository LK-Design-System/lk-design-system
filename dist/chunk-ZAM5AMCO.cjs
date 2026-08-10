"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/internal/component-density.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var ComponentDensityContext = _react2.default.createContext(void 0);
function ComponentDensityScope({ density, children }) {
  return _react2.default.createElement(ComponentDensityContext.Provider, { value: density }, children);
}
function useResolvedDensity(explicitDensity, fallback = "comfortable") {
  const inheritedDensity = _react2.default.useContext(ComponentDensityContext);
  return _nullishCoalesce(_nullishCoalesce(explicitDensity, () => ( inheritedDensity)), () => ( fallback));
}
function useResolvedControlSize(explicitSize, fallback = "md") {
  const density = useResolvedDensity(void 0, "comfortable");
  return _nullishCoalesce(explicitSize, () => ( (density === "compact" ? "sm" : fallback)));
}





exports.ComponentDensityScope = ComponentDensityScope; exports.useResolvedDensity = useResolvedDensity; exports.useResolvedControlSize = useResolvedControlSize;
//# sourceMappingURL=chunk-ZAM5AMCO.cjs.map