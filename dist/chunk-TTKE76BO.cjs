"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkQV6BZEQ3cjs = require('./chunk-QV6BZEQ3.cjs');

// components/feedback/AvatarGroup.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var AVATAR_GROUP_SIZES = {
  xsmall: 24,
  default: 32,
  small: 40
};
function resolveGroupSize(size) {
  return typeof size === "number" ? size : AVATAR_GROUP_SIZES[size] || AVATAR_GROUP_SIZES.default;
}
function AvatarGroup({
  items = [],
  max = 4,
  size = "default",
  variant = "person",
  placeholder = "initials",
  trailingContent = false,
  trailingLabel,
  role,
  style,
  ...rest
}) {
  const named = rest["aria-label"] != null || rest["aria-labelledby"] != null;
  const resolvedRole = _nullishCoalesce(role, () => ( (named ? "group" : void 0)));
  const resolvedSize = resolveGroupSize(size);
  const shown = items.slice(0, max);
  const extra = Math.max(0, items.length - shown.length);
  const overlap = -8;
  const base = {
    width: resolvedSize,
    height: resolvedSize,
    borderRadius: "50%",
    border: "1.5px solid var(--color-semantic-background-elevated-normal)",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    fontFamily: "var(--font-sans)",
    fontSize: Math.round(resolvedSize * 0.36),
    fontWeight: "var(--fw-bold)"
  };
  const renderTrailingContent = () => {
    if (trailingContent === false || trailingContent == null) return null;
    if (_react2.default.isValidElement(trailingContent)) return trailingContent;
    const label = trailingContent === true ? _nullishCoalesce(trailingLabel, () => ( `\uC678 ${extra}\uBA85`)) : trailingContent;
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "span",
      {
        style: {
          minHeight: Math.max(24, Math.round(resolvedSize * 0.72)),
          paddingInline: "var(--space-2)",
          borderRadius: "var(--radius-pill)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-semantic-background-normal-alternative)",
          color: "var(--color-semantic-label-alternative)",
          fontSize: "var(--caption1-size)",
          fontWeight: "var(--fw-semibold)",
          whiteSpace: "nowrap"
        },
        children: label
      }
    );
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: resolvedRole,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: trailingContent ? "var(--space-2)" : 0,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center" }, children: [
          shown.map((it, i) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkQV6BZEQ3cjs.Avatar,
            {
              src: it.src,
              name: it.name,
              alt: it.alt,
              status: it.status,
              variant: _nullishCoalesce(it.variant, () => ( variant)),
              placeholder: _nullishCoalesce(it.placeholder, () => ( placeholder)),
              deactivated: it.deactivated,
              interaction: it.interaction,
              pushBadge: it.pushBadge,
              size: resolvedSize,
              borderColor: "var(--color-semantic-background-elevated-normal)",
              borderWeight: 1.5,
              title: it.name,
              style: {
                marginLeft: i ? overlap : 0,
                zIndex: i
              }
            },
            i
          )),
          extra > 0 && !trailingContent && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            "span",
            {
              style: {
                ...base,
                marginLeft: overlap,
                background: "var(--color-semantic-inverse-background)",
                color: "var(--color-semantic-inverse-label)",
                zIndex: shown.length
              },
              children: [
                "+",
                extra
              ]
            }
          )
        ] }),
        renderTrailingContent()
      ]
    }
  );
}



exports.AvatarGroup = AvatarGroup;
//# sourceMappingURL=chunk-TTKE76BO.cjs.map