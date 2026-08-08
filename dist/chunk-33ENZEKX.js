"use client";
import {
  pillChipStyle
} from "./chunk-ULXPFTSH.js";
import {
  Icon
} from "./chunk-B3OCRDVS.js";

// components/selection/MultiSelectChip.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function MultiSelectChip({
  children,
  selected,
  defaultSelected,
  onChange,
  disabled = false,
  size = "md",
  style,
  ...rest
}) {
  const isControlled = selected !== void 0;
  const [internal, setInternal] = React.useState(!!defaultSelected);
  const on = isControlled ? selected : internal;
  const sm = size === "sm";
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      "aria-pressed": on,
      disabled,
      onClick: toggle,
      style: {
        ...pillChipStyle(on, disabled, size),
        gap: "var(--space-1-5)",
        padding: on ? sm ? "0 12px 0 9px" : "0 12px 0 8px" : sm ? "0 12px" : "0 12px",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), padding var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        on && /* @__PURE__ */ jsx(Icon, { name: "check", size: 15, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { children })
      ]
    }
  );
}

export {
  MultiSelectChip
};
//# sourceMappingURL=chunk-33ENZEKX.js.map