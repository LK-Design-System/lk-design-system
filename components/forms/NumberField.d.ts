import * as React from 'react';

export interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

/** 인라인 상/하 스테퍼가 있는 숫자 입력; [min, max]로 클램프. */
export function NumberField(props: NumberFieldProps): JSX.Element;
