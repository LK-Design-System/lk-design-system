"use client";

// components/navigation/Category.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var SIZE = {
  small: { height: 24, padding: "0 7px", fontSize: "var(--label2-size)", radius: 6, gap: 4 },
  sm: { height: 24, padding: "0 7px", fontSize: "var(--label2-size)", radius: 6, gap: 4 },
  medium: { height: 32, padding: "0 8px", fontSize: "var(--label1-size)", radius: 8, gap: "var(--space-1-5)" },
  md: { height: 32, padding: "0 8px", fontSize: "var(--label1-size)", radius: 8, gap: "var(--space-1-5)" },
  large: { height: 36, padding: "0 11px", fontSize: "var(--body2-size)", radius: 10, gap: 8 },
  lg: { height: 36, padding: "0 11px", fontSize: "var(--body2-size)", radius: 10, gap: 8 },
  xlarge: {
    height: 40,
    padding: "0 12px",
    fontSize: "var(--body2-size)",
    radius: 10,
    gap: "var(--space-2-5)"
  },
  xl: {
    height: 40,
    padding: "0 12px",
    fontSize: "var(--body2-size)",
    radius: 10,
    gap: "var(--space-2-5)"
  }
};
function normalizeItem(item) {
  return typeof item === "string" ? { value: item, label: item } : item;
}
function Category({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = "normal",
  size = "medium",
  padding = false,
  verticalPadding = false,
  scroll = "auto",
  ariaLabel = "\uCE74\uD14C\uACE0\uB9AC",
  className,
  style,
  itemStyle,
  ...rest
}) {
  const groupRef = React.useRef(null);
  const normalized = items.map(normalizeItem);
  const initial = defaultValue ?? normalized.find((item) => item.active)?.value ?? normalized[0]?.value;
  const controlled = value !== void 0;
  const [internal, setInternal] = React.useState(initial);
  const selected = controlled ? value : internal;
  const s = SIZE[size] || SIZE.medium;
  const alternative = variant === "alternative";
  const selectedItem = normalized.find((item) => item.value === selected);
  const tabStopValue = selectedItem && !selectedItem.disabled ? selectedItem.value : normalized.find((item) => !item.disabled)?.value;
  const pick = (item) => {
    if (item.disabled) return;
    if (!controlled) setInternal(item.value);
    onChange?.(item.value, item);
  };
  const move = (event, item) => {
    const prevKeys = ["ArrowLeft", "ArrowUp"];
    const nextKeys = ["ArrowRight", "ArrowDown"];
    if (!prevKeys.includes(event.key) && !nextKeys.includes(event.key) && event.key !== "Home" && event.key !== "End")
      return;
    const enabledItems = normalized.filter((candidate) => !candidate.disabled);
    const currentIndex = enabledItems.findIndex((candidate) => candidate.value === item.value);
    if (currentIndex < 0 || enabledItems.length === 0) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (prevKeys.includes(event.key)) nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    if (nextKeys.includes(event.key)) nextIndex = (currentIndex + 1) % enabledItems.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = enabledItems.length - 1;
    const nextItem = enabledItems[nextIndex];
    pick(nextItem);
    Array.from(groupRef.current?.querySelectorAll('[role="radio"]') ?? []).find((chip) => chip.dataset.categoryValue === String(nextItem.value))?.focus();
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...rest,
      ref: groupRef,
      className: ["lk-scroll-surface", className].filter(Boolean).join(" "),
      "data-scrollbar": "compact",
      "data-scroll-gutter": "auto",
      role: "radiogroup",
      "aria-label": ariaLabel,
      style: {
        display: "flex",
        alignItems: "center",
        gap: s.gap,
        maxWidth: "100%",
        overflowX: scroll === "auto" || scroll === true ? "auto" : "visible",
        paddingInline: padding ? 20 : 0,
        paddingBlock: verticalPadding ? 8 : 0,
        ...style
      },
      children: normalized.map((item) => {
        const active = item.value === selected;
        const colors = alternative ? {
          bg: active ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)",
          fg: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
          border: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"
        } : {
          bg: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-background-elevated-normal)",
          fg: active ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-neutral)",
          border: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-line-solid-normal)"
        };
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": active,
            tabIndex: item.value === tabStopValue ? 0 : -1,
            "data-category-value": item.value,
            disabled: item.disabled,
            onClick: () => pick(item),
            onKeyDown: (event) => move(event, item),
            style: {
              flex: "0 0 auto",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: s.height,
              padding: s.padding,
              border: `1px solid ${colors.border}`,
              borderRadius: s.radius,
              background: colors.bg,
              color: colors.fg,
              fontFamily: "var(--font-sans)",
              fontSize: s.fontSize,
              fontWeight: "var(--fw-medium)",
              letterSpacing: 0,
              whiteSpace: "nowrap",
              cursor: item.disabled ? "not-allowed" : "pointer",
              opacity: item.disabled ? 0.45 : 1,
              transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
              ...itemStyle,
              ...item.style
            },
            children: item.label
          },
          item.value
        );
      })
    }
  );
}

export {
  Category
};
//# sourceMappingURL=chunk-EVASCNAZ.js.map