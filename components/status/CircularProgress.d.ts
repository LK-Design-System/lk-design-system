import * as React from 'react';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Current value for determinate progress. @default 0 */
  value?: number;
  /** Maximum value for determinate progress. @default 100 */
  max?: number;
  /** Diameter in px. @default 48 */
  size?: number;
  /** Ring thickness in px. @default 5 */
  thickness?: number;
  /** Arc tone. @default "signal" */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative';
  /** Shows an unknown-duration rotating arc. @default false */
  indeterminate?: boolean;
  /** Accessible label for the progress indicator. */
  label?: React.ReactNode;
  /** Shows the computed percentage in the center for determinate progress. @default false */
  showValue?: boolean;
}

/** Circular progress indicator with determinate and indeterminate states. */
export function CircularProgress(props: CircularProgressProps): JSX.Element;
