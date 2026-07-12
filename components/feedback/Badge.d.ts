import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 색상 톤. @default "signal" */
  tone?: 'signal' | 'navy' | 'steel' | 'amber' | 'red';
  /** 필 대신 상태 점만 렌더. @default false */
  dot?: boolean;
  children?: React.ReactNode;
}

/** 작은 상태/카운트 토큰 — 솔리드 필 또는 상태 점. */
export function Badge(props: BadgeProps): React.JSX.Element;
