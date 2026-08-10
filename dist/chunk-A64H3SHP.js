"use client";
import {
  Chip
} from "./chunk-YWI3XRCL.js";
import {
  TextButton
} from "./chunk-LLVRDSFN.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/data/FilterBar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var VARIANT_STYLE = {
  standalone: {
    border: "1px solid var(--color-semantic-line-solid-normal)",
    borderRadius: "var(--radius-md)"
  },
  embedded: {
    borderTop: "1px solid var(--color-semantic-line-solid-normal)",
    borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
    borderRight: 0,
    borderLeft: 0,
    borderRadius: 0
  }
};
var SR_ONLY_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
var APPLIED_CHIP_STYLE = {
  maxWidth: "100%",
  background: "var(--component-chip-bg-selected)",
  border: "var(--component-chip-border-active)",
  color: "var(--color-semantic-label-normal)"
};
function textLabel(value) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}
function FilterBar({
  controls,
  activeFilters = [],
  onRemoveFilter,
  onClearFilters,
  clearLabel = "\uBAA8\uB4E0 \uD544\uD130 \uC9C0\uC6B0\uAE30",
  summaryLabel = "\uC801\uC6A9\uB41C \uD544\uD130",
  resultCount,
  resultCountLabel,
  viewControl,
  actions,
  variant = "standalone",
  size = "md",
  "aria-label": ariaLabel = "\uB370\uC774\uD130 \uD544\uD130",
  style,
  ...rest
}) {
  const compact = size === "sm";
  const filters = Array.isArray(activeFilters) ? activeFilters : [];
  const resolvedVariant = variant === "embedded" ? "embedded" : "standalone";
  const hasSummary = filters.length > 0 || resultCount != null;
  const resultText = resultCountLabel ?? (resultCount != null ? `${resultCount}\uAC1C \uACB0\uACFC` : null);
  const pendingRemovalRef = React.useRef(null);
  React.useEffect(() => {
    const pending = pendingRemovalRef.current;
    if (!pending?.root) return;
    if (filters.some((filter) => filter.id === pending.id)) return;
    pendingRemovalRef.current = null;
    const { root } = pending;
    const chips = [...root.querySelectorAll('[data-removable="true"]')];
    const next = chips[Math.min(pending.index, chips.length - 1)] || root.querySelector("[data-filter-bar-clear]") || root;
    next.focus?.();
  });
  const removeFilter = (filter, index, event) => {
    pendingRemovalRef.current = {
      id: filter.id,
      index,
      root: event?.currentTarget?.closest?.("[data-filter-bar-variant]") ?? null
    };
    onRemoveFilter(filter.id);
  };
  return /* @__PURE__ */ jsxs(
    "section",
    {
      role: "region",
      "aria-label": ariaLabel,
      tabIndex: -1,
      "data-filter-bar-variant": resolvedVariant,
      style: {
        display: "grid",
        gap: compact ? "var(--space-2)" : "var(--space-3)",
        minWidth: 0,
        padding: compact ? "var(--space-3)" : "var(--space-4)",
        background: "var(--color-semantic-background-elevated-normal)",
        fontFamily: "var(--font-sans)",
        ...VARIANT_STYLE[resolvedVariant],
        ...style
      },
      ...rest,
      children: [
        (controls != null || viewControl != null || actions != null) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minWidth: 0 }, children: [
          controls != null && /* @__PURE__ */ jsx("div", { "data-filter-bar-controls": true, style: { display: "flex", alignItems: "flex-end", gap: "var(--space-2)", flex: "1 1 360px", flexWrap: "wrap", minWidth: 0 }, children: controls }),
          (viewControl != null || actions != null) && /* @__PURE__ */ jsxs("div", { "data-filter-bar-actions": true, style: { display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap", minWidth: 0, marginLeft: "auto" }, children: [
            viewControl,
            actions
          ] })
        ] }),
        hasSummary && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", minWidth: 0 }, children: [
          filters.length > 0 && /* @__PURE__ */ jsxs("div", { role: "group", "aria-label": summaryLabel, style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flex: "1 1 360px", flexWrap: "wrap", minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", whiteSpace: "nowrap" }, children: summaryLabel }),
            filters.map((filter, index) => {
              const label = textLabel(filter.label);
              const value = textLabel(filter.value);
              const removeLabel = filter.removeLabel || `${label}${value ? ` ${value}` : ""} \uD544\uD130 \uC81C\uAC70`;
              const removable = typeof onRemoveFilter === "function";
              return /* @__PURE__ */ jsxs(
                Chip,
                {
                  as: removable ? "button" : "span",
                  type: removable ? "button" : void 0,
                  size: "sm",
                  "aria-label": removable ? removeLabel : void 0,
                  onClick: removable ? (event) => removeFilter(filter, index, event) : void 0,
                  "data-removable": removable ? "true" : "false",
                  style: APPLIED_CHIP_STYLE,
                  children: [
                    /* @__PURE__ */ jsxs("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }, children: [
                      filter.label,
                      filter.value != null ? ": " : "",
                      filter.value
                    ] }),
                    removable && /* @__PURE__ */ jsx(Icon, { name: "close", size: 14, "aria-hidden": "true", style: { flexShrink: 0 } })
                  ]
                },
                filter.id
              );
            }),
            onClearFilters && filters.length > 1 && /* @__PURE__ */ jsx(TextButton, { size: "sm", tone: "neutral", "data-filter-bar-clear": "", onClick: onClearFilters, children: clearLabel })
          ] }),
          resultText != null && /* @__PURE__ */ jsx("span", { "data-filter-bar-result": "", style: { marginLeft: "auto", color: "var(--color-semantic-label-alternative)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-medium)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }, children: resultText })
        ] }),
        /* @__PURE__ */ jsx("span", { "data-filter-bar-result-live": "", role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE, children: resultText ?? "" })
      ]
    }
  );
}

export {
  FilterBar
};
//# sourceMappingURL=chunk-A64H3SHP.js.map