import * as React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value. @default 0 */
  value?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** Shows an unknown-duration moving segment instead of a fixed percentage. @default false */
  indeterminate?: boolean;
  /** Fill tone. @default "signal" */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative';
  /** Custom fill color (CSS color value or token, e.g. "var(--bw-green)"). Overrides `tone` when set. */
  color?: string;
  /** Track height. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Optional visible label. */
  label?: React.ReactNode;
  /** Shows the computed percentage beside the label. @default false */
  showValue?: boolean;
}

/** Linear progress indicator with determinate and indeterminate states. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
