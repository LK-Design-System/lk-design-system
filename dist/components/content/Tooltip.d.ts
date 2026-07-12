import * as React from "react";

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
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
  /** 제어된 열림 상태. */
  open?: boolean;
  /** 비제어 초기 열림 상태. @default false */
  defaultOpen?: boolean;
  /** 열림 상태 변경 알림. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

/** tooltip with position, size, arrow alignment, and shortcut support. */
export function Tooltip(props: TooltipProps): React.JSX.Element;
