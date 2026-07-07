import * as React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  /** Render as a vertical separator. @default false */
  vertical?: boolean;
  /** Optional centered label for an "or" style divider. */
  label?: React.ReactNode;
  /** Horizontal inset in pixels. @default 0 */
  inset?: number;
  /** divider visual weight. @default "normal" */
  variant?: "normal" | "thick";
}

export function Divider(props: DividerProps): JSX.Element;
