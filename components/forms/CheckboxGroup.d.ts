import * as React from 'react';

export type CheckboxOption = string | { value: string; label: React.ReactNode; description?: React.ReactNode; disabled?: boolean };

export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: CheckboxOption[];
  /** 선택된 값들. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** 레이아웃. @default "column" */
  direction?: 'row' | 'column';
}

/** 다중 선택 체크박스 세트; 값은 선택된 값들의 배열. */
export function CheckboxGroup(props: CheckboxGroupProps): JSX.Element;
