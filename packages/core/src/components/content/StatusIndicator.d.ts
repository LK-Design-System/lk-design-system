import * as React from 'react';
import type { StatusTone } from './StatusBadge.jsx';

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 실시간 가용성·연결·freshness를 나타내는 점 톤. @default "positive" */
  tone?: StatusTone;
  /** 실제로 변화 중인 연결·동기화 상태에만 사용하는 부드러운 펄스. @default false */
  pulse?: boolean;
  children?: React.ReactNode;
}

/** 실시간 가용성·연결·freshness를 컬러 점과 명시적 라벨로 표시하는 상태 신호. */
export function StatusIndicator(props: StatusIndicatorProps): React.JSX.Element;
