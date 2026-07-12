import * as React from 'react';

export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange' | 'aria-pressed'> {
  /** 제어되는 눌림 상태. */
  pressed?: boolean;
  /** 비제어 초기 상태. @default false */
  defaultPressed?: boolean;
  onChange?: (next: boolean) => void;
  /** 선택적 리딩 아이콘 노드. */
  icon?: React.ReactNode;
  /** Button family height scale: 32 / 40 / 48. @default "md" */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';
  /** Disabled alias retained for compatibility. */
  disable?: boolean;
  /** 아이콘 전용 정사각 토글은 구체적인 aria-label을 제공해야 합니다. */
  children?: React.ReactNode;
}

/** 상태 유지 토글 버튼 — 눌리면 primary wash와 aria-pressed 상태를 함께 전달합니다. */
export function ToggleButton(props: ToggleButtonProps): React.JSX.Element;
