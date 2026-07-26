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
  /** Alternative dark color treatment. Geometry remains identical for the selected size. @default false */
  alternative?: boolean;
  /**
   * Visual context for dot indicators. `media` is an LDS extension used over
   * Carousel scrims: inactive dots are 8px and the active dot is a 22x8px pill.
   * @default "standalone"
   */
  presentation?: "standalone" | "media";
  /**
   * Enables clickable dots when `variant="dot"`. Each dot becomes a button
   * with a 24x24px standalone or 32x44px media target.
   */
  onChange?: (page: number) => void;
  /**
   * Accessible label for an interactive item. Defaults to
   * `"{page}페이지로 이동"`; Carousel supplies the slide name and position.
   */
  getItemLabel?: (page: number, count: number) => string;
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
