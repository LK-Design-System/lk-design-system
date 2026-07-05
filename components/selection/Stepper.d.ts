import * as React from 'react';

export interface StepperProps {
  /** 제어되는 값. */
  value?: number;
  /** 비제어 초기 값. @default 0 */
  defaultValue?: number;
  /** 하한(클램프). */
  min?: number;
  /** 상한(클램프). */
  max?: number;
  /** 누를 때마다 증가폭. @default 1 */
  step?: number;
  onChange?: (value: number) => void;
  /** 높이. @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** tabular 값의 숫자 +/− 스테퍼; [min, max]로 클램프. */
export function Stepper(props: StepperProps): JSX.Element;
