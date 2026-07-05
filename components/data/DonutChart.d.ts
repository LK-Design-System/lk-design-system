import * as React from 'react';

export interface DonutSegment {
  value: number;
  label?: React.ReactNode;
  color?: string;
}

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  /** 가운데에 합계 표시. @default true */
  showTotal?: boolean;
  /** 가운데 텍스트 재정의. */
  centerLabel?: React.ReactNode;
  /** 측면 범례. @default true */
  legend?: boolean;
}

/** 가운데 합계 + 측면 범례가 있는 링 차트. */
export function DonutChart(props: DonutChartProps): JSX.Element;
