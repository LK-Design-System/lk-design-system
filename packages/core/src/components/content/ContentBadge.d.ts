import * as React from "react";

export interface ContentBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Legacy LDS tone. Prefer `color="neutral" | "accent"` for parity. */
  tone?:
    | "signal"
    | "accent"
    | "navy"
    | "neutral"
    | "positive"
    | "cautionary"
    | "warning"
    | "negative";
  /** color axis. @default "neutral" */
  color?: "neutral" | "accent";
  /** visual variant. `soft` and `outline` are legacy aliases. @default "default" */
  variant?: "solid" | "default" | "outlined" | "soft" | "outline";
  /** size axis. `sm`, `md`, and `lg` are legacy aliases. @default "small" */
  size?: "xsmall" | "xs" | "small" | "sm" | "medium" | "md" | "lg";
  /** Icon slot alias for the leading icon by default. */
  icon?: React.ReactNode;
  /** Places `icon` before or after text. @default "start" */
  iconPosition?: "start" | "end";
  /** Explicit leading slot. */
  leading?: React.ReactNode;
  /** Explicit trailing slot. */
  trailing?: React.ReactNode;
  /** Custom accent background for `customize = accentBackgroundColor`. */
  accentBackgroundColor?: string;
  /** Custom accent text/icon color for `customize = accentContentColor`. */
  accentContentColor?: string;
  children?: React.ReactNode;
}

/** Content Badge for short content state or attribute labels. */
export function ContentBadge(props: ContentBadgeProps): React.JSX.Element;
