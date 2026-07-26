"use client";

// components/overlay/anchored-panel-style.js
function anchoredPanelStyle(width) {
  return {
    position: "absolute",
    zIndex: 40,
    width,
    maxWidth: "calc(100vw - var(--space-8))",
    boxSizing: "border-box",
    background: "var(--color-semantic-background-elevated-normal)",
    border: "1px solid var(--color-semantic-line-solid-normal)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-md)",
    padding: "var(--space-4)",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--label1-size)",
    lineHeight: "var(--label1-line)",
    color: "var(--color-semantic-label-neutral)"
  };
}

export {
  anchoredPanelStyle
};
//# sourceMappingURL=chunk-AUE7ZNXQ.js.map