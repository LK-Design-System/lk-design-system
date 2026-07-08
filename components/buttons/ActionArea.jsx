import React from "react";

/**
 * Action Area
 * Bottom action container for primary/secondary actions, optional summaries,
 * captions, sticky placement, and safe-area padding.
 */
export function ActionArea({
  children,
  summary,
  caption,
  sticky = false,
  safeArea = false,
  divider = true,
  compact = false,
  style,
  ...rest
}) {
  return (
    <section
      className="lk-action-area"
      style={{
        display: "grid",
        gap: "var(--component-action-area-gap)",
        padding: compact
          ? "var(--space-3) var(--component-action-area-padding-x)"
          : "var(--component-action-area-padding-y) var(--component-action-area-padding-x)",
        paddingBottom: safeArea
          ? "var(--mobile-bottom-action-padding-bottom)"
          : undefined,
        background: "var(--component-action-area-bg)",
        borderTop: divider ? "var(--component-action-area-border)" : "none",
        boxShadow: sticky
          ? "var(--component-action-area-shadow-sticky)"
          : "none",
        position: sticky ? "sticky" : undefined,
        bottom: sticky ? 0 : undefined,
        zIndex: sticky ? "var(--component-action-area-z-index)" : undefined,
        ...style,
      }}
      {...rest}
    >
      {summary && (
        <div
          style={{
            display: "grid",
            gap: "var(--space-1)",
            color: "var(--label-normal)",
          }}
        >
          {summary}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          alignItems: "center",
          width: "100%",
        }}
      >
        {children}
      </div>
      {caption && (
        <p
          style={{
            margin: 0,
            color: "var(--label-alternative)",
            fontSize: "var(--label2-size)",
            lineHeight: "var(--label2-line)",
            letterSpacing: "var(--label2-spacing)",
          }}
        >
          {caption}
        </p>
      )}
    </section>
  );
}
