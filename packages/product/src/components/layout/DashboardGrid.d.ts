import * as React from 'react';

export interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 한 칸의 읽기 가능한 최소 폭. 숫자는 px로 해석합니다. @default 220 */
  minCardWidth?: number | string;
  /** 카드 사이 간격. @default "var(--grid-gutter)" */
  gap?: number | string;
  /** 중간 폭에서 감긴 마지막 행의 카드가 남은 폭을 채우도록 확장합니다. 열 정렬이 필요한 스캔 비교보다 빈 트랙 제거가 중요할 때만 켭니다. @default false */
  fillLastRow?: boolean;
  children?: React.ReactNode;
}

/** 좁은 폭에서는 한 열로 안전하게 접히는 대시보드 카드 auto-fit 그리드. */
export function DashboardGrid(props: DashboardGridProps): React.JSX.Element;
