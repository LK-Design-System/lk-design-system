import React from "react";

const COUNTER_SIZE = {
  small: { height: 26, padding: "0 10px", fontSize: "var(--label2-size)" },
  sm: { height: 26, padding: "0 10px", fontSize: "var(--label2-size)" },
  medium: { height: 34, padding: "0 12px", fontSize: "var(--body2-size)" },
  md: { height: 34, padding: "0 12px", fontSize: "var(--body2-size)" },
};

/**
 * LDS Core - PageIndicator
 * Compact page indicator as a counter pill or pagination dots.
 */
export function PageIndicator({
  page = 1,
  count = 1,
  variant = "counter",
  size = "medium",
  alternative = false,
  onChange,
  style,
  ...rest
}) {
  const total = Math.max(1, count);
  const current = Math.min(total, Math.max(1, page));

  if (variant === "dot" || variant === "dots") {
    const small = size === "small" || size === "sm";
    const dotSize = small ? 6 : 10;
    const dotGap = small ? 6 : 10;
    return (
      <div
        role="group"
        aria-label="page indicator"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: dotGap,
          ...style,
        }}
        {...rest}
      >
        {Array.from({ length: total }).map((_, index) => {
          const p = index + 1;
          const active = p === current;
          const Dot = onChange ? "button" : "span";
          return (
            <Dot
              key={p}
              type={onChange ? "button" : undefined}
              aria-current={active ? "page" : undefined}
              aria-label={onChange ? `page ${p}` : undefined}
              onClick={onChange ? () => onChange(p) : undefined}
              style={{
                width: dotSize,
                height: dotSize,
                padding: 0,
                border: "none",
                borderRadius: "50%",
                background: active
                  ? alternative
                    ? "var(--static-white)"
                    : "var(--label-normal)"
                  : alternative
                    ? "var(--inverse-label-disable)"
                    : "var(--fill-strong)",
                cursor: onChange ? "pointer" : "default",
              }}
            />
          );
        })}
      </div>
    );
  }

  const s = COUNTER_SIZE[size] || COUNTER_SIZE.medium;
  return (
    <span
      role="status"
      aria-label={`page ${current} of ${total}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: s.height,
        padding: s.padding,
        borderRadius: "var(--radius-pill)",
        background: alternative ? "var(--label-normal)" : "var(--fill-strong)",
        color: alternative ? "var(--text-on-inverse)" : "var(--label-neutral)",
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {current} / {total}
    </span>
  );
}
