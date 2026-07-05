import * as React from 'react';

export interface JoystickChange {
  /** −1..1, 오른쪽이 양수. */
  x: number;
  /** −1..1, 위가 양수. */
  y: number;
}

export interface JoystickProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 지름(px). @default 160 */
  size?: number;
  /** 드래그 중 정규화 좌표 {x,y}(−1..1, y는 위가 양수)로 호출. */
  onChange?: (v: JoystickChange) => void;
  /** 놓았을 때 호출. */
  onEnd?: () => void;
  /** 놓아도 위치 유지(중앙 스냅백 없음). @default false */
  sticky?: boolean;
  /** 비활성. @default false */
  disabled?: boolean;
  /** 하단 라벨. */
  label?: React.ReactNode;
}

/** 텔레옵용 가상 조이스틱 — 포인터 드래그로 {x,y} 반환, 놓으면 중앙 복귀. */
export function Joystick(props: JoystickProps): JSX.Element;
