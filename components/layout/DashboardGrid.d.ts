import * as React from 'react';

export interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 한 칸의 읽기 가능한 최소 폭. 숫자는 px로 해석합니다. @default 220 */
  minCardWidth?: number | string;
  /** 카드 사이 간격. @default "var(--grid-gutter)" */
  gap?: number | string;
  children?: React.ReactNode;
}

/** 좁은 폭에서는 한 열로 안전하게 접히는 대시보드 카드 auto-fit 그리드. */
export function DashboardGrid(props: DashboardGridProps): React.JSX.Element;
