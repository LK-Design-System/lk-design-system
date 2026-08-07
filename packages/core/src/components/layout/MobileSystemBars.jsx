import React from "react";

/**
 * Layout Essential helper for mock mobile status and home bars.
 * This is for design-system previews, not production OS chrome.
 */
export function MobileSystemBars({
  platform = "ios",
  showStatus = true,
  showHome = true,
  time = "9:41",
  style,
  ...rest
}) {
  const isAndroid = platform === "android";

  return (
    <div
      aria-hidden="true"
      style={{
        display: "grid",
        gridTemplateRows: `${showStatus ? "auto" : "0"} 1fr ${showHome ? "auto" : "0"}`,
        minHeight: 220,
        color: "var(--component-system-bars-fg)",
        pointerEvents: "none",
        ...style,
      }}
      {...rest}
    >
      {showStatus && (
        <div
          style={{
            minHeight: "var(--mobile-status-bar-min-height)",
            paddingInline: "var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "var(--caption1-size)",
            fontWeight: "var(--fw-bold)",
          }}
        >
          <span>{time}</span>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <span>{isAndroid ? "LTE" : "5G"}</span>
            {/* The battery outline is OS chrome, not product UI, so it is drawn
                in raw pixels like the rest of this glyph. It used to ask for
                `--radius-xs`, which the ramp never defined — the declaration was
                invalid and the outline rendered as a hard rectangle. The ramp
                now defines that step at 4px, but 4px is half of this glyph's
                8px height, which would round the ends into a capsule instead of
                a battery. Real status-bar batteries carry about a third of
                their height. */}
            <span
              style={{
                width: 18,
                height: 8,
                border: "1px solid currentColor",
                borderRadius: 2,
              }}
            />
          </span>
        </div>
      )}

      <span />

      {showHome && (
        <div
          style={{
            height: "var(--mobile-home-indicator-height)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <span
            style={{
              width: "var(--component-system-bars-home-width)",
              height: "var(--component-system-bars-home-height)",
              borderRadius: "var(--radius-pill)",
              background: isAndroid
                ? "var(--component-system-bars-muted-fg)"
                : "var(--component-system-bars-fg)",
            }}
          />
        </div>
      )}
    </div>
  );
}
