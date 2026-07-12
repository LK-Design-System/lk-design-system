import * as React from 'react';

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: Date | string | null;
  defaultValue?: Date | string | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** 부모 폭을 채우고 고정 최소 폭을 제거합니다. @default false */
  full?: boolean;
  style?: React.CSSProperties;
}

/** Calendar 팝오버를 여는 날짜 필드. */
export function DatePicker(props: DatePickerProps): React.JSX.Element;
