import React from "react";

const COUNTER_SIZE = {
  small: { height: 26, padding: "0 10px", fontSize: "var(--label2-size)" },
  sm: { height: 26, padding: "0 10px", fontSize: "var(--label2-size)" },
  medium: { height: 34, padding: "0 12px", fontSize: "var(--body2-size)" },
  md: { height: 34, padding: "0 12px", fontSize: "var(--body2-size)" },
};

/* Visually hidden but exposed to assistive technology. */
const srOnlyStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
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
  groupLabel = "페이지 표시기",
  style,
  ...rest
}) {
  const total = Math.max(1, count);
  const current = Math.min(total, Math.max(1, page));

  if (variant === "dot" || variant === "dots") {
    const small = size === "small" || size === "sm";
    const dotSize = small ? 6 : 10;
    const dotGap = small ? 6 : 10;
    const interactive = typeof onChange === "function";
    const dotBackground = (active) =>
      active
        ? alternative
          ? "var(--color-semantic-static-white)"
          : "var(--color-semantic-label-normal)"
        : alternative
          ? "var(--color-semantic-inverse-label-disable-soft)"
          : "var(--color-semantic-fill-strong)";
    return (
      <div
        role="group"
        aria-label={groupLabel}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: dotGap,
          ...style,
        }}
        {...rest}
      >
        {interactive ? (
          Array.from({ length: total }).map((_, index) => {
            const p = index + 1;
            const active = p === current;
            return (
              /* 24x24 minimum hit area (WCAG 2.5.8) around the visual dot. */
              <button
                key={p}
                type="button"
                aria-current={active ? "page" : undefined}
                aria-label={`${p}페이지로 이동`}
                onClick={() => onChange(p)}
                style={{
                  width: 24,
                  height: 24,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: "50%",
                    background: dotBackground(active),
                  }}
                />
              </button>
            );
          })
        ) : (
          <>
            <span style={srOnlyStyle}>{`${current}번째 / 전체 ${total}`}</span>
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: dotGap,
              }}
            >
              {Array.from({ length: total }).map((_, index) => {
                const p = index + 1;
                const active = p === current;
                return (
                  <span
                    key={p}
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: "50%",
                      background: dotBackground(active),
                    }}
                  />
                );
              })}
            </span>
          </>
        )}
      </div>
    );
  }

  const s = COUNTER_SIZE[size] || COUNTER_SIZE.medium;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: s.height,
        padding: s.padding,
        borderRadius: "var(--radius-pill)",
        background: alternative ? "var(--color-semantic-label-normal)" : "var(--color-semantic-fill-strong)",
        color: alternative ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-neutral)",
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
