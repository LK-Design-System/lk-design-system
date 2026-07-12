"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/navigation/Category.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SIZE = {
  small: { height: 24, padding: "0 7px", fontSize: "var(--label2-size)", radius: 6, gap: 4 },
  sm: { height: 24, padding: "0 7px", fontSize: "var(--label2-size)", radius: 6, gap: 4 },
  medium: { height: 32, padding: "0 8px", fontSize: "var(--label1-size)", radius: 8, gap: 6 },
  md: { height: 32, padding: "0 8px", fontSize: "var(--label1-size)", radius: 8, gap: 6 },
  large: { height: 36, padding: "0 11px", fontSize: "var(--body2-size)", radius: 10, gap: 8 },
  lg: { height: 36, padding: "0 11px", fontSize: "var(--body2-size)", radius: 10, gap: 8 },
  xlarge: {
    height: 40,
    padding: "0 12px",
    fontSize: "var(--body2-size)",
    radius: 10,
    gap: 10
  },
  xl: {
    height: 40,
    padding: "0 12px",
    fontSize: "var(--body2-size)",
    radius: 10,
    gap: 10
  }
};
function normalizeItem(item) {
  return typeof item === "string" ? { value: item, label: item } : item;
}
function Category({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = "normal",
  size = "medium",
  padding = false,
  verticalPadding = false,
  scroll = "auto",
  style,
  itemStyle,
  ...rest
}) {
  const normalized = items.map(normalizeItem);
  const initial = _nullishCoalesce(_nullishCoalesce(defaultValue, () => ( _optionalChain([normalized, 'access', _ => _.find, 'call', _2 => _2((item) => item.active), 'optionalAccess', _3 => _3.value]))), () => ( _optionalChain([normalized, 'access', _4 => _4[0], 'optionalAccess', _5 => _5.value])));
  const controlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(initial);
  const selected = controlled ? value : internal;
  const s = SIZE[size] || SIZE.medium;
  const alternative = variant === "alternative";
  const pick = (item) => {
    if (item.disabled) return;
    if (!controlled) setInternal(item.value);
    _optionalChain([onChange, 'optionalCall', _6 => _6(item.value, item)]);
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: s.gap,
        maxWidth: "100%",
        overflowX: scroll === "auto" || scroll === true ? "auto" : "visible",
        paddingInline: padding ? 20 : 0,
        paddingBlock: verticalPadding ? 8 : 0,
        scrollbarWidth: "none",
        ...style
      },
      ...rest,
      children: normalized.map((item) => {
        const active = item.value === selected || item.active;
        const colors = alternative ? {
          bg: active ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)",
          fg: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
          border: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"
        } : {
          bg: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-background-elevated-normal)",
          fg: active ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-neutral)",
          border: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-line-solid-normal)"
        };
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "button",
          {
            type: "button",
            "aria-pressed": active,
            disabled: item.disabled,
            onClick: () => pick(item),
            style: {
              flex: "0 0 auto",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: s.height,
              padding: s.padding,
              border: `1px solid ${colors.border}`,
              borderRadius: s.radius,
              background: colors.bg,
              color: colors.fg,
              fontFamily: "var(--font-sans)",
              fontSize: s.fontSize,
              fontWeight: "var(--fw-medium)",
              letterSpacing: 0,
              whiteSpace: "nowrap",
              cursor: item.disabled ? "not-allowed" : "pointer",
              opacity: item.disabled ? 0.45 : 1,
              transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
              ...itemStyle,
              ...item.style
            },
            children: item.label
          },
          item.value
        );
      })
    }
  );
}



exports.Category = Category;
//# sourceMappingURL=chunk-5B24XA7O.cjs.map