import * as React from 'react';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 고정 컬럼 수. */
  columns?: number;
  /** 반응형: auto-fill용 최소 트랙 폭(px 또는 CSS). */
  minItemWidth?: number | string;
  /** 갭. @default 20 */
  gap?: number | string;
  children?: React.ReactNode;
}

/** CSS 그리드 프리미티브 — 고정 `columns` 또는 반응형 `minItemWidth`. */
export function Grid(props: GridProps): JSX.Element;
