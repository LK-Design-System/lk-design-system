"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkMBKOVB2Kcjs = require('./chunk-MBKOVB2K.cjs');

// components/feedback/Notification.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Notification({
  icon,
  title,
  description,
  time,
  dateTime,
  tone,
  unread = false,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  style,
  ...rest
}) {
  const [hovered, setHovered] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const Root = onClick ? "button" : "div";
  const background = unread ? hovered ? "var(--color-semantic-primary-surface-strong)" : "var(--component-notification-unread-surface)" : hovered ? "var(--color-semantic-fill-alternative)" : "transparent";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    Root,
    {
      ...rest,
      ...onClick ? { type: "button" } : {},
      onClick,
      onFocus: (event) => {
        setFocused(true);
        onFocus && onFocus(event);
      },
      onBlur: (event) => {
        setFocused(false);
        onBlur && onBlur(event);
      },
      onMouseEnter: (event) => {
        if (onClick) setHovered(true);
        onMouseEnter && onMouseEnter(event);
      },
      onMouseLeave: (event) => {
        setHovered(false);
        onMouseLeave && onMouseLeave(event);
      },
      style: {
        display: "grid",
        gridTemplateColumns: icon != null ? "36px minmax(0, 1fr)" : "minmax(0, 1fr)",
        alignItems: "start",
        columnGap: "var(--space-3)",
        width: "100%",
        minWidth: 0,
        padding: "var(--space-3) var(--space-4)",
        boxSizing: "border-box",
        border: "none",
        borderRadius: "inherit",
        appearance: "none",
        cursor: onClick ? "pointer" : "default",
        textAlign: "start",
        background,
        boxShadow: focused ? "inset 0 0 0 2px var(--color-semantic-focus-indicator)" : "none",
        color: "inherit",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: {
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: tone ? _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, tone).surface : "var(--color-semantic-fill-normal)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: tone ? _chunkMBKOVB2Kcjs.statusToneStyle.call(void 0, tone).foreground : "var(--color-semantic-label-normal)"
            },
            children: icon
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-3)", minWidth: 0 }, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis", color: "var(--color-semantic-label-normal)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--label1-spacing)" }, children: title }),
              unread && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { role: "img", "aria-label": "\uC77D\uC9C0 \uC54A\uC74C", style: { width: 6, height: 6, borderRadius: "50%", background: "var(--color-semantic-primary-normal)", flexShrink: 0 } })
            ] }),
            time != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "time", { dateTime, style: { flexShrink: 0, color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", letterSpacing: "var(--caption1-spacing)" }, children: time })
          ] }),
          description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { marginTop: "var(--space-1)", overflow: "hidden", textOverflow: "ellipsis", color: "var(--color-semantic-label-neutral)", fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", letterSpacing: "var(--label2-spacing)", wordBreak: "keep-all" }, children: description })
        ] })
      ]
    }
  );
}



exports.Notification = Notification;
//# sourceMappingURL=chunk-OCMANM4D.cjs.map