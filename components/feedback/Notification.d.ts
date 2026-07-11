import * as React from 'react';

export interface NotificationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  /** `<time dateTime>`으로 전달되는 기계 판독용 절대 시각(ISO 8601). */
  dateTime?: string;
  /** 리딩 아이콘 chip에 적용할 status tone. 생략하면 중립 chip입니다. */
  tone?: 'positive' | 'cautionary' | 'negative' | 'signal' | 'offline';
  /** 안읽음 primary 워시 + primary 점. @default false */
  unread?: boolean;
  /** 제공하면 행을 키보드 접근 가능한 native button으로 렌더링합니다. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/** 알림 행 — 아이콘 타일 · 제목 · 설명 · 시간 · 안읽음 상태. */
export function Notification(props: NotificationProps): JSX.Element;
