"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/content/Bookmark.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function Bookmark({ active, defaultActive, onChange, size = 24, disabled = false, style, ...rest }) {
  const isControlled = active !== void 0;
  const [internal, setInternal] = React.useState(!!defaultActive);
  const on = isControlled ? active : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      "aria-pressed": on,
      "aria-label": "bookmark",
      disabled,
      onClick: toggle,
      onMouseDown: (e) => {
        e.currentTarget.style.transform = "scale(0.86)";
      },
      onMouseUp: (e) => {
        e.currentTarget.style.transform = "none";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "none";
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        color: on ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-assistive)",
        transition: "color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsx(Icon, { name: on ? "bookmark-fill" : "bookmark", size, "aria-hidden": "true" })
    }
  );
}

export {
  Bookmark
};
//# sourceMappingURL=chunk-YXDB4TAP.js.map