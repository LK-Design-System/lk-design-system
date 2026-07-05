import * as React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 현재 값. @default 0 */
  value?: number;
  /** Maximum. @default 100 */
  max?: number;
  /** 시간을 알 수 없는 작업에는 세그먼트를 미끄러뜨림. @default false */
  indeterminate?: boolean;
  /** 채움 톤. @default "signal" */
  tone?: 'signal' | 'positive' | 'cautionary' | 'negative';
  /** 트랙 높이. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** 트랙 위 라벨. */
  label?: React.ReactNode;
  /** 오른쪽 정렬 퍼센트 표시. @default false */
  showValue?: boolean;
}

/** 시그널 잉크로 채워지는 필 진행 트랙(결정형 또는 비결정형). */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
