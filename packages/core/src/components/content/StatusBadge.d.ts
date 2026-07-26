import * as React from 'react';

export type StatusTone =
  | 'positive'
  | 'online'
  | 'success'
  | 'cautionary'
  | 'warning'
  | 'negative'
  | 'error'
  | 'offline'
  | 'neutral'
  | 'signal'
  | 'info'
  | 'critical';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 의미 기반 배경과 텍스트 톤. 알 수 없는 값은 neutral/offline으로 안전하게 처리합니다. @default "positive" */
  tone?: StatusTone;
  children?: React.ReactNode;
}

/** 현재 상태를 옅은 의미 배경과 명시적 텍스트로 표시하는 비대화형 배지. */
export function StatusBadge(props: StatusBadgeProps): React.JSX.Element;
