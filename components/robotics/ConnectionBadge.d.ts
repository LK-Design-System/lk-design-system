import * as React from 'react';

export interface ConnectionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 연결 상태. `ready`는 다른 제어 게이트와 조합되기 전의 연결 전제조건 충족 상태입니다. @default "online" */
  status?: 'connecting' | 'ready' | 'online' | 'reconnecting' | 'weak' | 'stale' | 'error' | 'offline';
  /** 라벨 재정의(기본은 상태별 한국어). */
  label?: React.ReactNode;
  /** 라벨 표시. @default true */
  showLabel?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** 신호 막대 + 라벨의 연결 상태 인디케이터(MQTT / rosbridge). ready는 신호색 전제조건, reconnecting은 깜빡임. */
export function ConnectionBadge(props: ConnectionBadgeProps): React.JSX.Element;
