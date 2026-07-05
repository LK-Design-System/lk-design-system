import * as React from 'react';

export interface PushBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 표시할 숫자(`dot`과 함께 쓸 땐 생략). */
  count?: number;
  /** 숫자 대신 점만 표시. @default false */
  dot?: boolean;
  /** 클램프: 초과 값은 "max+"로 표시. @default 99 */
  max?: number;
  /** @default "negative" */
  tone?: 'negative' | 'signal' | 'navy';
  children?: React.ReactNode;
}

/** 자식의 우상단에 붙는 알림 점 / 카운트. */
export function PushBadge(props: PushBadgeProps): JSX.Element;
