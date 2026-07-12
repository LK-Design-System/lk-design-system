"use client";
import {
  pillChipStyle
} from "./chunk-GMV5EXWK.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/selection/FilterChip.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function FilterChip({
  children,
  active = false,
  count,
  caret = false,
  disabled = false,
  size = "md",
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      "aria-pressed": active,
      disabled,
      onClick: disabled ? void 0 : onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        ...pillChipStyle(active, disabled, size),
        gap: size === "sm" ? 6 : 7,
        ...!active && hover && !disabled ? { background: "var(--color-semantic-fill-normal)" } : null,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { children }),
        count != null && /* @__PURE__ */ jsx("span", { style: { fontWeight: "var(--fw-bold)", color: active ? "var(--color-semantic-primary-heavy)" : "var(--color-semantic-label-alternative)" }, children: count }),
        caret && /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: 14, "aria-hidden": "true" })
      ]
    }
  );
}

export {
  FilterChip
};
//# sourceMappingURL=chunk-HAZT2Y6F.js.map