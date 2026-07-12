import * as React from 'react';

export interface DonutSegment {
  id?: React.Key;
  value: number;
  label?: React.ReactNode;
  /** 복합 label을 대신해 텍스트 요약에 사용할 이름. */
  accessibleLabel?: string;
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
  /** 차트가 무엇을 구성하는지 설명하는 스크린 리더용 문장. */
  description?: React.ReactNode;
  /** 자동 생성되는 합계·세그먼트·비율 요약을 재정의합니다. */
  summary?: React.ReactNode;
  /** 세그먼트 배열이 비었을 때 가운데에 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" */
  emptyLabel?: React.ReactNode;
}

/** 실제 합계, 결정적 텍스트 요약, 0합계 처리가 있는 링 차트. */
export function DonutChart(props: DonutChartProps): React.JSX.Element;
