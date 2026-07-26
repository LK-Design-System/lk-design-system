import * as React from 'react';

export interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'fill'> {
  /** 데이터 포인트. */
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** 선 아래 부드러운 영역 채움. @default true */
  fill?: boolean;
  strokeWidth?: number;
  /** 추세의 맥락을 설명하는 스크린 리더용 문장. */
  description?: string;
  /** 자동 생성되는 시작·최저·최고·마지막 값 요약을 재정의합니다. */
  summary?: string;
  /** 데이터가 비었을 때 보이는 문구이자 텍스트 요약. @default "데이터가 없습니다" */
  emptyLabel?: string;
  /** 텍스트 요약에서 수치를 포맷합니다. */
  formatValue?: (value: number) => string;
}

/** 접근 가능한 이름과 결정적 수치 요약이 있는 축 없는 인라인 추세 차트. */
export function Sparkline(props: SparklineProps): React.JSX.Element;
