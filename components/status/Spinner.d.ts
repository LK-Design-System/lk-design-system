import * as React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Diameter in px. Defaults to 28 for `circular` and 32 for `wanted`. */
  size?: number;
  /** Ring thickness in px. Defaults to roughly size / 10. */
  thickness?: number;
  /** Active arc color. @default signal ink */
  color?: string;
  /** loading variant. @default "circular" */
  variant?: "circular" | "wanted";
  /** Optional visible status label. */
  label?: React.ReactNode;
}

/** circular or Wanted loading indicator with reduced-motion handling and optional label. */
export function Spinner(props: SpinnerProps): JSX.Element;
