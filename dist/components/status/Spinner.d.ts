import * as React from "react";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** circular: diameter in px (@default 28). brand: wordmark cap height in px (@default 18). */
  size?: number;
  /** Ring thickness in px (circular only). Defaults to roughly size / 10. */
  thickness?: number;
  /** Active arc color (circular only). @default signal ink */
  color?: string;
  /** loading variant. `brand` rides the LK ROBOTICS wordmark on a wave. @default "circular" */
  variant?: "circular" | "brand";
  /** Optional visible status label. */
  label?: React.ReactNode;
}

/** circular ring or the LK ROBOTICS wordmark-wave brand loader, with reduced-motion handling and an optional label. */
export function Spinner(props: SpinnerProps): React.JSX.Element;
