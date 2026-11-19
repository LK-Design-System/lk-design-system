import * as React from 'react';

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** minute precision: "HH:MM". second precision: "HH:MM:SS". */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 분 증가폭. @default 5 */
  minuteStep?: number;
  /** Output precision; minute preserves the existing two-select API. @default "minute" */
  precision?: 'minute' | 'second';
  /** units commits each native change; field drafts in a Popover and commits on 확인. @default "units" */
  presentation?: 'units' | 'field';
  /** Inclusive same-day minimum, HH:MM or HH:MM:SS. Invalid/reversed bounds disable selection. */
  minTime?: string;
  /** Inclusive same-day maximum, HH:MM or HH:MM:SS. */
  maxTime?: string;
  /** Inclusive same-day clock intervals (HH:MM or HH:MM:SS), intersected with minTime/maxTime. Omitted permits the bound range; [] or invalid intervals disable all choices. Dates and endpoint semantics remain consumer-owned. */
  allowedTimeRanges?: readonly {start: string; end: string}[];
  /** 초 증가폭(1~60); precision="second"일 때 사용. @default 1 */
  secondStep?: number;
  /** 시 select의 accessible name. @default "시" */
  hourLabel?: string;
  /** 분 select의 accessible name. @default "분" */
  minuteLabel?: string;
  /** 초 select의 accessible name. @default "초" */
  secondLabel?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

/** Native 시 + 분 (+ 선택적 초) select; 날짜와 timezone은 소비자가 소유합니다. */
export function TimePicker(props: TimePickerProps): React.JSX.Element;
