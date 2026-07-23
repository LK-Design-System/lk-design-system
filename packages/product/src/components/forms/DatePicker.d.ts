import * as React from 'react';

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: Date | string | null;
  defaultValue?: Date | string | null;
  onChange?: (date: Date) => void;
  /** 개별 날짜의 선택 가능 여부. true를 반환하면 그 날짜는 선택할 수 없습니다(예약 불가·휴무일). Calendar 팝오버로 전달됩니다. */
  isDateDisabled?: (date: Date) => boolean;
  /** 이 날짜 이전(당일 제외)은 선택 불가. Date 또는 ISO 문자열. */
  minDate?: Date | string;
  /** 이 날짜 이후(당일 제외)는 선택 불가. Date 또는 ISO 문자열. */
  maxDate?: Date | string;
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** 검증 실패 상태. trigger에 aria-invalid와 negative border를 적용합니다. @default false */
  invalid?: boolean;
  /** 부모 폭을 채우고 고정 최소 폭을 제거합니다. @default false */
  full?: boolean;
  style?: React.CSSProperties;
}

/** Calendar 팝오버를 여는 날짜 필드. */
export function DatePicker(props: DatePickerProps): React.JSX.Element;
