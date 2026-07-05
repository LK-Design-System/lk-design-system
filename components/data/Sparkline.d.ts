import * as React from 'react';

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  /** 데이터 포인트. */
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** 선 아래 부드러운 영역 채움. @default true */
  fill?: boolean;
  strokeWidth?: number;
}

/** 축 없는 작은 인라인 추세 차트. */
export function Sparkline(props: SparklineProps): JSX.Element;
