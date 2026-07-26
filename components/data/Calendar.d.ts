import * as React from 'react';

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 제어되는 선택 날짜(Date 또는 ISO 문자열). */
  value?: Date | string;
  /** 비제어 초기 날짜. */
  defaultValue?: Date | string;
  onChange?: (date: Date) => void;
  /** 개별 날짜의 선택 가능 여부. true를 반환하면 그 날짜는 선택할 수 없습니다(예약 불가·휴무일). 포커스 이동은 허용되고 선택만 차단됩니다. */
  isDateDisabled?: (date: Date) => boolean;
  /** 이 날짜 이전(당일 제외)은 모두 선택 불가. Date 또는 ISO 문자열. */
  minDate?: Date | string;
  /** 이 날짜 이후(당일 제외)는 모두 선택 불가. Date 또는 ISO 문자열. */
  maxDate?: Date | string;
  /** Focus the selected/today day when embedded in an opened picker dialog. */
  autoFocus?: boolean;
}

/** 날짜 선택용 월 그리드 — 시그널 잉크 선택일, 오늘 링. */
export function Calendar(props: CalendarProps): React.JSX.Element;
