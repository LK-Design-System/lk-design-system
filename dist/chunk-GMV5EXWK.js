"use client";

// components/selection/pill-chip-style.js
function pillChipStyle(active, disabled, size = "md") {
  const sm = size === "sm";
  return {
    display: "inline-flex",
    alignItems: "center",
    // sm snaps to the small-control height (32) so chips sit flush with
    // small buttons/inputs in dense toolbars; md keeps the default pill.
    height: sm ? "var(--component-button-height-sm)" : "var(--component-filter-chip-height)",
    padding: sm ? "0 12px" : "0 15px",
    background: active ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)",
    border: `1px solid ${active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-solid-normal)"}`,
    borderRadius: "var(--radius-pill)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "var(--font-sans)",
    fontSize: sm ? "var(--label2-size)" : "var(--label1-size)",
    fontWeight: "var(--fw-semibold)",
    letterSpacing: 0,
    color: active ? "var(--color-semantic-primary-heavy)" : "var(--color-semantic-label-neutral)",
    transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
    whiteSpace: "nowrap"
  };
}

export {
  pillChipStyle
};
//# sourceMappingURL=chunk-GMV5EXWK.js.map