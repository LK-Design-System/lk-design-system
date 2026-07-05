import * as React from 'react';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 대문자 라벨. */
  label?: React.ReactNode;
  /** 큰 값. */
  value?: React.ReactNode;
  /** 증감: 숫자 → 자동 상/하 화살표와 함께 "+N%", 또는 노드. */
  delta?: number | React.ReactNode;
  /** 증감 방향 강제. @default "auto" */
  deltaTone?: 'auto' | 'up' | 'down' | 'flat';
  caption?: React.ReactNode;
  icon?: React.ReactNode;
}

/** KPI 타일 — 라벨 · 큰 값 · 증감 칩 · 캡션. */
export function MetricCard(props: MetricCardProps): JSX.Element;
