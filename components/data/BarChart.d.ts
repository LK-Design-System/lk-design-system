import * as React from 'react';

export interface BarDatum {
  label: React.ReactNode;
  value: number;
  color?: string;
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarDatum[];
  height?: number;
  gap?: number;
  showValue?: boolean;
  color?: string;
}

/** 공유 최대 스케일을 기준으로 한 단순 세로 막대 차트. */
export function BarChart(props: BarChartProps): JSX.Element;
