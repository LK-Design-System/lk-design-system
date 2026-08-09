"use client";
import {
  normalizeStatusTone,
  statusToneStyle
} from "./chunk-L2ZEGNVF.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/status/OverlayStatusChip.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function OverlayStatusChip({
  tone = "neutral",
  icon,
  children,
  style,
  ...rest
}) {
  const normalizedTone = normalizeStatusTone(tone, "offline");
  const palette = statusToneStyle(normalizedTone);
  const neutral = normalizedTone === "offline";
  const glyph = icon ?? palette.icon;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "data-overlay-status-chip": "",
      "data-tone": tone,
      role: "status",
      style: {
        position: "absolute",
        top: "var(--space-4)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        maxWidth: "calc(100% - var(--space-6))",
        padding: "var(--space-1) var(--space-3)",
        borderRadius: "var(--radius-full)",
        boxSizing: "border-box",
        background: "var(--color-semantic-background-elevated-normal)",
        border: "1px solid var(--color-semantic-line-normal-alternative)",
        boxShadow: "var(--shadow-sm)",
        color: "var(--color-semantic-label-neutral)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label1-size)",
        lineHeight: "var(--label1-line)",
        /* Never a pointer target: the chip must not steal the press that
           re-enables the control it describes. */
        pointerEvents: "none",
        ...style
      },
      ...rest,
      children: [
        glyph != null && /* @__PURE__ */ jsx(
          Icon,
          {
            name: glyph,
            size: 14,
            "aria-hidden": "true",
            style: { color: neutral ? void 0 : palette.foreground, flex: "none" }
          }
        ),
        /* @__PURE__ */ jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }, children })
      ]
    }
  );
}

export {
  OverlayStatusChip
};
//# sourceMappingURL=chunk-AVHPRYLQ.js.map