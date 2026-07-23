"use client";
import {
  normalizeStatusTone,
  statusToneStyle
} from "./chunk-WXLIZEH2.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/status/Callout.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ICON_SIZE = 20;
function normalizeIcon(icon, fallbackIcon) {
  if (!React.isValidElement(icon)) return fallbackIcon;
  return React.cloneElement(icon, {
    size: icon.props.size ?? ICON_SIZE,
    width: icon.props.width ?? ICON_SIZE,
    height: icon.props.height ?? ICON_SIZE,
    style: { display: "block", ...icon.props.style }
  });
}
function Callout({ tone = "signal", title, children, icon, style, ...rest }) {
  const normalizedTone = tone === "navy" ? "offline" : normalizeStatusTone(tone);
  const palette = statusToneStyle(normalizedTone);
  const c = palette.foreground;
  const defaultIcon = /* @__PURE__ */ jsx(Icon, { name: palette.icon, size: ICON_SIZE });
  const normalizedIcon = normalizeIcon(icon, defaultIcon);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        gap: 14,
        padding: "16px 18px",
        boxSizing: "border-box",
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: "var(--radius-lg)",
        boxShadow: "none",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            style: {
              width: ICON_SIZE,
              height: ICON_SIZE,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: c,
              lineHeight: 0,
              flexShrink: 0,
              marginTop: 1
            },
            children: normalizedIcon
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)", marginBottom: children != null ? 4 : 0 }, children: title }),
          children != null && /* @__PURE__ */ jsx("div", { style: { fontSize: "var(--label1-size)", lineHeight: 1.65, color: "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children })
        ] })
      ]
    }
  );
}

export {
  Callout
};
//# sourceMappingURL=chunk-YDRFWQRL.js.map