import * as React from "react";

export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  content: React.ReactNode;
  /** position axis. @default "top" */
  position?: "top" | "bottom" | "left" | "right";
  /** Backward-compatible alias for `position`. */
  placement?: "top" | "bottom" | "left" | "right";
  /** size axis. @default "medium" */
  size?: "small" | "sm" | "medium" | "md";
  /** arrow alignment axis. @default "center" */
  align?:
    "leading" | "center" | "trailing" | "left" | "right" | "top" | "bottom";
  /** shortcut axis. */
  shortcut?: React.ReactNode;
  /** Show arrow. @default true */
  arrow?: boolean;
  /** Force open state for controlled demos. */
  open?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** tooltip with position, size, arrow alignment, and shortcut support. */
export function Tooltip(props: TooltipProps): JSX.Element;
