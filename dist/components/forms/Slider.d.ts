import * as React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  /** 끝의 숫자 표시. @default false */
  showValue?: boolean;
}

/** 범위 슬라이더 — 시그널 잉크로 채워진 트랙, 화이트 노브. */
export function Slider(props: SliderProps): React.JSX.Element;
