import * as React from 'react';

export interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** "HH:MM" 문자열. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 분 증가폭. @default 5 */
  minuteStep?: number;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** 시 + 분 드롭다운(24시간) → "HH:MM". */
export function TimePicker(props: TimePickerProps): JSX.Element;
