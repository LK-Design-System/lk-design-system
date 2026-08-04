"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');

// components/feedback/PushBadge.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function defaultCountLabel(count, max) {
  return count > max ? `\uC77D\uC9C0 \uC54A\uC74C ${max}\uAC74 \uC774\uC0C1` : `\uC77D\uC9C0 \uC54A\uC74C ${count}\uAC74`;
}
function withFoldedName(children, extra) {
  if (!extra || !_react2.default.isValidElement(children)) return null;
  const props = children.props || {};
  if (typeof props["aria-label"] === "string" && props["aria-label"]) {
    return _react2.default.cloneElement(children, { "aria-label": `${props["aria-label"]} ${extra}` });
  }
  if (typeof props.label === "string" && props.label) {
    return _react2.default.cloneElement(children, { label: `${props.label} ${extra}` });
  }
  return null;
}
function PushBadge({ children, count, dot = false, max = 99, tone = "negative", label, style, ...rest }) {
  const c = tone === "signal" ? "var(--color-semantic-primary-normal)" : tone === "navy" ? "var(--color-semantic-brand-surface)" : "var(--color-semantic-status-negative-text)";
  const show = dot || count != null && count > 0;
  const visualLabel = count > max ? `${max}+` : count;
  const accessibleLabel = label !== void 0 ? label : !dot && show ? defaultCountLabel(count, max) : null;
  const announce = show && accessibleLabel != null && accessibleLabel !== false && accessibleLabel !== "";
  const folded = announce ? withFoldedName(children, accessibleLabel) : null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { position: "relative", display: "inline-flex", ...style }, ...rest, children: [
    _nullishCoalesce(folded, () => ( children)),
    announce && folded == null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { children: accessibleLabel }),
    show && (dot ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { position: "absolute", top: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: c, border: "2px solid var(--color-semantic-background-elevated-normal)", boxSizing: "content-box" } }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { position: "absolute", top: -7, right: -9, minWidth: 18, height: 18, padding: "0 5px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: c, color: "var(--color-semantic-static-white)", borderRadius: "var(--radius-pill)", border: "2px solid var(--color-semantic-background-elevated-normal)", boxSizing: "content-box", fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }, children: visualLabel }))
  ] });
}



exports.PushBadge = PushBadge;
//# sourceMappingURL=chunk-UBIYI4D5.cjs.map