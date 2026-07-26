"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/navigation/NavRail.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function NavRail({ items = [], value, defaultValue, onChange, renderLink, style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue != null ? defaultValue : items[0] && items[0].value);
  const [hoveredValue, setHoveredValue] = _react2.default.useState(null);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "nav", { "aria-label": "\uC8FC \uD0D0\uC0C9", style: { display: "inline-flex", flexDirection: "column", width: "fit-content", maxWidth: "100%", boxSizing: "border-box", gap: "var(--space-1-5)", padding: "var(--space-2-5)", background: "var(--color-semantic-background-elevated-normal)", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-xl)", ...style }, ...rest, children: items.map((o) => {
    const active = o.value === val;
    const disabled = !!o.disabled;
    const accessibleLabel = o.ariaLabel || (typeof o.label === "string" ? o.label : void 0);
    const content = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
      o.icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { display: "inline-flex", flexShrink: 0 }, children: o.icon }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: "100%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)" }, children: o.label })
    ] });
    const itemStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-1-5)",
      width: 68,
      height: 60,
      padding: 0,
      boxSizing: "border-box",
      border: "none",
      borderRadius: "var(--radius-lg)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      textDecoration: "none",
      textAlign: "center",
      background: active ? "var(--color-semantic-primary-surface-strong)" : hoveredValue === o.value && !disabled ? "var(--color-semantic-primary-surface-normal)" : "transparent",
      color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
    };
    const activate = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      pick(o.value);
      _optionalChain([o, 'access', _ => _.onClick, 'optionalCall', _2 => _2(event)]);
    };
    if (o.href != null) {
      const linkProps = {
        href: disabled ? void 0 : o.href,
        target: o.target,
        rel: o.rel,
        "aria-label": o.ariaLabel,
        "aria-current": active ? "page" : void 0,
        "aria-disabled": disabled || void 0,
        tabIndex: disabled ? -1 : void 0,
        title: accessibleLabel,
        onClick: activate,
        onMouseEnter: () => setHoveredValue(o.value),
        onMouseLeave: () => setHoveredValue(null),
        style: itemStyle,
        children: content
      };
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react2.default.Fragment, { children: renderLink ? renderLink(o, linkProps) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { ...linkProps }) }, o.value);
    }
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": o.ariaLabel, "aria-current": active ? "page" : void 0, disabled, onClick: activate, onMouseEnter: () => setHoveredValue(o.value), onMouseLeave: () => setHoveredValue(null), title: accessibleLabel, style: itemStyle, children: content }, o.value);
  }) });
}



exports.NavRail = NavRail;
//# sourceMappingURL=chunk-3LOS2K63.cjs.map