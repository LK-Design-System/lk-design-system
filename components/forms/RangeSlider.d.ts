import * as React from 'react';

export interface RangeSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** [low, high] 튜플. */
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: [number, number]) => void;
  /** low/high 값 표시. @default false */
  showValue?: boolean;
}

/** 핸들 사이가 시그널 잉크로 채워지는 두 노브 범위. */
export function RangeSlider(props: RangeSliderProps): JSX.Element;
