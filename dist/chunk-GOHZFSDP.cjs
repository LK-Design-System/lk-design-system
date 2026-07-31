"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";



var _chunk4KUVQPIKcjs = require('./chunk-4KUVQPIK.cjs');

// components/forms/FormField.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function FormField({ label, required = false, helper, error, htmlFor, children, style, ...rest }) {
  const message = _nullishCoalesce(error, () => ( helper));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { ...rest, style: { display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", minWidth: 0, fontFamily: "var(--font-sans)", ...style }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk4KUVQPIKcjs.FieldLabel, { htmlFor, label, required }),
    children,
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk4KUVQPIKcjs.FieldMessage, { message, error })
  ] });
}



exports.FormField = FormField;
//# sourceMappingURL=chunk-GOHZFSDP.cjs.map