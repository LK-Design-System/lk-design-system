import * as React from 'react';

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 제어되는 선택 날짜(Date 또는 ISO 문자열). */
  value?: Date | string;
  /** 비제어 초기 날짜. */
  defaultValue?: Date | string;
  onChange?: (date: Date) => void;
}

/** 날짜 선택용 월 그리드 — 시그널 잉크 선택일, 오늘 링. */
export function Calendar(props: CalendarProps): JSX.Element;
