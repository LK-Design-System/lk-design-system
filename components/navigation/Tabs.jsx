import React from "react";

const SIZE = {
  small: { height: 40, fontSize: 14, paddingX: 12, indicator: 2 },
  sm: { height: 40, fontSize: 14, paddingX: 12, indicator: 2 },
  medium: { height: 48, fontSize: 15, paddingX: 16, indicator: 2.5 },
  md: { height: 48, fontSize: 15, paddingX: 16, indicator: 2.5 },
  large: { height: 56, fontSize: 16, paddingX: 20, indicator: 3 },
  lg: { height: 56, fontSize: 16, paddingX: 20, indicator: 3 },
};

/**
 * LK ROBOTICS - Tabs
 * underline tab navigation. Supports hug/fill resize, size, padding,
 * optional trailing icon button slot, and horizontal scrolling.
 */
export function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  full = false,
  resize,
  size = "medium",
  padding = false,
  trailingIconButton = false,
  scroll = "auto",
  style,
  ...rest
}) {
  const norm = items.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(
    defaultValue != null ? defaultValue : norm[0]?.value,
  );
  const selected = isControlled ? value : internal;
  const s = SIZE[size] || SIZE.medium;
  const fill = resize === "fill" || full;

  const pick = (item) => {
    if (item.disabled) return;
    if (!isControlled) setInternal(item.value);
    onChange?.(item.value, item);
  };

  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: fill ? 0 : 8,
        maxWidth: "100%",
        overflowX: scroll === "auto" || scroll === true ? "auto" : "visible",
        paddingInline: padding ? 8 : 0,
        borderBottom: "1px solid var(--bw-border)",
        scrollbarWidth: "none",
        ...style,
      }}
      {...rest}
    >
      {norm.map((item) => {
        const active = item.value === selected || item.active;
        const trailing =
          item.trailingIconButton ?? item.trailing ?? trailingIconButton;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => pick(item)}
            style={{
              flex: fill ? 1 : "0 0 auto",
              minWidth: 0,
              position: "relative",
              height: s.height,
              padding: `0 ${s.paddingX}px`,
              border: "none",
              background: "transparent",
              cursor: item.disabled ? "not-allowed" : "pointer",
              opacity: item.disabled ? 0.45 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              fontFamily: "var(--font-sans)",
              fontSize: s.fontSize,
              fontWeight: active ? "var(--fw-bold)" : "var(--fw-semibold)",
              letterSpacing: 0,
              color: active
                ? "var(--label-normal)"
                : "var(--label-alternative)",
              whiteSpace: "nowrap",
              transition: "color var(--dur-fast) var(--ease-out)",
              ...item.style,
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.label}
            </span>
            {item.count != null && (
              <span
                style={{
                  fontSize: Math.max(11, s.fontSize - 2),
                  fontWeight: "var(--fw-bold)",
                  color: active
                    ? "var(--lk-accent-ink)"
                    : "var(--label-assistive)",
                }}
              >
                {item.count}
              </span>
            )}
            {trailing && (
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active
                    ? "var(--label-normal)"
                    : "var(--label-alternative)",
                }}
              >
                {trailing === true ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                ) : (
                  trailing
                )}
              </span>
            )}
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: s.paddingX,
                right: s.paddingX,
                bottom: -1,
                height: s.indicator,
                borderRadius: "2px 2px 0 0",
                background: active ? "var(--label-normal)" : "transparent",
                transition: "background var(--dur-fast) var(--ease-out)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
