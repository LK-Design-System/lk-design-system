import React from "react";

/* WDS tab model: zero horizontal item padding, 24px inter-tab gap,
 * constant 2px label-width indicator. S=15 (body2), M/L=17 (headline2). */
const SIZE = {
  small: { height: 40, fontSize: "var(--body2-size)", countSize: 13 },
  sm: { height: 40, fontSize: "var(--body2-size)", countSize: 13 },
  medium: { height: 48, fontSize: "var(--headline2-size)", countSize: 15 },
  md: { height: 48, fontSize: "var(--headline2-size)", countSize: 15 },
  large: { height: 56, fontSize: "var(--headline2-size)", countSize: 15 },
  lg: { height: 56, fontSize: "var(--headline2-size)", countSize: 15 },
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
        gap: fill ? 0 : 24,
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
              padding: 0,
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
              fontWeight: "var(--fw-semibold)",
              letterSpacing: 0,
              color: active
                ? "var(--color-semantic-label-normal)"
                : "var(--color-semantic-label-alternative)",
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
                  fontSize: s.countSize,
                  fontWeight: "var(--fw-semibold)",
                  color: active
                    ? "var(--color-semantic-primary-normal)"
                    : "var(--color-semantic-label-assistive)",
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
                    ? "var(--color-semantic-label-normal)"
                    : "var(--color-semantic-label-alternative)",
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
                left: 0,
                right: 0,
                bottom: -1,
                height: 2,
                borderRadius: 0,
                background: active ? "var(--color-semantic-label-normal)" : "transparent",
                transition: "background var(--dur-fast) var(--ease-out)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
