import * as React from 'react';

export interface DateRangeValue {
  start: Date | string | null;
  end: Date | string | null;
}

export interface DateRangeFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** 제어 기간 값. */
  value?: DateRangeValue | null;
  /** 비제어 초기 기간 값. */
  defaultValue?: DateRangeValue;
  /** 시작일 또는 종료일이 바뀔 때 전체 기간과 함께 호출됩니다. */
  onChange?: (value: DateRangeValue) => void;
  startLabel?: React.ReactNode;
  endLabel?: React.ReactNode;
  /** startLabel이 복합 노드일 때 trigger와 placeholder에 사용할 평문 이름. @default "시작일" */
  startAccessibleLabel?: string;
  /** endLabel이 복합 노드일 때 trigger와 placeholder에 사용할 평문 이름. @default "종료일" */
  endAccessibleLabel?: string;
  /** range group accessible name. @default "기간 선택" */
  groupLabel?: string;
  /** 각 field의 보이는 label. 툴바에서는 false로 줄일 수 있으며 accessible name은 유지됩니다. @default true */
  showFieldLabels?: boolean;
  /** 오늘/최근 7일처럼 제품이 날짜 계산을 소유하는 preset control 슬롯. */
  presets?: React.ReactNode;
  invalid?: boolean;
  errorMessage?: React.ReactNode;
  /** 내부 DatePicker 크기. @default "sm" */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

/** 두 DatePicker를 시작·종료 기간 계약으로 묶는 LDS Product 입력 패턴입니다. */
export function DateRangeField(props: DateRangeFieldProps): React.JSX.Element;
