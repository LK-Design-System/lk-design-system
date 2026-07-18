"use client";
import {
  Button
} from "./chunk-7WDUT67E.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/buttons/CopyButton.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function CopyButton({ value, children = "\uBCF5\uC0AC", copiedLabel = "\uBCF5\uC0AC\uB428", size = "md", style, ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
    } catch (e) {
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "flat",
      size,
      onClick: copy,
      style: {
        // Overrides that intentionally diverge from the Button md/sm recipe —
        // kept to avoid any visual change; normalize in a future pass.
        gap: 7,
        height: size === "sm" ? 36 : 44,
        padding: "0 14px",
        borderRadius: "var(--radius-md)",
        fontSize: "var(--label1-size)",
        lineHeight: "normal",
        fontWeight: "var(--fw-bold)",
        letterSpacing: 0,
        color: copied ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-normal)",
        ...copied ? { background: "var(--color-semantic-primary-surface-strong)" } : null,
        ...style
      },
      ...rest,
      children: [
        copied ? /* @__PURE__ */ jsx(Icon, { name: "check", size: 16, "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Icon, { name: "copy", size: 16, "aria-hidden": "true" }),
        copied ? copiedLabel : children
      ]
    }
  );
}

export {
  CopyButton
};
//# sourceMappingURL=chunk-MTDNTUAB.js.map