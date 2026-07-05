import * as React from 'react';

export interface SwitchProps {
  /** 제어되는 on/off 상태. */
  checked?: boolean;
  /** 비제어 초기 상태. @default false */
  defaultChecked?: boolean;
  /** 토글 시 다음 불리언과 함께 호출. */
  onChange?: (next: boolean) => void;
  /** 선택적 끝 라벨. */
  label?: React.ReactNode;
  /** 트랙 크기. @default "md" */
  size?: 'sm' | 'md';
  /** 비활성(흐림, 상호작용 불가). @default false */
  disabled?: boolean;
  id?: string;
}

/** on/off 토글 — 켜지면 시그널 잉크 트랙, 미끄러지는 화이트 노브. */
export function Switch(props: SwitchProps): JSX.Element;
