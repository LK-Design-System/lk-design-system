import React from "react";

/**
 * Action Area
 * Bottom action container for primary/secondary actions, optional summaries,
 * captions, sticky placement, and safe-area padding.
 *
 * Element contract: a plain `div` by default. An unnamed `<section>` conveys
 * nothing to assistive tech (it is not even exposed as a landmark), so the
 * generic wrapper is the honest default. When the consumer names the area with
 * `aria-label` / `aria-labelledby` it renders as a `<section>` instead, which
 * becomes a real named `region` landmark.
 */
export function ActionArea({
  children,
  summary,
  caption,
  sticky = false,
  safeArea = false,
  divider = true,
  compact = false,
  align = "start",
  style,
  ...rest
}) {
  const named = rest["aria-label"] != null || rest["aria-labelledby"] != null;
  const Root = named ? "section" : "div";
  return (
    <Root
      className="lk-action-area"
      style={{
        display: "grid",
        gap: "var(--component-action-area-gap)",
        padding: compact
          ? "var(--space-3) var(--component-action-area-padding-x)"
          : "var(--component-action-area-padding-y) var(--component-action-area-padding-x)",
        ...(safeArea
          ? { paddingBottom: "var(--mobile-bottom-action-padding-bottom)" }
          : {}),
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
            color: "var(--color-semantic-label-normal)",
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
          justifyContent: {
            start: "flex-start",
            end: "flex-end",
            center: "center",
            between: "space-between",
          }[align] || "flex-start",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {children}
      </div>
      {caption && (
        <p
          style={{
            margin: 0,
            color: "var(--color-semantic-label-alternative)",
            fontSize: "var(--label2-size)",
            lineHeight: "var(--label2-line)",
            letterSpacing: "var(--label2-spacing)",
          }}
        >
          {caption}
        </p>
      )}
    </Root>
  );
}
