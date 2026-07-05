import * as React from 'react';

export interface ToggleButtonProps {
  /** 제어되는 눌림 상태. */
  pressed?: boolean;
  /** 비제어 초기 상태. @default false */
  defaultPressed?: boolean;
  onChange?: (next: boolean) => void;
  /** 선택적 리딩 아이콘 노드. */
  icon?: React.ReactNode;
  /** 높이. @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: React.CSSProperties;
  /** 라벨 — 아이콘 전용 정사각 토글에는 생략. */
  children?: React.ReactNode;
}

/** 상태 유지 토글 버튼 — 눌리면 시안 워시 + 시그널 잉크. */
export function ToggleButton(props: ToggleButtonProps): JSX.Element;
