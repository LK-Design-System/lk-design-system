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

function useStyleRule(id, css) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

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
  presentation = "standalone",
  onChange,
  getItemLabel,
  groupLabel = "페이지 표시기",
  style,
  ...rest
}) {
  useStyleRule(
    "lk-page-indicator-motion",
    "@media (prefers-reduced-motion: reduce){[data-lds-page-indicator-dot]{transition:none!important}}",
  );

  const total = Math.max(1, count);
  const current = Math.min(total, Math.max(1, page));

  if (variant === "dot" || variant === "dots") {
    const media = presentation === "media";
    const small = size === "small" || size === "sm";
    const dotSize = media ? 8 : small ? 6 : 10;
    const activeDotWidth = media ? 22 : dotSize;
    const dotGap = media ? 0 : small ? 6 : 10;
    const targetWidth = media ? 32 : 24;
    const targetHeight = media ? 44 : 24;
    const interactive = typeof onChange === "function";
    const dotBackground = (active) =>
      media
        ? active
          ? "var(--color-semantic-static-white)"
          : "var(--color-semantic-inverse-label-alternative-soft)"
        : active
          ? alternative
            ? "var(--color-semantic-static-white)"
            : "var(--color-semantic-label-normal)"
          : alternative
            ? "var(--color-semantic-inverse-label-disable-soft)"
            : "var(--color-semantic-fill-strong)";
    const itemLabel = (item) => (
      typeof getItemLabel === "function"
        ? getItemLabel(item, total)
        : `${item}페이지로 이동`
    );
    const visualDot = (active) => ({
      width: active ? activeDotWidth : dotSize,
      height: dotSize,
      borderRadius: media ? "var(--radius-pill)" : "50%",
      background: dotBackground(active),
      transition: media ? "width var(--dur-base) var(--ease-out)" : undefined,
    });

    return (
      <div
        role="group"
        aria-label={groupLabel}
        data-page-indicator-presentation={media ? "media" : "standalone"}
        data-page-indicator-variant="dots"
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
              <button
                key={p}
                type="button"
                aria-current={active ? (media ? "true" : "page") : undefined}
                aria-disabled={media && active ? true : undefined}
                aria-label={itemLabel(p)}
                onClick={() => {
                  if (!media || !active) onChange(p);
                }}
                style={{
                  flex: "0 0 auto",
                  width: targetWidth,
                  height: targetHeight,
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  color: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: media && active ? "default" : "pointer",
                }}
              >
                <span
                  aria-hidden="true"
                  data-lds-page-indicator-dot={active ? "active" : "inactive"}
                  style={visualDot(active)}
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
                return media ? (
                  <span
                    key={p}
                    style={{
                      width: targetWidth,
                      height: targetHeight,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      data-lds-page-indicator-dot={active ? "active" : "inactive"}
                      style={visualDot(active)}
                    />
                  </span>
                ) : (
                  <span
                    key={p}
                    data-lds-page-indicator-dot={active ? "active" : "inactive"}
                    style={visualDot(active)}
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
      data-page-indicator-presentation="standalone"
      data-page-indicator-variant="counter"
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
