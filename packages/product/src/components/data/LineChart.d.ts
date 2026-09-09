import * as React from 'react';

export interface LineChartPoint {
  x: number;
  y: number;
}

export interface LineChartSeries {
  id?: React.Key;
  name?: string;
  /** 범례 이름과 별개로 텍스트 요약에서 사용할 시리즈 이름. */
  accessibleLabel?: string;
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
  /** 시점 조회 툴팁. 좌우 방향키 및 Home/End로 이동합니다. @default false */
  showTooltip?: boolean;
  /** 결측 시점까지 선택할 수 있도록 제품이 제공하는 x 좌표. */
  tooltipXValues?: number[];
  /** 선택 시점의 상세 내용. 집계 단위와 결측 의미는 제품에서 정의합니다. */
  renderTooltip?: (x: number) => React.ReactNode;
  referenceLines?: LineChartReferenceLine[];
  emptyLabel?: React.ReactNode;
  formatX?: (v: number) => React.ReactNode;
  formatY?: (v: number) => React.ReactNode;
  /** 차트가 무엇의 추이를 보여주는지 설명하는 스크린 리더용 문장. */
  description?: React.ReactNode;
  /**
   * 자동 생성되는 요약을 재정의합니다. 자동 요약은 시리즈별 시작·최저·최고·마지막 값에
   * 이어 그려진 `referenceLines`의 이름·값과 그 선을 넘긴 시리즈를 덧붙입니다.
   */
  summary?: React.ReactNode;
}

/** 접근 가능한 이름과 결정적 시리즈 요약이 있는 다중 시리즈 라인 차트. */
export function LineChart(props: LineChartProps): React.JSX.Element;
