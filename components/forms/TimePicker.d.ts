import * as React from 'react';

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** "HH:MM" 문자열. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 분 증가폭. @default 5 */
  minuteStep?: number;
  /** 시 select의 accessible name. @default "시" */
  hourLabel?: string;
  /** 분 select의 accessible name. @default "분" */
  minuteLabel?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

/** Native 시 + 분 select(24시간) → "HH:MM". */
export function TimePicker(props: TimePickerProps): React.JSX.Element;
