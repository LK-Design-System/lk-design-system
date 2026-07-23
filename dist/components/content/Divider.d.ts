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
  /**
   * 순전히 시각적인 선일 때 `true`. `role="none"` + `aria-hidden` 이 붙어
   * 접근성 트리에서 빠집니다. 기본값 `false` 는 의미 있는 구분선으로
   * `role="separator"`(가로형은 네이티브 `<hr>`)로 노출됩니다.
   * @default false
   */
  decorative?: boolean;
}

export function Divider(props: DividerProps): React.JSX.Element;
