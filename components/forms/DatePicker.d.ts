import * as React from 'react';

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: Date | string;
  defaultValue?: Date | string;
  onChange?: (date: Date) => void;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** Calendar 팝오버를 여는 날짜 필드. */
export function DatePicker(props: DatePickerProps): JSX.Element;
