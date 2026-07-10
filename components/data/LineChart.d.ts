import * as React from 'react';

export interface LineChartPoint {
  x: number;
  y: number;
}

export interface LineChartSeries {
  id?: React.Key;
  name?: string;
  color?: string;
  dashed?: boolean;
  points: LineChartPoint[];
}

export interface LineChartReferenceLine {
  id?: React.Key;
  y: number;
  label?: React.ReactNode;
  color?: string;
  dashed?: boolean;
}

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 시리즈 배열. 각 시리즈는 {id?, name, color, dashed, points:[{x,y}]}. */
  series?: LineChartSeries[];
  width?: number;
  height?: number;
  xLabel?: React.ReactNode;
  yLabel?: string;
  xTicks?: number | number[];
  /** y축 분할 수. @default 4 */
  yTicks?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
  /** y domain에 0을 포함합니다. @default true */
  includeZero?: boolean;
  /** grid line 표시. @default true */
  showGrid?: boolean;
  /** 범례 표시. @default true */
  showLegend?: boolean;
  /** point marker 표시. @default false */
  showPoints?: boolean;
  referenceLines?: LineChartReferenceLine[];
  emptyLabel?: React.ReactNode;
  formatX?: (v: number) => React.ReactNode;
  formatY?: (v: number) => React.ReactNode;
  description?: string;
}

/** 추이가 있는 다중 시리즈 라인 차트. */
export function LineChart(props: LineChartProps): JSX.Element;
