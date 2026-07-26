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
  /** 두 노브를 모두 잠급니다. 형제 `Slider`와 같은 API. @default false */
  disabled?: boolean;
  /**
   * 범위 전체의 이름(예: `가격 범위`). `role="group"`의 이름이 되고 각 노브
   * 이름의 접두어(`가격 범위 최솟값`)가 됩니다.
   */
  label?: string;
  /** 하단 노브의 이름. @default "최솟값" */
  minLabel?: string;
  /** 상단 노브의 이름. @default "최댓값" */
  maxLabel?: string;
}

/** 핸들 사이가 시그널 잉크로 채워지는 두 노브 범위. 노브는 서로를 넘지 못합니다. */
export function RangeSlider(props: RangeSliderProps): React.JSX.Element;
