import * as React from 'react';

export interface LineChartPoint {
  x: number;
  y: number;
}

export interface LineChartSeries {
  name?: string;
  color?: string;
  dashed?: boolean;
  points: LineChartPoint[];
}

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 시리즈 배열. 각 시리즈는 {name, color, dashed, points:[{x,y}]}. */
  series?: LineChartSeries[];
  width?: number;
  height?: number;
  xLabel?: React.ReactNode;
  yLabel?: string;
  /** y축 눈금 개수. @default 4 */
  yTicks?: number;
  /** 범례 표시. @default true */
  showLegend?: boolean;
  formatX?: (v: number) => React.ReactNode;
  formatY?: (v: number) => React.ReactNode;
}

/** 축이 있는 다중 시리즈 라인 차트(시계열·지표 곡선). data 패밀리의 라인 보완재. */
export function LineChart(props: LineChartProps): JSX.Element;
