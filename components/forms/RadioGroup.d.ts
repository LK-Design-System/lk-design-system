import * as React from 'react';

export type RadioOption = string | { value: string; label: React.ReactNode; description?: React.ReactNode; disabled?: boolean };

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 공유 입력 이름. */
  name?: string;
  /** 레이아웃. @default "column" */
  direction?: 'row' | 'column';
  /** 컨트롤과 옵션 행의 크기. compact component scope에서는 기본 `sm`, 그 밖에서는 `md`. */
  size?: 'sm' | 'md' | 'small' | 'medium';
}

/** 옵션별 설명(선택)이 있는 단일 선택 라디오 세트. */
export function RadioGroup(props: RadioGroupProps): React.JSX.Element;
