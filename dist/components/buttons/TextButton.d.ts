import * as React from "react";

export interface TextButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Text action tone mapped through LK theme tokens. @default "signal" */
  tone?: "signal" | "neutral" | "danger";
  /** color axis. When set, it takes precedence over tone. */
  color?: "primary" | "assistive";
  /** Aliases map small/medium/large to sm/md/lg. @default "md" */
  size?: "sm" | "md" | "lg" | "small" | "medium" | "large";
  /** @deprecated Kept as a no-op compatibility prop. */
  arrow?: boolean;
  /** Draw an underline for link-style usage. @default false */
  underline?: boolean;
  disabled?: boolean;
  /** Disable alias. */
  disable?: boolean;
  /**
   * Show the action loading state and prevent repeated activation. The control
   * stays focusable while loading (`aria-disabled` + `aria-busy` rather than
   * native `disabled`).
   * @default false
   */
  loading?: boolean;
  /** Screen-reader label announced with the loading spinner. @default "불러오는 중" */
  loadingLabel?: string;
  /** Render with another element or component, such as "a". @default "button" */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/** Action/Text Button primitive for low-emphasis text actions. */
export function TextButton(props: TextButtonProps): React.JSX.Element;
