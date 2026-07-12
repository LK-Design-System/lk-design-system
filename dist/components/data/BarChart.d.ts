import * as React from 'react';

export interface BarDatum {
  id?: React.Key;
  label: React.ReactNode;
  /** 복합 label을 대신해 텍스트 요약에 사용할 이름. */
  accessibleLabel?: string;
  value: number;
  color?: string;
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarDatum[];
  height?: number;
  gap?: number;
  showValue?: boolean;
  color?: string;
  /** 차트가 무엇을 비교하는지 설명하는 스크린 리더용 문장. */
  description?: React.ReactNode;
  /** 자동 생성되는 "label: value" 요약을 재정의합니다. */
  summary?: React.ReactNode;
  /** 데이터 배열이 비었을 때 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" */
  emptyLabel?: React.ReactNode;
}

/** 접근 가능한 이름과 결정적 텍스트 요약이 있는 단순 세로 막대 차트. */
export function BarChart(props: BarChartProps): React.JSX.Element;
