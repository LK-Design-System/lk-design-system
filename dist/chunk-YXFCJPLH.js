"use client";
import {
  StatusBadge
} from "./chunk-YZIOOD3Y.js";
import {
  getUnitSeparator,
  isAttachedUnit,
  normalizeUnit,
  normalizeValueText
} from "./chunk-AA5WJWOJ.js";
import {
  normalizeStatusTone
} from "./chunk-L2ZEGNVF.js";

// components/editor/ViewportStatusBar.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var STATUS_LABEL = {
  negative: "\uC704\uD5D8",
  cautionary: "\uC8FC\uC758",
  positive: "\uC815\uC0C1",
  signal: "\uD65C\uC131",
  offline: "\uC0C1\uD0DC"
};
var PRIORITY_ORDER = { high: 0, normal: 1, low: 2 };
function numericStyle(mono) {
  return {
    fontVariantNumeric: "tabular-nums",
    fontFamily: mono ? "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)" : "inherit"
  };
}
function StatusValue({ item }) {
  const renderedValue = normalizeValueText(item.value);
  const normalizedUnit = normalizeUnit(item.unit);
  const unitSeparator = getUnitSeparator(normalizedUnit);
  const attachedUnit = isAttachedUnit(normalizedUnit);
  const lockup = /* @__PURE__ */ jsxs(
    "span",
    {
      "data-viewport-status-value": "",
      "data-unit-attachment": normalizedUnit === "" ? "none" : attachedUnit ? "attached" : "spaced",
      style: { display: "inline-flex", alignItems: "center", minWidth: 0, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...numericStyle(item.mono) },
      children: [
        /* @__PURE__ */ jsx("span", { children: renderedValue }),
        normalizedUnit !== "" && /* @__PURE__ */ jsxs("span", { children: [
          unitSeparator,
          normalizedUnit
        ] })
      ]
    }
  );
  const tone = item.tone != null && item.tone !== "default" ? normalizeStatusTone(item.tone) : null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "strong",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          minWidth: 0,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: "var(--color-semantic-label-strong)",
          fontWeight: "var(--fw-bold)"
        },
        children: lockup
      }
    ),
    tone && /* @__PURE__ */ jsx(
      StatusBadge,
      {
        "data-viewport-status-tone": "",
        tone,
        style: { minWidth: 0, maxWidth: "100%", overflow: "hidden", flexShrink: 1 },
        children: item.toneLabel ?? STATUS_LABEL[tone]
      }
    )
  ] });
}
function PersistentItem({ item }) {
  const priority = item.priority ?? "normal";
  const shrink = priority === "high" ? 0 : priority === "low" ? 2 : 1;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      title: item.title,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        flex: `0 ${shrink} auto`,
        minWidth: priority === "high" ? "max-content" : 0,
        maxWidth: "100%",
        overflow: "hidden",
        color: "var(--color-semantic-label-neutral)",
        fontSize: "var(--caption1-size)",
        lineHeight: "var(--caption1-line)",
        fontWeight: "var(--fw-medium)",
        letterSpacing: 0
      },
      children: [
        /* @__PURE__ */ jsx("span", { style: { flexShrink: 0, whiteSpace: "nowrap" }, children: item.label }),
        /* @__PURE__ */ jsx(StatusValue, { item })
      ]
    }
  );
}
function ViewportStatusBar({
  label = "\uBDF0\uD3EC\uD2B8 \uC0C1\uD0DC",
  items = [],
  message,
  messageTone = "default",
  messageToneLabel,
  children,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const orderedItems = items.map((item, index) => ({ item, index })).sort((a, b) => {
    const priorityDifference = (PRIORITY_ORDER[a.item.priority ?? "normal"] ?? 1) - (PRIORITY_ORDER[b.item.priority ?? "normal"] ?? 1);
    return priorityDifference || a.index - b.index;
  });
  const resolvedMessageTone = messageTone === "default" ? null : normalizeStatusTone(messageTone);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      role: "group",
      "aria-label": ariaLabel ?? label,
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        minWidth: 0,
        width: "100%",
        overflow: "hidden",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        message != null && /* @__PURE__ */ jsxs(
          "span",
          {
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", minWidth: 0, maxWidth: "min(46%, 420px)", overflow: "hidden", flex: "0 1 auto" },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "data-viewport-status-message": "",
                  style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-semibold)" },
                  children: message
                }
              ),
              resolvedMessageTone && /* @__PURE__ */ jsx(
                StatusBadge,
                {
                  "data-viewport-message-tone": "",
                  tone: resolvedMessageTone,
                  style: { minWidth: 0, maxWidth: "100%", overflow: "hidden", flexShrink: 0 },
                  children: messageToneLabel ?? STATUS_LABEL[resolvedMessageTone]
                }
              )
            ]
          }
        ),
        orderedItems.map(({ item, index }) => /* @__PURE__ */ jsx(PersistentItem, { item }, item.key ?? `${String(item.label)}-${index}`)),
        children != null && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", minWidth: 0, overflow: "hidden", marginLeft: "auto", flex: "0 1 auto" }, children })
      ]
    }
  );
}

export {
  ViewportStatusBar
};
//# sourceMappingURL=chunk-YXFCJPLH.js.map