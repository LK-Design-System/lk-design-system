import * as React from 'react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 지름(px). @default 24 */
  size?: number;
  /** 링 두께(px)(기본값 size/10). */
  thickness?: number;
  /** 호 색상. @default signal ink */
  color?: string;
  /** 선택적 끝 라벨. */
  label?: React.ReactNode;
}

/** 차분한 원형 로딩 인디케이터. */
export function Spinner(props: SpinnerProps): JSX.Element;
