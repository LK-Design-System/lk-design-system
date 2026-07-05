import * as React from 'react';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 점 톤. @default "positive" */
  tone?: 'positive' | 'online' | 'cautionary' | 'warning' | 'negative' | 'offline' | 'signal' | 'critical';
  /** 부드러운 실시간 상태 링을 퍼뜨림. @default false */
  pulse?: boolean;
  children?: React.ReactNode;
}

/** 컬러 상태 점 + 라벨(가동중 / 점검중 / 오프라인), 선택적 실시간 펄스. */
export function StatusBadge(props: StatusBadgeProps): JSX.Element;
