import React from "react";

/* WDS chip geometry: pad-x 7/8/11/12, inter-chip gap 4/6/8/10 (S/M/L/XL). */
const SIZE = {
  small: { height: 24, padding: "0 7px", fontSize: "var(--label2-size)", radius: 6, gap: 4 },
  sm: { height: 24, padding: "0 7px", fontSize: "var(--label2-size)", radius: 6, gap: 4 },
  medium: { height: 32, padding: "0 8px", fontSize: "var(--label1-size)", radius: 8, gap: 6 },
  md: { height: 32, padding: "0 8px", fontSize: "var(--label1-size)", radius: 8, gap: 6 },
  large: { height: 36, padding: "0 11px", fontSize: "var(--body2-size)", radius: 10, gap: 8 },
  lg: { height: 36, padding: "0 11px", fontSize: "var(--body2-size)", radius: 10, gap: 8 },
  xlarge: {
    height: 40,
    padding: "0 12px",
    fontSize: "var(--body2-size)",
    radius: 10,
    gap: 10,
  },
  xl: {
    height: 40,
    padding: "0 12px",
    fontSize: "var(--body2-size)",
    radius: 10,
    gap: 10,
  },
};

function normalizeItem(item) {
  return typeof item === "string" ? { value: item, label: item } : item;
}

/**
 * LDS Core - Category
 * navigation category chips for grouping content by topic.
 */
export function Category({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = "normal",
  size = "medium",
  padding = false,
  verticalPadding = false,
  scroll = "auto",
  style,
  itemStyle,
  ...rest
}) {
  const normalized = items.map(normalizeItem);
  const initial =
    defaultValue ??
    normalized.find((item) => item.active)?.value ??
    normalized[0]?.value;
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(initial);
  const selected = controlled ? value : internal;
  const s = SIZE[size] || SIZE.medium;
  const alternative = variant === "alternative";

  const pick = (item) => {
    if (item.disabled) return;
    if (!controlled) setInternal(item.value);
    onChange?.(item.value, item);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s.gap,
        maxWidth: "100%",
        overflowX: scroll === "auto" || scroll === true ? "auto" : "visible",
        paddingInline: padding ? 20 : 0,
        paddingBlock: verticalPadding ? 8 : 0,
        scrollbarWidth: "none",
        ...style,
      }}
      {...rest}
    >
      {normalized.map((item) => {
        const active = item.value === selected || item.active;
        const colors = alternative
          ? {
              bg: active ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)",
              fg: active ? "var(--color-semantic-primary-heavy)" : "var(--color-semantic-label-neutral)",
              border: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)",
            }
          : {
              bg: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-background-elevated-normal)",
              fg: active ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-neutral)",
              border: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-line-solid-normal)",
            };

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            disabled={item.disabled}
            onClick={() => pick(item)}
            style={{
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
              transition:
                "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)",
              ...itemStyle,
              ...item.style,
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
