import * as React from "react";

export interface PageIndicatorProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, 1-based. @default 1 */
  page?: number;
  /** Total pages. @default 1 */
  count?: number;
  /** Counter pill or dot indicator. @default "counter" */
  variant?: "counter" | "dot" | "dots";
  /** size axis: counter small 26, counter medium 34; dot small 6, dot medium 10. @default "medium" */
  size?: "small" | "sm" | "medium" | "md";
  /** Alternative dark counter/dot treatment. @default false */
  alternative?: boolean;
  /** Enables clickable dots when `variant="dot"`. */
  onChange?: (page: number) => void;
}

/** compact page indicator counter or dot group. */
export function PageIndicator(props: PageIndicatorProps): React.JSX.Element;
