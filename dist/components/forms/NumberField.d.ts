import * as React from 'react';

export interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'size' | 'style' | 'type'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  /**
   * 편집 중에는 파싱된 중간값이 그대로 전달되고, blur / Enter / 스테퍼로 값이
   * 확정될 때 [min, max]로 클램프된 값이 다시 전달됩니다.
   */
  onChange?: (value: number) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  invalid?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** 스테퍼를 포함한 입력 셸의 스타일. */
  style?: React.CSSProperties;
  /** label/helper/error를 포함한 전체 필드 스타일. */
  fieldStyle?: React.CSSProperties;
}

/** 인라인 상/하 스테퍼가 있는 숫자 입력; 값 확정 시 [min, max]로 클램프. */
export function NumberField(props: NumberFieldProps): React.JSX.Element;
