"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";

// components/layout/ScrollArea.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function useScrollStyles() {
  _react2.default.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-scrollarea-css")) return;
    const el = document.createElement("style");
    el.id = "lk-scrollarea-css";
    el.textContent = ".lk-scrollarea{scrollbar-width:thin;scrollbar-color:var(--color-semantic-interaction-inactive) transparent;}.lk-scrollarea::-webkit-scrollbar{width:7px;height:7px;}.lk-scrollarea::-webkit-scrollbar-thumb{background:var(--color-semantic-interaction-inactive);border-radius:99px;}.lk-scrollarea::-webkit-scrollbar-thumb:hover{background:var(--color-semantic-label-alternative);}.lk-scrollarea::-webkit-scrollbar-track{background:transparent;}";
    document.head.appendChild(el);
  }, []);
}
function ScrollArea({ children, maxHeight = 280, style, ...rest }) {
  useScrollStyles();
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-scrollarea", style: { maxHeight, overflow: "auto", ...style }, ...rest, children });
}



exports.ScrollArea = ScrollArea;
//# sourceMappingURL=chunk-ZY7UIJZO.cjs.map