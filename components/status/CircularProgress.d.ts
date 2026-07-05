import * as React from 'react';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number;
  max?: number;
  /** 지름(px). @default 48 */
  size?: number;
  /** 링 너비(px). @default 5 */
  thickness?: number;
  /** @default "signal" */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative';
  /** 가운데 퍼센트 표시. @default false */
  showValue?: boolean;
}

/** 값이 정해진 링 게이지 — 시그널 잉크 호, 선택적 가운데 퍼센트. */
export function CircularProgress(props: CircularProgressProps): JSX.Element;
