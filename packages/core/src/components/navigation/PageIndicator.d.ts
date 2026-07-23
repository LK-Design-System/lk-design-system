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
  /**
   * Enables clickable dots when `variant="dot"`. Each dot becomes a button
   * labeled `"{n}페이지로 이동"` with a 24x24px minimum hit area (WCAG 2.5.8)
   * around the unchanged visual dot.
   */
  onChange?: (page: number) => void;
  /**
   * Accessible name of the dot group container. @default "페이지 표시기"
   */
  groupLabel?: string;
}

/**
 * compact page indicator counter or dot group. Non-interactive dots are
 * aria-hidden and the position is announced via visually hidden text
 * (`"{page}번째 / 전체 {count}"`); the counter renders as plain text.
 */
export function PageIndicator(props: PageIndicatorProps): React.JSX.Element;
