"use client";
import {
  getUnitSeparator,
  isAttachedUnit,
  normalizeUnit,
  normalizeValueText
} from "./chunk-WIUSXU3M.js";
import {
  StatusBadge
} from "./chunk-BNPFEXZC.js";

// components/editor/ViewportStatusBar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var STATUS_TONE = {
  negative: { badge: "negative", label: "\uC704\uD5D8" },
  cautionary: { badge: "cautionary", label: "\uC8FC\uC758" },
  danger: { badge: "negative", label: "\uC704\uD5D8" },
  warning: { badge: "cautionary", label: "\uC8FC\uC758" },
  positive: { badge: "positive", label: "\uC815\uC0C1" },
  signal: { badge: "signal", label: "\uD65C\uC131" }
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
      style: { display: "inline-block", minWidth: 0, maxWidth: "100%", whiteSpace: "nowrap", ...numericStyle(item.mono) },
      children: [
        /* @__PURE__ */ jsx("span", { children: renderedValue }),
        normalizedUnit !== "" && /* @__PURE__ */ jsxs("span", { children: [
          unitSeparator,
          normalizedUnit
        ] })
      ]
    }
  );
  if (item.tone != null && item.tone !== "default") {
    const tone = STATUS_TONE[item.tone] ?? { badge: "offline", label: "\uC0C1\uD0DC" };
    return /* @__PURE__ */ jsxs(StatusBadge, { tone: tone.badge, style: { minWidth: 0, maxWidth: "100%", overflow: "hidden", flexShrink: 1 }, children: [
      lockup,
      /* @__PURE__ */ jsxs("span", { style: { whiteSpace: "nowrap" }, children: [
        "\xB7 ",
        item.toneLabel ?? tone.label
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx(
    "strong",
    {
      style: {
        display: "inline-block",
        minWidth: 0,
        maxWidth: "100%",
        whiteSpace: "nowrap",
        color: "var(--color-semantic-label-strong)",
        fontWeight: "var(--fw-bold)"
      },
      children: lockup
    }
  );
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
        alignItems: "baseline",
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
  const messageToneConfig = STATUS_TONE[messageTone];
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
        message != null && /* @__PURE__ */ jsx(
          "span",
          {
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            style: { display: "inline-flex", alignItems: "center", minWidth: 0, maxWidth: "min(46%, 420px)", overflow: "hidden", flex: "0 1 auto" },
            children: messageToneConfig ? /* @__PURE__ */ jsxs(StatusBadge, { tone: messageToneConfig.badge, style: { minWidth: 0, maxWidth: "100%", overflow: "hidden" }, children: [
              /* @__PURE__ */ jsx("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: message }),
              /* @__PURE__ */ jsxs("span", { style: { whiteSpace: "nowrap" }, children: [
                "\xB7 ",
                messageToneLabel ?? messageToneConfig.label
              ] })
            ] }) : /* @__PURE__ */ jsx("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", color: "var(--color-semantic-label-strong)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-semibold)" }, children: message })
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
//# sourceMappingURL=chunk-M64BQBTQ.js.map